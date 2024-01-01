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

class CamelFemaleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      location: '',
      description: '',
      image: undefined,
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
      cameraimage: [],

      cameraimagesForPost: [],
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
      thumbnail: {},
    };
  }
  // SELECT VIDEO
  openCamera = async () => {
    this.setState({video: {}});
    console.log("6555");
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
          .then(response => {
            this.setState({thumbnail: response}), console.log('heythumbmaill');
          })
          .catch(err => console.log({err}));
        console.log('8333');
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
  // CAPTURE IMAGE
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
        // else {
        //   alert(" IF Only 4 images allowed")
        // }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  // SELECT FROM GALLERY
  openGallery() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      selectionLimit: 4,
    })
      .then(async images => {
        // if (images.length <= 4) {
        let tempImage = images;
        let bse64images = this.state.imagesForPost;
        let mixedTemp = [];
        for (let i = 0; i < tempImage.length; i++) {
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
  // POST
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
    const thumbnailContent = await RNFS.readFile(thumbnail?.path, 'base64');
    const thumbnailObj = {...thumbnail, path: thumbnailContent};
    var image1 = imagesForPost;
    var image2 = cameraimagesForPost;
    var combineImages = [...image1, ...image2];
    if (
      (combineImages == undefined || combineImages?.length == 0) &&
      videoForPost == undefined
    ) {
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
      try {
        camelapp
          .post('/add/camel_female', {
            user_id: user_id,
            type: camel_type,
            color: color,
            location: location,
            description: description,
            title: title,
            images: combineImages ? combineImages : [],
            video: videoForPost ? videoForPost : null,
            thumbnail: JSON.stringify(thumbnailObj),
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
            console.log('response', response.data);
            Toast.show({
              text1: ArabicText.Post_added_successfully,
              type: 'success',
              visibilityTime: 3000,
            });
            this.setState({
              title: '',
              description: '',
              location: '',
              image: [],
              fileName: '',
            });
            this.props.navigation.replace('FemaleList');
          })
          .catch(error => {
            console.log('error', error.response);
            this.setState({loading: false});
          });
      } catch (error) {
        console.log('error', error.response);
        this.setState({loading: false});
      }
    } else {
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
    console.log('====================================');
    console.log('CAMEL FEMALE');
    console.log('====================================');
    const {pausedCheck, loadVideo, videoModal, modalItem, thumbnail} =
      this.state;
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
          <Text style={[Styles.headingPostText, {marginTop: 30}]}>
            {ArabicText.Camel_Female}
          </Text>
          <HorizontalCarousel
            thumbnail={thumbnail?.path}
            CustomUrl
            removeItem={index => this.removeItem(index)}
            price={
              this.state.itemFromDetails?.price
                ? this.state.itemFromDetails?.price
                : ''
            }
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
              style={Styles.image}
              // style={{ width: 320, height: 200 }}
            ></Image>
          )}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.openCamera()}>
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
export default connect(mapStateToProps, mapDispatchToProps)(CamelFemaleForm);
