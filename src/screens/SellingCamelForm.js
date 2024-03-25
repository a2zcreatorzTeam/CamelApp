/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
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
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import {createThumbnail} from 'react-native-create-thumbnail';
import RNFS from 'react-native-fs';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import Loader from '../components/PleaseWait';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import * as userActions from '../redux/actions/user_actions';
import VideoModal from '../components/VideoModal';
import Ads from '../components/Ads';
import HorizontalCarousel from '../components/HorizontalCarousel';
import BackBtnHeader from '../components/headerWithBackBtn';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

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

      showBidOption: false,
      selectedBidOption: '',
      showOption: false,
      thumbnail: null,
    };
  }
  // SELECT VIDEO
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
          .then(response => {
            console.log(response?.path), this.setState({thumbnail: response});
          })
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
  // SELECT IMAGES FROM GALLERY
  openGallery() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      // selectionLimit: 4,
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
    const {
      selectedBidOption,
      videoForPost,
      thumbnail,
      title,
      location,
      description,
      color,
      price,
      price_type,
      camel_type,
      selectedItem,
      register,
      imagesForPost,
      cameraimagesForPost,
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
    console.log(thumbnailObj, 'thumbnailObjthumbnailObj');
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
    console.log(price_type, 'price_typeprice_type');
    if (
      title != '' &&
      location != '' &&
      description != '' &&
      color != '' &&
      price != '' &&
      price_type != '' &&
      camel_type != '' &&
      selectedItem != ''
      // &&
      // (price_type == ArabicText?.offer_Up ? selectedBidOption !== '' : true)
    ) {
      let {user} = this.props;
      let user_id = user?.user?.user.id;
      this.setState({loading: true});
      camelapp
        .post(
          '/add/selling',
          {
            user_id: user_id,
            title: title,
            location: location,
            description: description,
            camel_type: camel_type,
            color: color,
            price: price,
            price_type: price_type,
            commission: selectedItem.name,
            register: register,
            // bid_expired_days: selectedBidOption?.name,
            images: combineImages ? combineImages : [],
            video: videoForPost ? videoForPost : null,
            thumbnail: thumbnailObj ? JSON.stringify(thumbnailObj) : null,
          },
          // {
          //   headers: {
          //     Accept: 'application/json',
          //     'Content-Type': 'application/json',
          //   },
          // },
        )
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
          console.log('error12', error);
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
  updateUser = commission => {
    this.setState({commission: commission});
  };
  onSelectedItem(val) {
    this.setState({showOption: false});
    this.setState({selectedItem: val});
  }
  onBidExpireOption(val) {
    this.setState({showBidOption: false});
    this.setState({selectedBidOption: val});
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
    const {
      pausedCheck,
      loadVideo,
      videoModal,
      modalItem,
      checked,
      showBidOption,
      selectedBidOption,
      price_type,
      thumbnail,
    } = this.state;
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
    let ExpireType = [
      {
        id: 1,
        name: ArabicText.oneDay,
      },
      {
        id: 2,
        name: ArabicText.threeDays,
      },
      {
        id: 3,
        name: ArabicText?.fiveDays,
      },
    ];

    return (
      <View style={{flex: 1, backgroundColor: '#D2691Eff'}}>
        <BackBtnHeader />
        <KeyboardAvoidingView
          style={Styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={Styles.scrollContentContainer}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}>
            {/* <Ads /> */}
            <View style={Styles.containerSellingCamel}>
              <Text style={[Styles.headingPostText, {marginTop: 30}]}>
                بيع الحلال
              </Text>
              <HorizontalCarousel
                thumbnail={thumbnail?.path}
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
                    <FontAwesome
                      name="video-camera"
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
                    <Ionicons
                      name="images-outline"
                      size={30}
                      color="#D2691Eff"
                    />
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
                placeholderTextColor="#b0b0b0"
                placeholder={ArabicText.Type}
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
                        color:
                          this.state.selectedItem == '' ? '#a6a3a2' : 'black',
                        marginRight: 15,
                        fontFamily: family.Neo_Regular,
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
                        // marginLeft: 15,
                        width: width - 50,
                        borderBottomEndRadius: 6,
                        borderBottomStartRadius: 6,
                        borderWidth: 2,
                        borderBottomWidth: 2,
                        borderTopWidth: 0,
                        // borderLeftWidth: 2,
                        borderColor: '#d2691e',
                        elevation: 10,
                        // position: 'absolute',
                        // marginTop: 65,
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
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              // marginLeft: 0,
                              // width: '100%',
                              // marginBottom: 4,
                            }}>
                            <Text
                              style={{
                                fontSize: 18,
                                color:
                                  this.state.selectedItem.id == val.id
                                    ? 'white'
                                    : 'black',
                                alignSelf: 'flex-end',
                                fontFamily:
                                  Platform.OS == 'ios'
                                    ? null
                                    : family.Neo_Regular,
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
                  fontFamily: family.Neo_Regular,
                }}>
                {ArabicText.Payment_Types}
              </Text>

              {/* SELECT PRICE TYPE */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    fontFamily: family.Neo_Regular,
                  }}>
                  {ArabicText.fixed}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      checked: 'first',
                      price_type: ArabicText.fixed,
                      modal: true,
                      modalOffer: false,
                    });
                  }}
                  style={[Styles.radioBtnView, {marginRight: 20}]}>
                  {checked === 'first' && <View style={Styles.checkRadioBtn} />}
                </TouchableOpacity>
                {/* <RadioButton
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
                /> */}
                <Text
                  style={{
                    color: 'black',
                    alignSelf: 'center',
                    fontSize: 16,
                    fontFamily: family.Neo_Regular,
                    marginLeft: 20,
                  }}>
                  {ArabicText.offer_Up}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      checked: 'second',
                      price_type: ArabicText.offer_Up,
                      modal: false,
                      modalOffer: true,
                    });
                  }}
                  style={Styles.radioBtnView}>
                  {checked === 'second' && (
                    <View style={Styles.checkRadioBtn} />
                  )}
                </TouchableOpacity>
                {/* <RadioButton
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
                /> */}
              </View>

              {/* //SELECT BID EXPIRE DAYS */}
              {/* {price_type == ArabicText.offer_Up && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{ alignItems: 'center' }}>
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
                        showBidOption == true ? '#d2691e' : '#d2691e',
                      borderWidth: showBidOption == true ? 2 : 1,
                      borderTopEndRadius: showBidOption == true ? 20 : 20,
                      borderTopStartRadius: showBidOption == true ? 20 : 20,
                      borderBottomEndRadius: showBidOption == true ? 0 : 20,
                      borderBottomStartRadius: showBidOption == true ? 0 : 20,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    this.setState({ showBidOption: !showBidOption })
                  }>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: selectedBidOption == '' ? '#a6a3a2' : 'black',
                      marginRight: 15,
                    }}>
                    {!!selectedBidOption
                      ? selectedBidOption.name
                      : ArabicText.Selectbidexpiredays}
                  </Text>
                  <Image
                    style={{
                      transform: [{ rotate: showBidOption ? '180deg' : '0deg' }],
                      width: 20,
                      height: 20,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/dropdown.jpg')}
                  />
                </TouchableOpacity>
                {showBidOption && (
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
                    {ExpireType?.map((val, i) => {
                      console.log(val);
                      return (
                        <TouchableOpacity
                          key={String(i)}
                          onPress={() => this.onBidExpireOption(val)}
                          style={{
                            backgroundColor:
                              selectedBidOption?.id == val?.id
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
                                selectedBidOption?.id == val?.id
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
          )} */}
              {/* SECTION BID EXPIRE END  */}

              <TextInput
                textAlignVertical="top"
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
                <Text
                  style={{
                    margin: 3,
                    color: 'black',
                    fontFamily: family.Neo_Regular,
                  }}>
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
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 20,
                      fontFamily: family.Neo_Regular,
                    }}>
                    {ArabicText.fixed}
                  </Text>

                  <TextInput
                    style={Styles.forminputsPrice}
                    placeholder={ArabicText.Price}
                    placeholderTextColor="#b0b0b0"
                    keyboardType="numeric"
                    onChangeText={text =>
                      this.setState({price: text.replace(/[^0-9]/g, '')})
                    }></TextInput>

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

                  <Text
                    style={{
                      color: 'black',
                      fontSize: 20,
                      fontFamily: family.Neo_Regular,
                    }}>
                    {ArabicText.offer_Up}
                  </Text>

                  <TextInput
                    style={Styles.forminputsPrice}
                    placeholder={ArabicText.Price}
                    placeholderTextColor="#b0b0b0"
                    keyboardType="numeric"
                    onChangeText={text =>
                      this.setState({price: text.replace(/[^0-9]/g, '')})
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
          </ScrollView>
        </KeyboardAvoidingView>
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
