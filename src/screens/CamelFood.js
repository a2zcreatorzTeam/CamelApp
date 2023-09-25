import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ArabicText from '../language/EnglishToArabic';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import {RadioButton} from 'react-native-paper';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import RNFS from 'react-native-fs';
import Loader from '../components/PleaseWait';
import Ads from '../components/Ads';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import HorizontalCarousel from '../components/HorizontalCarousel';
import VideoModal from '../components/VideoModal';
import BackBtnHeader from '../components/headerWithBackBtn';

class CamelFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: undefined,
      mixed: [],
      imageFlage: false,
      title: '',
      description: '',
      location: '',
      color: '',
      camel_type: '',
      price_type: '',
      price: '',
      commission: '',
      video: undefined,
      checked: 'first',
      register: false,
      checked_register: 'first',
      register_value: 0,
      images: {uri: '', name: '', type: ''},
      localUrii: '',
      fileName: '',
      user: '',
      modal: false,
      modalOffer: false,
      registerSwitch: false,
      paySwitch: false,
      video: undefined,
      videoForPost: undefined,
      imagesForPost: [],
      loading: false,
      cameraimage: [],

      cameraimagesForPost: [],
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
    };
  }
  createPostCamelFood = async () => {
    var image1 = this.state.imagesForPost;
    var image2 = this.state.cameraimagesForPost;
    var combineImages = [...image1, ...image2];
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
      this.state.location != '' &&
      this.state.description != '' &&
      this.state.mixed.length != 0 &&
      this.state.color != '' &&
      this.state.price != '' &&
      this.state.price_type != '' &&
      this.state.camel_type != ''
    ) {
      this.setState({loading: true});

      let {user} = this.props;
      let user_id = user.user.user.id;
      console.log(this.state.register_value, 'this.state.register_value');
      camelapp
        .post('/add/food', {
          user_id: user_id,
          title: this.state.title,
          location: this.state.location,
          description: this.state.description,
          images: combineImages,
          video: this.state.videoForPost,
          camel_type: this.state.camel_type,
          color: this.state.color,
          price: this.state.price,
          price_type: this.state.price_type,
          // register: this.state.register_value,
        })
        .then(response => {
          console.log(response, 'responseeee');
          this.setState({
            loading: false,
            video: undefined,
            videoForPost: undefined,
            imagesForPost: undefined,
            image: undefined,
            cameraimage: [],
            cameraimagesForPost: undefined,
          });

          alert(ArabicText.Post_added_successfully + '');
          this.setState({
            title: '',
            description: '',
            location: '',
            image: '',
            fileName: '',
          });
          this.props.navigation.replace('CamelFoodList');
        })
        .catch(error => {
          console.log('error', error.response);
          this.setState({
            loading: false,
          });
        });
    } else {
      alert(ArabicText.Please_complete_the_fields + '');

      // alert("Please complete the fields")
    }
  };
  onRegisterSwitchChanged(value) {
    this.setState({registerSwitch: value});
    if (value === false) {
      this.setState({register_value: 0});
    }
    if (value === true) {
      this.setState({register_value: 1});
    }
  }
  // SELECT VIDEO
  videoPicker = async () => {
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
  // SELECT FROM GALLERY
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
          this.setState(previousState => {
            return {mixed: [...previousState?.mixed, ...mixedTemp]};
          });
        } else {
          alert('Only 4 images allowed');
        }
        console.log('images', images);
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
        // else {
        //   alert(" IF Only 4 images allowed")
        // }
      })
      .catch(error => {
        console.log('error', error);
      });
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
    const {checked} = this.state;
    const {checked_register} = this.state;
    const {pausedCheck, loadVideo, videoModal, modalItem} = this.state;
    return (
      <View style={{flex: 1}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{backgroundColor: 'white'}}>
          <BackBtnHeader />
          <Ads />

          <View style={Styles.container}>
            <Text style={Styles.headingPostText}>بيع الأعلاف</Text>
            <HorizontalCarousel
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
            {/* <Carousel
              keyExtractor={this.state.mixed.fileName}
              data={this.state.mixed}
              layout={'default'}
              scrollEnabled={true}
              onScroll={() => this.setState({pauseVideo: true})}
              renderItem={({item, index}) => {
                // //console.log("ITEM__________:", item.mime)
                return (
                  <View style={Styles.imageCarousal}>
                    {item.mime != undefined && item.mime.includes('image') && (
                      <Image
                        source={{uri: item.path}}
                        key={String(index)}
                        resizeMode={'cover'}
                        style={{width: '100%', height: '100%'}}
                      />
                    )}
                    {item.mime != undefined && item.mime.includes('video') && (
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
                <TouchableOpacity onPress={() => this.videoPicker()}>
                  <Ionicons
                    name="md-camera-outline"
                    size={30}
                    color="#D2691Eff"
                  />
                </TouchableOpacity>
              </View>
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.openCameraForCapture()}>
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
              placeholderTextColor="#b0b0b0"
              placeholder={ArabicText.Color}
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
              placeholderTextColor="#b0b0b0"
              placeholder={ArabicText.Type}
              value={this.state.camel_type}
              onChangeText={text => {
                if (text.length <= 24) {
                  this.setState({camel_type: text});
                } else {
                  alert(ArabicText.limitCharacters);
                }
              }}></TextInput>
            <Loader loading={this.state.loading} />
            <TextInput
              style={Styles.forminputs}
              placeholderTextColor="#b0b0b0"
              placeholder={ArabicText.Location}
              value={this.state.location}
              onChangeText={text => {
                if (text.length <= 24) {
                  this.setState({location: text});
                } else {
                  alert(ArabicText.limitCharacters);
                }
              }}></TextInput>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modal}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Pressable onPress={modal => this.setState({modal: !modal})}>
                    <Ionicons
                      name="close"
                      size={30}
                      color="brown"
                      style={{marginLeft: width - 140}}
                    />
                  </Pressable>
                  <Text style={{color: 'black', fontSize: 20}}>
                    {ArabicText.fixed}
                  </Text>
                  <TextInput
                    style={Styles.forminputsPrice}
                    placeholder={ArabicText.Price}
                    placeholderTextColor="#b0b0b0"
                    keyboardType="numeric"
                    onChangeText={text =>
                      this.setState({price: text})
                    }></TextInput>
                  <TouchableOpacity
                    onPress={() => this.setState({modal: false})}>
                    <View style={Styles.btnform}>
                      <Text style={Styles.textbtn}>{ArabicText.fixed}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalOffer}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Pressable
                    onPress={modalOffer =>
                      this.setState({modalOffer: !modalOffer})
                    }>
                    <Ionicons
                      name="close"
                      size={30}
                      color="brown"
                      style={{marginLeft: width - 140}}
                    />
                  </Pressable>
                  <Text style={{color: 'black', fontSize: 20}}>
                    {ArabicText.offer_Up}
                  </Text>
                  <TextInput
                    style={Styles.forminputsPrice}
                    placeholderTextColor="#b0b0b0"
                    keyboardType="numeric"
                    placeholder={ArabicText.Price}
                    onChangeText={text =>
                      this.setState({price: text})
                    }></TextInput>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({modalOffer: false});
                    }}>
                    <View style={Styles.btnform}>
                      <Text style={Styles.textbtn}>{ArabicText.offer_Up}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 50,
                color: 'black',
                fontSize: 18,
              }}>
              {ArabicText.Please_select_price_type}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', alignSelf: 'center', fontSize: 16}}>
                {ArabicText.fixed}
              </Text>

              <RadioButton
                style={{margin: 3, marginTop: 10}}
                value={ArabicText.fixed}
                status={checked === 'first' ? 'checked' : 'unchecked'}
                onPress={() => {
                  this.setState({
                    checked: 'first',
                    price_type: ArabicText.fixed,
                    modal: true,
                    modalOffer: false,
                  });
                }}
              />

              <Text style={{color: 'black', alignSelf: 'center', fontSize: 16}}>
                {ArabicText.offer_Up}
              </Text>

              <RadioButton
                style={{margin: 3, marginTop: 5}}
                value={ArabicText.offer_Up}
                status={checked === 'second' ? 'checked' : 'unchecked'}
                onPress={() => {
                  this.setState({
                    checked: 'second',
                    price_type: ArabicText.offer_Up,
                    modal: false,
                    modalOffer: true,
                  });
                }}
              />
            </View>

            <TextInput
              style={[Styles.inputdecrp, {marginTop: 20}]}
              placeholderTextColor="#b0b0b0"
              placeholder={ArabicText.Description}
              multiline
              onChangeText={text =>
                this.setState({description: text})
              }></TextInput>
            <TouchableOpacity onPress={() => this.createPostCamelFood()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelFood);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    width: width,
    height: hight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    opacity: 0.9,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 5,
  },
});
