import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import Loader from '../components/PleaseWait';
import Ads from '../components/Ads';
import * as ImageCropPicker from 'react-native-image-crop-picker';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

import RNFS from 'react-native-fs';
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
import BackBtnHeader from '../components/headerWithBackBtn';

class SellingCamelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: undefined,
      imageFlage: false,
      title: '',
      description: '',
      location: '',
      color: '',
      camel_type: '',
      price_type: '',
      mixed: [],
      video: undefined,
      price: '',
      commission: '',
      checked: 'first',
      register: 0,
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
      barColor: false,
      selectedItem: '',
      video: undefined,
      videoForPost: undefined,
      imagesForPost: [],
      open: false,
      showloader: false,
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
  selectVideo = async () => {
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
  // SELECT IMAGES FROM GALLERY
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
  createPostSellingCamel = async () => {
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

    if (combineImages == undefined || combineImages?.length == 0) {
      return alert('Can not post without image');
    }
    console.log(combineImages, 'combineImagescombineImages');
    if (combineImages?.length > 4) {
      return alert('Upload upto 4 images');
    }
    if (this.state.videoForPost === undefined) {
      return alert('Can not post without video');
    }

    if (
      this.state.title != '' &&
      this.state.location != '' &&
      this.state.description != '' &&
      this.state.color != '' &&
      this.state.price != '' &&
      this.state.price_type != '' &&
      this.state.camel_type != '' &&
      this.state.selectedItem != '' &&
      this.state.mixed.length != 0
    ) {
      let {user} = this.props;
      let user_id = user.user.user.id;
      console.log(user?.user?.user, user_id);
      // console.log(
      //   'respnseee263',
      //   user_id,
      //   // this.state.title,
      //   // this.state.location,
      //   // this.state.description,
      //   // this.state.camel_type,
      //   // this.state.color,
      //   // this.state.price,
      //   // this.state.price_type,
      //   // this.state.selectedItem.name,
      //   // this.state.selectedItem?.id,
      //   // this.state.videoForPost,
      //   combineImages,
      //   "kkjkjkjkjk"
      // );

      this.setState({loading: true});
      camelapp
        .post('/add/selling', {
          user_id: user_id,
          title: this.state.title,
          location: this.state.location,
          description: this.state.description,
          images: combineImages,
          camel_type: this.state.camel_type,
          color: this.state.color,
          price: this.state.price,
          price_type: this.state.price_type,
          commission: this.state.selectedItem.name,
          video: this.state.videoForPost,
          register: this.state.register,
        })
        .then(response => {
          console.log(response?.data, 'responseererererer275');
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

          this.setState({
            title: '',
            description: '',
            location: '',
            image: '',
            fileName: '',
          });
          this.props.navigation.replace('CamelSellingList');
        })
        .catch(error => {
          console.log('error', error.response);
        });
    } else {
      alert(ArabicText.Please_complete_the_fields + '');
    }
  };
  updateUser = commission => {
    this.setState({commission: commission});
  };
  onSelectedItem(val) {
    this.setState({showOption: false});
    this.setState({selectedItem: val});
  }
  onRegisterSwitchChanged(value) {
    this.setState({registerSwitch: value});
    if (value === false) {
      this.setState({register: 0});
    }
    if (value === true) {
      this.setState({register: 1});
    }
  }

  modalOpen = () => {
    this.setState({modal: true});
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
    const {pausedCheck, loadVideo, videoModal, modalItem, checked} = this.state;
    let Period = [
      {
        id: 1,
        name: ArabicText.Buyer,
      },
      {
        id: 2,
        name: ArabicText.Seller,
      },
    ];
    console.log('Selling Camel');
    return (
      <View style={{flex: 1}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{backgroundColor: 'white'}}>
          <BackBtnHeader />
          <Ads />
          <View style={Styles.containerSellingCamel}>
            <Text style={[Styles.headingPostText, {marginTop: 30}]}>
              بيع الحلال
            </Text>
            <HorizontalCarousel
              removeItem={index => this.removeItem(index)}
              CustomUrl
              price={
                this.state.itemFromDetails?.price
                  ? this.state.itemFromDetails?.price
                  : ''
              }
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
            {/* <Carousel
              keyExtractor={this.state.mixed.fileName}
              data={this.state.mixed}
              layout={'default'}
              scrollEnabled={true}
              onScroll={() => this.setState({pauseVideo: true})}
              renderItem={({item, index}) => {
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
                          ////console.log("Pause:  ", this.state.pauseVideo)
                          this.setState({pauseVideo: !this.state.pauseVideo});
                        }}
                        source={{uri: item.path}} // Can be a URL or a local file.
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
                style={Styles.image}
                // style={{ width: 320, height: 200 }}
              ></Image>
            )}

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.selectVideo()}>
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

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    width: '45%',
                    height: 20,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    marginBottom: -9,
                    zIndex: 10,
                    marginRight: 20,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: 12,
                      backgroundColor: '#fff',
                      marginTop: -3,
                    }}></View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.dropDownstyle,
                    {
                      flexDirection: 'row-reverse',
                      borderColor:
                        this.state.showOption == true ? '#d2691e' : '#d2691e',
                      borderWidth: this.state.showOption == true ? 2 : 1,
                      borderTopEndRadius:
                        this.state.showOption == true ? 20 : 20,
                      borderTopStartRadius:
                        this.state.showOption == true ? 20 : 20,
                      borderBottomEndRadius:
                        this.state.showOption == true ? 0 : 20,
                      borderBottomStartRadius:
                        this.state.showOption == true ? 0 : 20,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    this.setState({showOption: !this.state.showOption})
                  }>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color:
                        this.state.selectedItem == '' ? '#a6a3a2' : 'black',
                      marginRight: 15,
                    }}>
                    {!!this.state.selectedItem
                      ? this.state.selectedItem.name
                      : ArabicText.How_will_you_pay_the_application_percentage}
                  </Text>
                  <Image
                    style={{
                      transform: [
                        {rotate: this.state.showOption ? '180deg' : '0deg'},
                      ],
                      width: 20,
                      height: 20,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/dropdown.jpg')}
                  />
                </TouchableOpacity>
                {this.state.showOption && (
                  <View
                    style={{
                      backgroundColor: 'white',
                      marginLeft: 15,
                      width: width - 50,
                      borderBottomEndRadius: 6,
                      borderBottomStartRadius: 6,
                      borderBottomWidth: 2,
                      borderLeftWidth: 2,
                      borderColor: '#d2691e',
                      elevation: 10,
                      position: 'absolute',
                      marginTop: 65,
                      zIndex: 80,
                    }}>
                    {/* DROP DOWN */}
                    {Period.map((val, i) => {
                      return (
                        <TouchableOpacity
                          key={String(i)}
                          onPress={() => this.onSelectedItem(val)}
                          style={{
                            backgroundColor:
                              this.state.selectedItem.id == val.id
                                ? '#d2691e'
                                : 'white',
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            marginLeft: 0,
                            width: '100%',
                            marginBottom: 4,
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: '500',
                              color:
                                this.state.selectedItem.id == val.id
                                  ? 'white'
                                  : 'black',
                              alignSelf: 'flex-end',
                            }}>
                            {val?.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
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
              <Text style={{color: 'black', fontSize: 16}}>
                {ArabicText.fixed}
              </Text>

              <RadioButton
                style={{marginTop: 10}}
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
                style={{marginTop: 5}}
                value={ArabicText.offer_Up}
                status={checked === 'second' ? 'checked' : 'unchecked'}
                onPress={() => {
                  // this.modalOpen()
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
              placeholder={ArabicText.Description}
              placeholderTextColor="#b0b0b0"
              multiline
              onChangeText={text =>
                this.setState({description: text})
              }></TextInput>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                margin: 20,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{margin: 3, fontWeight: 'bold', color: 'black'}}>
                {ArabicText.I_am_registered_to_ministry_of_articulator}
              </Text>

              <Switch
                trackColor={{false: '#767577', true: '#D2691Eff'}}
                thumbColor={this.state.registerSwitch ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => this.onRegisterSwitchChanged(value)}
                value={this.state.registerSwitch}
              />
            </View>

            {/* SUBMIT BUTTON */}
            <Loader loading={this.state.loading} />
            <TouchableOpacity onPress={() => this.createPostSellingCamel()}>
              <View style={Styles.btnform}>
                <Text style={Styles.textbtn}>{ArabicText.submit}</Text>
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
                onChangeText={text => this.setState({price: text})}></TextInput>

              <TouchableOpacity
                onPress={() => {
                  this.setState({modal: false});
                }}>
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
                placeholder={ArabicText.Price}
                placeholderTextColor="#b0b0b0"
                keyboardType="numeric"
                onChangeText={text => this.setState({price: text})}></TextInput>

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

export default connect(mapStateToProps, mapDispatchToProps)(SellingCamelForm);

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
    // shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropDownstyle: {
    backgroundColor: 'white',
    padding: 6,
    borderWidth: 0.5,
    width: width - 50,
    minHeight: 55,
    // borderColor: "#d2691e",
    //alignSelf: "flex-start",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
