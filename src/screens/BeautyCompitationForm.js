import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
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
import ImagePicker from 'react-native-image-crop-picker';
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackBtnHeader from '../components/headerWithBackBtn';

class participateInCompetition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      location: '',
      description: '',
      age: '',
      image: undefined,
      cameraimage: [],

      cameraimagesForPost: [],
      imageArray: [],
      imageFlage: false,
      video: undefined,
      videoForPost: undefined,
      imagesForPost: [],
      pauseVideo: true,
      mixedMedia: [],
      mixed: [],
      controls: false,
      progress: null,
      competitionItem: props.route.params.competitionItem,

      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
    };
  }
  videoPicker = async () => {
    this.setState({video: {}});
    ImagePicker.openPicker({
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
  openCameraForCapture() {
    const {cameraimagesForPost, mixed} = this.state;
    ImagePicker.openCamera({
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
  openGallery() {
    ImagePicker.openPicker({
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
          this.setState(previousState => {
            return {mixed: [...previousState?.mixed, ...mixedTemp]};
          });
        } else {
          alert('Only 4 images allowed');
        }
        // console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createPostCamelClub = async () => {
    // var image1 = this.state.imagesForPost;
    // var image2 = this.state.cameraimagesForPost;
    // var combineImages;
    // if (image1?.length && image2?.length) {
    //   combineImages = image1.concat(image2);
    // }
    // if (image1?.length && !image2?.length) {
    //   combineImages = image1;
    // }
    // if (!image1?.length && image2?.length) {
    //   combineImages = image2;
    // }
    var image1 = this.state.imagesForPost;
    var image2 = this.state.cameraimagesForPost;
    var combineImages = [...image1, ...image2];

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
      this.state.age != '' &&
      this.state.mixed != []
    ) {
      let {user} = this.props;
      let user_id = user.user.user.id;
      let competition_id = this.props.route.params.competitionItem;
      camelapp
        .post('/add/competition', {
          user_id: user_id,
          title: this.state.title,
          location: this.state.location,
          age: parseInt(this.state.age),
          description: this.state.description,
          competition_id: competition_id,
          images: combineImages,
          video: this.state.videoForPost,
        })
        .then(response => {
          console.log('response215', response.data?.status);

          alert(ArabicText.Post_added_successfully + '');

          this.setState({
            title: '',
            description: '',
            location: '',
            image: [],
            fileName: '',
          });
          this.props.navigation.goBack();
        })
        .catch(error => {
          console.log(error?.response, 'errror234');
        });
    } else {
      alert(ArabicText.Please_complete_the_fields + '');
    }
  };

  render() {
    const {pausedCheck, loadVideo, videoModal, modalItem} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#FFFFFF'}}>
        <BackBtnHeader />
        <View style={Styles.containerScroll}>
          <HorizontalCarousel
            CustomUrl
            imagesArray={this.state.mixed?.length ? this.state.mixed : []}
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

          {/* 
          <Carousel
            keyExtractor={this.state.mixed.fileName}
            data={this.state.mixed}
            layout={"default"}
            scrollEnabled={true}
            onScroll={() => this.setState({ pauseVideo: true})}
            renderItem={({ item, index }) => {
              return (
                <View style={Styles.imageCarousal}>
                  {

                    item.mime != undefined && item.mime.includes("image") && <Image source={{ uri: item.path }}
                      key={String(index)}
                      resizeMode={"cover"}
                      style={{ width: "100%", height: "100%" }}
                    />
                  }
                  {item.mime != undefined && item.mime.includes("video") &&
                    <Video
                      onTouchStart={() => {
                        this.setState({ pauseVideo: !this.state.pauseVideo })
                      }}
                      source={{ uri: item.path }}   // Can be a URL or a local file.
                      key={String(index)}
                      resizeMode='stretch'
                      repeat
                      controls={false}
                      paused={this.state.pauseVideo}
                      style={Styles.video} />}
                </View>
              );
            }}
            sliderWidth={width}
            itemWidth={width}
          /> */}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={Styles.cameraview}>
              <TouchableOpacity onPress={() => this.videoPicker()}>
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
            style={Styles.forminputs}
            placeholder={ArabicText.age}
            placeholderTextColor="#b0b0b0"
            keyboardType="numeric"
            value={this.state.age}
            onChangeText={text => {
              if (text.length <= 3) {
                this.setState({age: text});
              } else {
                alert(ArabicText.ageLimit);
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(participateInCompetition);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
