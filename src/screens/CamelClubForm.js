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
import RNFS from 'react-native-fs';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {createThumbnail} from 'react-native-create-thumbnail';
import Toast from 'react-native-toast-message';
import Loader from '../components/PleaseWait';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import * as userActions from '../redux/actions/user_actions';
import Ads from '../components/Ads';
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
import BackBtnHeader from '../components/headerWithBackBtn';
class CamelClubForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      location: '',
      description: '',
      image: undefined,
      imageArray: '',
      imageFlage: false,
      video: undefined,
      cameraimage: [],
      videoForPost: undefined,
      imagesForPost: [],
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
      thumbnail: null,
    };
  }
  // VIDEO PICKER
  selectOneFile = async () => {
    this.setState({video: {}});
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      if (video?.mime.includes('video') === true) {
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
              this.setState({thumbnail: response});
            })
            .catch(err => console.log({err}));
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
              console.log(err.message, err.code, 'errorr');
            });
        }
      } else {
        Toast.show({
          text1: ArabicText?.Pleaseselectthevideo,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Please select the video.');
      }
    });
  };
  // PICK FROM GALLERY
  openGallery() {
    const {mixed} = this.state;
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      // selectionLimit: 4,
    })
      .then(async images => {
        // if (mixed?.length < 4) {
        let tempImage = images;
        let bse64images = [];
        let mixedTemp = [];
        for (let i = 0; i < tempImage?.length; i++) {
          bse64images.push('data:image/png;base64,' + images[i].data);
          mixedTemp.push(tempImage[i]);
        }
        this.setState(previousState => {
          return {
            mixed: [...mixedTemp, ...previousState?.mixed],
            imagesForPost: [...bse64images, ...previousState?.imagesForPost],
            image: tempImage,
          };
        });
        // } else {
        //   alert('Only 4 items are allowed');
        // }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  // CAPTURE FROM CAMERA
  openCamera() {
    const {imagesForPost, mixed} = this.state;
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(async images => {
        // if (mixed?.length < 4) {
        let mixedTemp = [];
        mixedTemp.push(images);
        if (imagesForPost?.length > 0) {
          this.setState(previousState => {
            return {
              imagesForPost: [
                'data:image/png;base64,' + images?.data,
                ...previousState?.imagesForPost,
              ],
            };
          });
        } else {
          this.setState({
            imagesForPost: ['data:image/png;base64,' + images?.data],
          });
        }
        this.setState(previousState => {
          return {
            mixed: [...mixedTemp, ...previousState?.mixed],
          };
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createPostCamelClub = async () => {
    const {
      imagesForPost,
      videoForPost,
      thumbnail,
      cameraimagesForPost,
      title,
      description,
      location,
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
    if (title != '' && description != '' && location != '') {
      let {user} = this.props;
      let user_id = user?.user?.user.id;
      this.setState({loading: true});
      console.log(
        thumbnailObj,
        videoForPost,
        description,
        location,
        title,
        user_id,
      );
      await camelapp
        .post(
          '/add/postclub',
          {
            user_id: user_id,
            title: title,
            location: location,
            description: description,
            images: combineImages ? combineImages : [],
            video: videoForPost ? videoForPost : null,
            thumbnail: thumbnailObj ? JSON.stringify(thumbnailObj) : null,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          console.log(response, 'responsee');
          if (response.data) {
            this.setState({
              loading: false,
              video: undefined,
              videoForPost: undefined,
              imagesForPost: undefined,
              image: undefined,
              cameraimage: [],
              cameraimagesForPost: undefined,
            });
            // this.props.navigation.goBack();
            this.props.navigation.replace('CamelClubList');
          }
        })
        .catch(error => {
          console.log(error.response, 'error', error);
          this.setState({loading: false});
        });
    } else {
      return Toast.show({
        text1: ArabicText.Please_complete_the_fields + '',
        type: 'error',
        visibilityTime: 3000,
      });
    }
    console.log('errrrrrrr');
  };
  // REMOVE ITEM
  removeItem = (i, type, path) => {
    const {mixed, imagesForPost, cameraimagesForPost} = this.state;
    if (type == 'video') {
      const filteredList = mixed?.filter((item, index) => {
        return index !== i;
      });
      this.setState({mixed: filteredList, videoForPost: undefined});
    } else {
      const imagesForPostFilter = imagesForPost?.filter((item, index) => {
        return index !== i;
      });
      const filteredList = mixed?.filter((item, index) => {
        return index !== i;
      });
      this.setState({mixed: filteredList, imagesForPost: imagesForPostFilter});
    }
  };
  render() {
    const {pausedCheck, loadVideo, videoModal, modalItem, mixed, thumbnail} =
      this.state;
    return (
      <View style={{backgroundColor: 'blue', flex: 1}}>
        <BackBtnHeader />
        {/* <Ads /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          contentContainerStyle={Styles.scrollContentContainer}
          alwaysBounceVertical={false}>
          <View style={Styles.containerScroll}>
            <Text style={Styles.headingPostText}>{ArabicText.Camel_Club}</Text>
            {/* IMAGES CAROUSAL */}
            {mixed?.length ? (
              <HorizontalCarousel
                thumbnail={thumbnail?.path}
                removeItem={(index, type, path) =>
                  this.removeItem(index, type, path)
                }
                CustomUrl
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
            ) : null}
            <View style={{flexDirection: 'row', marginTop: 10}}>
              {/* VIDEO PICKER */}
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.selectOneFile()}>
                  <FontAwesome
                    name="video-camera"
                    size={30}
                    color="#D2691Eff"
                  />
                </TouchableOpacity>
              </View>
              {/* Click pic from camera */}
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.openCamera()}>
                  <Ionicons
                    name="md-camera-sharp"
                    size={30}
                    color="#D2691Eff"
                  />
                </TouchableOpacity>
              </View>
              {/* SELECT FROM GALLERY */}
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.openGallery()}>
                  <Ionicons name="images-outline" size={30} color="#D2691Eff" />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.imageFlage && (
              <Image
                source={{
                  uri: this.state.image,
                }}
                style={Styles.image}></Image>
            )}
            {/* TEXT INPUTS */}
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
            {/* CREATE POST */}
            <TouchableOpacity onPress={() => this.createPostCamelClub()}>
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
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelClubForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
