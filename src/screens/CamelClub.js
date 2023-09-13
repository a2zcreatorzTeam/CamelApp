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
import * as ArabicText from '../language/EnglishToArabic';
import RNFS from 'react-native-fs';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import Loader from '../components/PleaseWait';
import Ads from '../components/Ads';
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
class CamelClub extends Component {
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
      imagesForPost: undefined,
      cameraimagesForPost: undefined,

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

  selectOneFile = async () => {
    this.setState({video: {}});
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      if (video?.mime.includes('video') === true) {
        if (video?.size > 10000000) {
          alert('Video must be less then 10 MB');
        } else {
          RNFS.readFile(video.path, 'base64')
            .then(res => {
              console.log('res', res);
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
      } else {
        alert('Please select the video.');
      }
    });
  };

  openGallery() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      selectionLimit: 4,
    })
      .then(async images => {
        if (images.length <= 4) {
          let tempImage = images;
          let bse64images = [];
          let mixedTemp = [];
          for (let i = 0; i < tempImage.length; i++) {
            bse64images.push('data:image/png;base64,' + images[i].data);
            mixedTemp.push(tempImage[i]);
            console.log('tempImage[i]', tempImage[i]);
          }
          this.setState({imagesForPost: bse64images, image: tempImage});

          if (this.state.video != undefined) {
            let video = this.state.video;
            mixedTemp.push(video);
          }
          if (this.state.cameraimage != undefined) {
            let cameraimage = this.state.cameraimage;
            for (var i = 0; i < cameraimage?.length; i++) {
              mixedTemp.push(cameraimage[i]);
            }
          }
          this.setState({mixed: mixedTemp});
          console.log('====================================');
          console.log(this?.state?.mixed);
          console.log('====================================');
        } else {
          alert('Only 4 images allowed');
        }
        // console.log("images", images)
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  openCamera() {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(async images => {
        if (images) {
          let tempImage = images;
          let bse64images = [];
          let mixedTemp = [];

          this.setState(prevstate => ({
            cameraimage: prevstate.cameraimage.concat(tempImage),
          }));
          const newImageArray = this?.state?.cameraimage;

          for (var i = 0; i < newImageArray?.length; i++) {
            mixedTemp.push(newImageArray[i]);
            bse64images.push('data:image/png;base64,' + newImageArray[i]?.data);
            // mixedTemp.push(tempImage);
            this.setState({
              cameraimagesForPost: bse64images,
            });
          }

          if (this.state.image != undefined) {
            let image = this.state.image;
            for (var i = 0; i < image?.length; i++) {
              mixedTemp.push(image[i]);
            }
          }
          if (this.state.video != undefined) {
            let video = this.state.video;
            mixedTemp.push(video);
          }
          this.setState({mixed: mixedTemp});
        }
        // else {
        //   alert(" IF Only 4 images allowed")
        // }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createPostCamelClub = async () => {
    var image1 = this.state.imagesForPost;
    var image2 = this.state.cameraimagesForPost;
    var combineImages;
    if (image1?.length && image2?.length) {
      combineImages = image1.concat(image2);
    }
    if (image1?.length && !image2?.length) {
      combineImages = image1;
    }
    if (!image1?.length && image2?.length) {
      combineImages = image2;
    }

    if (this.state.videoForPost === undefined) {
      return alert('Can not post without video');
    }

    if (combineImages == undefined || combineImages?.length == 0) {
      return alert('Can not post without image');
    }
    if (combineImages?.length > 4) {
      return alert('Upload upto 4 images');
    }
    if (
      this.state.title != '' &&
      this.state.description != '' &&
      this.state.location != '' &&
      this.state.mixed != []
    ) {
      let {user} = this.props;
      let user_id = user.user.user.id;

      this.setState({loading: true});
      await camelapp
        .post('/add/postclub', {
          user_id: user_id,
          title: this.state.title,
          location: this.state.location,
          description: this.state.description,
          images: combineImages,
          video: this.state.videoForPost,
        })
        .then(response => {
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
            this.props.navigation.navigate('CamelClubList');
          }
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    } else {
      alert(ArabicText.Please_complete_the_fields + '');
    }
  };

  render() {
    console.log('Camel Club ===>>>');
    const {pausedCheck, loadVideo, videoModal, modalItem} = this.state;
    return (
      <View style={{backgroundColor: '#ffffff'}}>
        <Ads />
        <ScrollView contentContainerStyle={{paddingBottom: 150}}>
          <View style={Styles.containerScroll}>
            <Text style={Styles.headingPostText}>{ArabicText.Camel_Club}</Text>

            <HorizontalCarousel
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

            <View style={{flexDirection: 'row', marginTop: 10}}>
              {/* VIDEO PICKER */}
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.selectOneFile()}>
                  <Ionicons
                    name="md-camera-outline"
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
            <TextInput
              style={Styles.forminputs}
              placeholder={ArabicText.Title}
              placeholderTextColor="#b0b0b0"
              value={this.state.title}
              onChangeText={text => {
                if (text.length <= 24) {
                  this.setState({title: text});
                } else {
                  alert(ArabicText.limitCharacters);
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
                  alert(ArabicText.limitCharacters);
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
                  alert(ArabicText.description);
                }
              }}></TextInput>
            <Loader loading={this.state.loading} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelClub);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
