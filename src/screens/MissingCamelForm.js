import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
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
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
import BackBtnHeader from '../components/headerWithBackBtn';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
const {width} = Dimensions.get('screen');
import {createThumbnail} from 'react-native-create-thumbnail';

class MissingCamelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      location: '',
      description: '',
      image: undefined,
      cameraimage: [],

      cameraimagesForPost: [],
      imageArray: '',
      color: '',
      camel_type: '',
      imageFlage: false,
      video: undefined,
      videoForPost: undefined,
      imagesForPost: [],
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
      thumbnail: null,
    };
  }
  // VIDEO PICKER
  selectVideo = async () => {
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
        createThumbnail({
          url: video?.path,
          timeStamp: 10000,
        })
          .then(response => this.setState({thumbnail: response}))
          .catch(err => console.log({err}));
        RNFS.readFile(video.path, 'base64')
          .then(res => {
            this.setState({videoForPost: 'data:video/mp4;base64,' + res});
            let tempMixed = this.state.mixed;
            let mixed = this.state.mixed;
            let videoFlag = false;
            if (tempMixed.length > 0) {
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
    })
      .then(async images => {
        let tempImage = images;
        let bse64images = this?.state?.imagesForPost;
        let mixedTemp = [];
        for (let i = 0; i < tempImage?.length; i++) {
          bse64images.push('data:image/png;base64,' + images[i].data);
          mixedTemp.push(tempImage[i]);
        }
        this.setState({imagesForPost: bse64images, image: tempImage});
        this.setState(previousState => {
          return {mixed: [...previousState?.mixed, ...mixedTemp]};
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  // SELECT FROM CAMERA
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
  createPostMissingCamelForm = async () => {
    const {
      videoForPost,
      thumbnail,
      imagesForPost,
      cameraimagesForPost,
      title,
      description,
      location,
      color,
      camel_type,
    } = this.state;
    let thumbnailObj;
    if (thumbnail && thumbnail != {}) {
      const thumbnailContent =
        thumbnail && (await RNFS?.readFile(thumbnail?.path, 'base64'));
      thumbnailObj = thumbnailContent && {
        ...thumbnail,
        path: thumbnailContent,
      };
    }
    var image1 = imagesForPost;
    var image2 = cameraimagesForPost;
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
    if (combineImages?.length > 4) {
      return Toast.show({
        text1: ArabicText?.Only4imagesareallowed,
        type: 'error',
        visibilityTime: 3000,
      });
    }
    if (
      title != '' &&
      description != '' &&
      location != '' &&
      color != '' &&
      camel_type != ''
    ) {
      let {user} = this.props;
      let user_id = user?.user?.user.id;
      this.setState({loading: true});
      camelapp
        .post('/add/missing', {
          user_id: user_id,
          title: title,
          location: location,
          description: description,
          color: color,
          camel_type: camel_type,
          images: combineImages ? combineImages : [],
          video: videoForPost ? videoForPost : null,
          thumbnail: thumbnailObj ? JSON.stringify(thumbnailObj) : null,
        })
        .then(response => {
          console.log(response, 'resp[onse');
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
          // this.props.navigation.navigate('Home');
          this.props.navigation.replace('CamelMissingList');
        })
        .catch(error => {
          this.setState({loading: false});
          console.log('error', error);
        });
    } else {
      this.setState({loading: false});
      return Toast.show({
        text1: ArabicText.Please_complete_the_fields + '',
        type: 'error',
        visibilityTime: 3000,
      });
    }
  };
  // REMOVE ITEM
  removeItem = i => {
    const {mixed} = this.state;
    const filteredList = mixed?.filter((item, index) => {
      return index !== i;
    });
    this.setState({mixed: filteredList});
  };

  render() {
    const {pausedCheck, loadVideo, videoModal, modalItem, thumbnail} =
      this.state;
    console.log('missingcamelform');
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={Styles.scrollContentContainer}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        <BackBtnHeader />
        {/* <Ads /> */}
        <View style={Styles.containerScroll}>
          <Text style={[Styles.headingPostText, {marginTop: 30}]}>
            {ArabicText.Missing_Camel}
          </Text>
          <HorizontalCarousel
            thumbnail={thumbnail?.path}
            removeItem={index => this.removeItem(index)}
            price={
              this.state.itemFromDetails?.price
                ? this.state.itemFromDetails?.price
                : ''
            }
            CustomUrl
            imagesArray={this.state.mixed}
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

          {this.state.imageFlage && (
            <Image
              source={{
                uri: this.state.image,
              }}
              style={Styles.image}></Image>
          )}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.selectVideo()}>
                <FontAwesome name="video-camera" size={30} color="#D2691Eff" />
              </TouchableOpacity>
            </View>
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
            textAlignVertical="top"
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
          <TouchableOpacity onPress={() => this.createPostMissingCamelForm()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(MissingCamelForm);
