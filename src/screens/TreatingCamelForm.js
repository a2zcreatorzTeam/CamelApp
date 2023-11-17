import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import 'react-native-gesture-handler';
import * as ArabicText from '../language/EnglishToArabic';
import RNFS from 'react-native-fs';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../components/PleaseWait';
import Ads from '../components/Ads';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import HorizontalCarousel from '../components/HorizontalCarousel';
import VideoModal from '../components/VideoModal';
import BackBtnHeader from '../components/headerWithBackBtn';
const width = Dimensions.get('screen').width;
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

class TreatingCamelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      location: '',
      description: '',
      // image: [],
      imageArray: '',
      color: '',
      camel_type: '',
      imageFlage: false,
      video: undefined,
      videoForPost: undefined,
      imagesForPost: [],
      image: undefined,
      cameraimage: [],

      cameraimagesForPost: [],
      pauseVideo: true,
      mixedMedia: [],
      mixed: [],
      controls: false,
      progress: null,
      loading: false,
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
    };
  }
  //VIDEO PICKER
  videoPicker = async () => {
    this.setState({video: {}});
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      if (video?.size > 10000000) {
        Toast.show({
          text1: ArabicText?.Videomustbelessthen10MB,
          type: 'error',
          visibilityTime: 3000,
        });
      } else {
        RNFS.readFile(video.path, 'base64')
          .then(res => {
            this.setState({videoForPost: 'data:video/mp4;base64,' + res});
            let tempMixed = this.state.mixed;
            let mixed = this.state.mixed;
            let videoFlag = false;
            if (tempMixed?.length > 0) {
              tempMixed.map((item, index) => {
                if (item?.mime != undefined) {
                  if (item?.mime.includes('video') === true) {
                    mixed[index] = video;
                    videoFlag = true;
                  }
                }
              });
              if (videoFlag === false) {
                mixed.push(video);
              }
              this.setState({mixed: mixed, video: video});
            } else {
              tempMixed.push(video);
              this.setState({mixed: tempMixed, video: video});
            }
          })
          .catch(err => {
            console.log(err.message, err.code);
          });
      }
    });
  };
  // SELECT FROM GALLERY
  openGallery() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      // selectionLimit: 4,
    })
      .then(async images => {
        // if (images?.length <= 4) {
        let tempImage = images;
        let bse64images = this.state.imagesForPost;
        let mixedTemp = [];
        for (let i = 0; i < tempImage?.length; i++) {
          bse64images.push('data:image/png;base64,' + images[i].data);
          mixedTemp.push(tempImage[i]);
        }
        this.setState({imagesForPost: bse64images, image: tempImage});
        this.setState(previousState => {
          return {mixed: [...previousState?.mixed, ...mixedTemp]};
        });
        // } else {
        //   alert('Only 4 images allowed');
        // }
        // console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  // CAPTURE IMAGE FROM CAMERA
  openCameraForCapture() {
    const {cameraimagesForPost, mixed} = this.state;
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(async images => {
        if (images) {
          let mixedTemp = [];
          mixedTemp.push(images);
          if (cameraimagesForPost?.length > 0) {
            this.setState(previousState => {
              return {
                cameraimagesForPost: [
                  ...previousState?.cameraimagesForPost,
                  'data:image/png;base64,' + images?.data,
                ],
              };
            });
          } else {
            this.setState({
              cameraimagesForPost: ['data:image/png;base64,' + images?.data],
            });
          }
          this.setState(previousState => {
            return {
              mixed: [...previousState?.mixed, ...mixedTemp],
            };
          });
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createPostTreatingCamels = async () => {
    const {videoForPost} = this.state;

    var image1 = this.state.imagesForPost;
    var image2 = this.state.cameraimagesForPost;
    var combineImages = [...image1, ...image2];
    if (
      (combineImages == undefined || combineImages?.length == 0) &&
      videoForPost == undefined
    ) {
      console.log('ifff');
      return Toast.show({
        text1: ArabicText?.cannotpostwithoutmedia,
        type: 'error',
        visibilityTime: 3000,
      });
    }
    if (
      this.state.title != '' &&
      this.state.description != '' &&
      this.state.location != '' &&
      this.state.color != '' &&
      this.state.camel_type != ''
      //  &&
      // this.state.mixed.length != 0
    ) {
      let {user} = this.props;
      let user_id = user.user.user.id;
      this.setState({loading: true});
      camelapp
        .post('/add/treatment', {
          user_id: user_id,
          title: this.state.title,
          location: this.state.location,
          description: this.state.description,
          color: this.state.color,
          camel_type: this.state.camel_type,
          images: combineImages ? combineImages : [],
          video: videoForPost ? videoForPost : null,
        })
        .then(response => {
          this.setState({
            loading: false,
            video: undefined,
            videoForPost: undefined,
            imagesForPost: undefined,
            image: undefined,
            cameraimage: [],
            cameraimagesForPost: undefined,
          });
          Toast.show({
            text1: ArabicText.Post_added_successfully,
            type: 'success',
            visibilityTime: 3000,
          });
          this.props.navigation.replace('CamelTreatmentList');
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    } else {
      return Toast.show({
        text1: ArabicText.Please_complete_the_fields + '',
        type: 'error',
        visibilityTime: 3000,
      });
    }
  };
  componentDidMount() {
    console.log('component 257 trating camel');
  }
  // REMOVE ITEM
  removeItem = i => {
    const {mixed} = this.state;
    const filteredList = mixed?.filter((item, index) => {
      return index !== i;
    });
    this.setState({mixed: filteredList});
  };
  render() {
    const {pausedCheck, loadVideo, videoModal, modalItem, mixed} = this.state;
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: width * 0.1,
          backgroundColor: '#fff',
        }}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        <BackBtnHeader />
        {/* <Ads /> */}
        <View style={Styles.containerScroll}>
          <Text
            style={{
              marginTop: 5,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#D2691Eff',
            }}>
            علاج الحلال
          </Text>
          {mixed?.length ? (
            <HorizontalCarousel
              CustomUrl
              price={
                this.state.itemFromDetails?.price
                  ? this.state.itemFromDetails?.price
                  : ''
              }
              imagesArray={mixed}
              onPress={mediaSource => {
                this.setState({
                  pausedCheck: false,
                  videoModal: true,
                  modalItem: mediaSource,
                });
              }}
              pausedCheck={pausedCheck}
              pauseVideo={() => {
                this.setState({pausedCheck: true});
              }}
            />
          ) : null}
          {this.state.imageFlage && (
            <Image
              source={{
                uri: this.state.image,
              }}
              style={Styles.image}></Image>
          )}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.videoPicker()}>
                <FontAwesome name="video-camera" size={30} color="#D2691Eff" />
              </TouchableOpacity>
            </View>
            {/* Click pic from camera */}
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.openCameraForCapture()}>
                <Ionicons name="md-camera-sharp" size={30} color="#D2691Eff" />
              </TouchableOpacity>
            </View>
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.openGallery()}>
                <Ionicons name="images-outline" size={30} color="#D2691Eff" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={Styles.forminputs}
            placeholder={ArabicText.Title}
            placeholderTextColor="#b0b0b0"
            value={this.state.title}
            onChangeText={text => {
              if (text.length <= 24) {
                this.setState({title: text});
              } else {
                Toast.show({
                  text1: ArabicText?.limitCharacters,
                  type: 'error',
                  visibilityTime: 3000,
                });
              }
            }}></TextInput>

          <TextInput
            style={Styles.forminputs}
            placeholder={ArabicText.Color}
            placeholderTextColor="#b0b0b0"
            value={this.state.color}
            onChangeText={text => {
              if (text.length <= 24) {
                this.setState({color: text});
              } else {
                Toast.show({
                  text1: ArabicText?.limitCharacters,
                  type: 'error',
                  visibilityTime: 3000,
                });
              }
            }}></TextInput>

          <TextInput
            style={Styles.forminputs}
            placeholder={ArabicText.Type}
            placeholderTextColor="#b0b0b0"
            value={this.state.camel_type}
            onChangeText={text => {
              if (text.length <= 24) {
                this.setState({camel_type: text});
              } else {
                Toast.show({
                  text1: ArabicText?.limitCharacters,
                  type: 'error',
                  visibilityTime: 3000,
                });
              }
            }}></TextInput>

          <TextInput
            style={Styles.forminputs}
            placeholder={ArabicText.Location}
            placeholderTextColor="#b0b0b0"
            value={this.state.location}
            onChangeText={text => {
              if (text.length <= 24) {
                this.setState({location: text});
              } else {
                Toast.show({
                  text1: ArabicText?.limitCharacters,
                  type: 'error',
                  visibilityTime: 3000,
                });
              }
            }}></TextInput>

          <TextInput
            style={[Styles.inputdecrp, {marginTop: 20}]}
            placeholder={ArabicText.Description}
            placeholderTextColor="#b0b0b0"
            value={this.state.description}
            multiline
            onChangeText={text => {
              if (text.length <= 300) {
                this.setState({description: text});
              } else {
                Toast.show({
                  text1: ArabicText?.description,
                  type: 'error',
                  visibilityTime: 3000,
                });
              }
            }}></TextInput>
          <Loader loading={this.state.loading} />
          <TouchableOpacity onPress={() => this.createPostTreatingCamels()}>
            <View style={Styles.btnform}>
              <Text style={Styles.textbtn}>{ArabicText.add}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* VIDEO MODAL */}
        <VideoModal
          onLoadStart={() => {
            this.setState({loadVideo: true});
          }}
          onReadyForDisplay={() => {
            this.setState({loadVideo: false});
          }}
          onPress={() => {
            !loadVideo && this.setState({pausedCheck: !pausedCheck});
          }}
          closeModal={() => {
            this.setState({videoModal: false, pausedCheck: true});
          }}
          pausedCheck={pausedCheck}
          loadVideo={loadVideo}
          videoModal={videoModal}
          modalItem={modalItem}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TreatingCamelForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});