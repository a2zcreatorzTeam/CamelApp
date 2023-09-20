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
const width = Dimensions.get('screen').width;

class TreatingCamels extends Component {
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
      imagesForPost: undefined,
      image: undefined,
      cameraimage: [],

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
        } else {
          alert('Only 4 images allowed');
        }
        console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  openCameraForCapture() {
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

  createPostTreatingCamels = async () => {
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
    console.log(
      '==================this.state.imagesForPost==================',
      combineImages?.length,
    );
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
      this.state.color != '' &&
      this.state.camel_type != '' &&
      this.state.mixed.length != 0
    ) {
      let {user} = this.props;
      console.log('====================================');
      console.log(combineImages);
      console.log('====================================');
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
          images: combineImages,
          video: this.state.videoForPost,
        })
        .then(response => {
          console.log('response', response.data);
          this.setState({
            loading: false,
            video: undefined,
            videoForPost: undefined,
            imagesForPost: undefined,
            image: undefined,
            cameraimage: [],
            cameraimagesForPost: undefined,
          });

          alert(ArabicText.Post_added_successfully);
          // this.props.navigation.navigate("Home")
          this.props.navigation.replace('CamelTreatmentList');
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    } else {
      alert(ArabicText.Please_complete_the_fields + '');
      // alert("Please complete the fields")
    }
  };

  componentDidMount() {
    console.log('component 257 trating camel');
  }

  render() {
    const {pausedCheck, loadVideo, videoModal, modalItem} = this.state;

    return (
      <ScrollView style={{backgroundColor: '#ffffff'}}>
        <Ads />
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
          {/* <Carousel
            keyExtractor={this.state.mixed.fileName}
            data={this.state.mixed}
            layout={'default'}
            scrollEnabled={true}
            onScroll={() => this.setState({pauseVideo: true})}
            renderItem={({item, index}) => {
              return (
                <View style={Styles.imageCarousal}>
                  {item?.mime != undefined && item.mime.includes('image') && (
                    <Image
                      source={{uri: item.path}}
                      key={String(index)}
                      resizeMode={'cover'}
                      style={{width: '100%', height: '100%'}}
                    />
                  )}
                  {item?.mime != undefined && item.mime.includes('video') && (
                    <Video
                      onTouchStart={() => {
                        this.setState({pauseVideo: !this.state.pauseVideo});
                      }}
                      source={{uri: item.path}}
                      key={String(index)}
                      resizeMode="stretch"
                      repeat
                      controls={false}
                      paused={this.state.pauseVideo}
                      style={Styles.video}
                    />
                  )}
                </View>
              );
            }}
            sliderWidth={width}
            itemWidth={width}
          /> */}

          {this.state.imageFlage && (
            <Image
              source={{
                uri: this.state.image,
              }}
              style={Styles.image}></Image>
          )}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.openCamera()}>
                <Ionicons
                  name="md-camera-outline"
                  size={30}
                  color="#D2691Eff"
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(TreatingCamels);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
