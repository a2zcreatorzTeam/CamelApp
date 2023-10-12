import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
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

class MissingCamelForm extends Component {
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
    };
  }
  // SELECT VIDEO
  openCamera = async () => {
    this.setState({video: {}});
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      if (video?.size > 10000000) {
        alert('Video must be less then 10 MB');
      } else {
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
    var image1 = this.state.imagesForPost;
    var image2 = this.state.cameraimagesForPost;
    var combineImages = [...image1, ...image2];
    if (this.state.videoForPost === undefined) {
      return alert(ArabicText?.Cannotpostwithoutvideo);
    }
    if (combineImages == undefined || combineImages?.length == 0) {
      return alert(ArabicText?.Cannotpostwithoutimage);
    }
    if (combineImages?.length < 4) {
      return alert(ArabicText?.UploadMinimum4Images);
    }
    if (
      this.state.title != '' &&
      this.state.description != '' &&
      this.state.location != '' &&
      this.state.color != '' &&
      this.state.camel_type != '' &&
      this.state.mixed.length != 0
    ) {
      let {user} = this.props;
      let user_id = user.user.user.id;
      this.setState({loading: true});
      try {
        camelapp
          .post('/add/camel_female', {
            user_id: user_id,
            images: combineImages,
            type: this.state.camel_type,
            color: this.state.color,
            location: this.state.location,
            description: this.state.description,
            title: this.state.title,
            video: this.state.videoForPost,
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
            alert(ArabicText.Post_added_successfully);
            this.setState({
              title: '',
              description: '',
              location: '',
              image: [],
              fileName: '',
            });
            this.props.navigation.navigate('FemaleList');
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
      alert(ArabicText.Please_complete_the_fields + '');
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
    const {pausedCheck, loadVideo, videoModal, modalItem} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#ffffff'}}>
        <BackBtnHeader />
        <Ads />
        <View style={Styles.containerScroll}>
          <Text style={[Styles.headingPostText, {marginTop: 30}]}>
            {ArabicText.Camel_Female}
          </Text>
          <HorizontalCarousel
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
                alert(ArabicText.limitCharacters);
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
                alert(ArabicText.limitCharacters);
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
