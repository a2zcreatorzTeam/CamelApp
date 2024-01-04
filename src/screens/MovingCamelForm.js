import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ArabicText from '../language/EnglishToArabic';
import Loader from '../components/PleaseWait';
import camelapp from '../api/camelapp';
import Ads from '../components/Ads';
import RNFS from 'react-native-fs';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import * as ImageCropPicker from 'react-native-image-crop-picker';
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
import BackBtnHeader from '../components/headerWithBackBtn';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import {createThumbnail} from 'react-native-create-thumbnail';

class MovingCamelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoForPost: undefined,
      imagesForPost: [],
      image: undefined,
      video: undefined,
      mixed: [],
      imageFlage: false,
      title: '',
      description: '',
      location: '',
      color: '',
      camel_type: '',
      price_type: '',
      price: '',
      commission: false,
      checked: 'first',
      register: 0,
      register_value: 0,
      moving_camel_amount: 0,
      to_location: '',
      images: {uri: '', name: '', type: ''},
      localUrii: '',
      paySwitch: false,
      fileName: '',
      car_name: '',
      car_type: '',
      Bank: '',
      registerSwitch: false,
      pay: 0,
      loading: false,
      modalVisible: false,
      accountTitle: '',
      accountNumber: 0,
      branchCode: '',
      cameraimage: [],

      cameraimagesForPost: [],
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
      thumbnail: null,
    };
  }
  createPostMovingCamel = async () => {
    const {
      videoForPost,
      thumbnail,
      imagesForPost,
      cameraimagesForPost,
      title,
      location,
      description,
      car_name,
      car_type,
      price,
      to_location,
      pay,
      register,
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
      location != '' &&
      description != '' &&
      car_name != '' &&
      car_type != '' &&
      price != '' &&
      to_location != ''
    ) {
      this.setState({loading: true});
      let {user} = this.props;
      let user_id = user?.user?.user.id;
      camelapp
        .post('/add/camel_moving', {
          user_id: user_id,
          title: title,
          location: location,
          description: description,
          images: combineImages ? combineImages : [],
          video: videoForPost ? videoForPost : null,
          register: register,
          car_model: car_name,
          car_type: car_type,
          price: price,
          to_location: to_location,
          account_activity: pay,
                              thumbnail: thumbnailObj ? JSON.stringify(thumbnailObj) : null

,
        })
        .then(response => {
          console.log(response?.data?.status, 'statusss');
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
          // this.props.navigation.navigate('Home');
          this.props.navigation.replace('CamelMovingList');
        })
        .catch(error => {
          // alert(error, 'errorrrrrrrrr');
          console.log('error162', error?.response, 'errorRespos');
          this.setState({loading: false});
        });
    } else {
      return Toast.show({
        text1: ArabicText.Please_complete_the_fields + '',
        type: 'error',
        visibilityTime: 3000,
      });

      // alert("Please complete the fields")
    }
  };
  checkBoxChanged() {
    this.setState({commission: !this.state.commission});
    if (this.state.commission == false) {
      this.setState({moving_camel_amount: 1});
    } else {
      this.setState({moving_camel_amount: 0});
    }
  }
  // VIDEO PICKER
  videoPicker = async () => {
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
  // SELECT IMAGE FROM GALLERY
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
  onRegisterSwitchChanged(value) {
    console.log(' ----- value', value);

    this.setState({registerSwitch: value});
    if (value === false) {
      this.setState({register: 0});
    }
    if (value === true) {
      this.setState({register: 1});
    }
    //console.log("this.state.registerSwitch", this.state.registerSwitch)
    //console.log("register", this.state.register)
  }
  onpaySwitchChanged(value) {
    //console.log(" ----- value", value)

    this.setState({paySwitch: value});
    if (value === false) {
      this.setState({pay: 0});
    }
    if (value === true) {
      this.setState({modalVisible: true});
      this.setState({pay: 1});
    }
  }
  bankDetailHandler() {
    // if (this.state.accountNumber.length < 14) {
    //   alert("account number length 14 required")
    // } else if (this.state.accountTitle === "") {
    //   alert("Please Enter Account Title")
    // } else if (this.state.branchCode === "") {
    //   alert("Please Enter Branch Code")
    // } else {

    //   console.log(this.state.accountTitle)
    //   console.log(this.state.accountNumber)
    //   console.log(this.state.branchCode)

    //   this.setState({ modalVisible: false })
    //   this.setState({ paySwitch: true })
    // }
    this.setState({modalVisible: false});
    this.setState({paySwitch: true});
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
    const {pausedCheck, loadVideo, videoModal, modalItem, thumbnail} =
      this.state;
    return (
      <SafeAreaView style={Styles.container}>
        <BackBtnHeader />
        {/* <Ads /> */}
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            minHeight: '100%',
            paddingBottom: width * 0.1,
            backgroundColor: '#fff',
          }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <View style={Styles.container}>
            <Text style={[Styles.headingPostText, {marginTop: 30}]}>
              {ArabicText?.Movingcamel}
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
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={Styles.cameraview}>
                <TouchableOpacity onPress={() => this.videoPicker()}>
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
              placeholder={ArabicText.Car_Name}
              placeholderTextColor="#b0b0b0"
              value={this.state.car_name}
              onChangeText={text => {
                if (text.length <= 24) {
                  this.setState({car_name: text});
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
              placeholder={ArabicText.car_type}
              placeholderTextColor="#b0b0b0"
              value={this.state.car_type}
              onChangeText={text => {
                if (text.length <= 24) {
                  this.setState({car_type: text});
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
              keyboardType="numeric"
              placeholder={ArabicText.Price}
              placeholderTextColor="#b0b0b0"
              value={this.state.price}
              onChangeText={text => {
                if (text.length <= 24) {
                  this.setState({price: text.replace(/[^0-9]/g, '')});
                } else {
                  Toast.show({
                    text1: ArabicText?.limitCharacters,
                    type: 'error',
                    visibilityTime: 3000,
                  });
                }
              }}></TextInput>

            <View style={{flexDirection: 'row', margin: 5}}>
              <TextInput
                style={Styles.mforminputs}
                placeholder={ArabicText.From}
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
                style={Styles.mforminputs}
                placeholder={ArabicText.To}
                placeholderTextColor="#b0b0b0"
                value={this.state.to_location}
                onChangeText={text => {
                  if (text.length <= 300) {
                    this.setState({to_location: text});
                  } else {
                    Toast.show({
                      text1: ArabicText?.limitCharacters,
                      type: 'error',
                      visibilityTime: 3000,
                    });
                  }
                }}></TextInput>
            </View>

            <TextInput
              textAlignVertical="top"
              style={[Styles.inputdecrp, {marginTop: 20}]}
              placeholder={ArabicText.Description}
              placeholderTextColor="#b0b0b0"
              value={this.state.description}
              onChangeText={text => {
                if (text.length <= 300) {
                  this.setState({description: text});
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
                flexDirection: 'row',
                alignSelf: 'flex-end',
                margin: 20,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{margin: 3, fontWeight: 'bold', color: 'black'}}>
                {ArabicText?.Iaccepttermsandconditions}
              </Text>

              <Switch
                trackColor={{false: '#767577', true: '#D2691Eff'}}
                thumbColor={this.state.registerSwitch ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => this.onRegisterSwitchChanged(value)}
                value={this.state.registerSwitch}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                margin: 20,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{margin: 3, fontWeight: 'bold', color: 'black'}}>
                {ArabicText.In_order_to_activity_your_account_pay}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#D2691Eff'}}
                thumbColor={this.state.paySwitch ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => this.onpaySwitchChanged(value)}
                value={this.state.paySwitch}
              />
            </View>

            <Loader loading={this.state.loading} />
            <TouchableOpacity onPress={() => this.createPostMovingCamel()}>
              <View style={Styles.btnform}>
                <Text style={Styles.textbtn}>{ArabicText.add}</Text>
              </View>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              visible={this.state.modalVisible}
              transparent={true}
              onRequestClose={() =>
                this.setState({paySwitch: false, modalVisible: false})
              }>
              <TouchableOpacity
                activeOpacity={1}
                style={{height: height}}
                onPress={() =>
                  this.setState({paySwitch: false, modalVisible: false})
                }
              />
              <View
                style={{
                  height: 300,
                  width: width,
                  marginTop: 'auto',
                  backgroundColor: '#ddd',
                  borderRadius: 20,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 30,
                    borderTopEndRadius: 25,
                    borderTopStartRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: '#8b4513', fontSize: 15, fontWeight: '600'}}>
                    {ArabicText?.EnterBankDetails}
                  </Text>
                </View>
                <View
                  style={[
                    Styles.forminputs,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={{color: '#000', fontSize: 15}}>
                    <Text style={{color: 'grey', fontSize: 13}}>
                      {ArabicText?.AccountTitle}:{' '}
                    </Text>
                    Mansoor Akhter
                  </Text>
                </View>
                <View
                  style={[
                    Styles.forminputs,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={{color: '#000', fontSize: 15}}>
                    <Text style={{color: 'grey', fontSize: 13}}>
                      {ArabicText?.AccountNumber}:{' '}
                    </Text>
                    0000-1111-2222-33
                  </Text>
                </View>
                <View
                  style={[
                    Styles.forminputs,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={{color: '#000', fontSize: 15}}>
                    <Text style={{color: 'grey', fontSize: 13}}>
                      {ArabicText?.BranchCode}:{' '}
                    </Text>
                    SC7512
                  </Text>
                </View>
                {/* <TextInput
                  style={Styles.forminputs}
                  placeholder="Account Title"
                  placeholderTextColor="#aaa"
                  value={this.state.accountTitle}
                  onChangeText={(text) => this.setState({ accountTitle: text })}
                />
                <TextInput
                  style={Styles.forminputs}
                  placeholder="Account Number"
                  placeholderTextColor="#aaa"
                  keyboardType='number-pad'
                  value={this.state.accountNumber}
                  maxLength={14}
                  onChangeText={(text) => this.setState({ accountNumber: text })}
                />
                <TextInput
                  style={Styles.forminputs}
                  placeholder="Branch Code"
                  placeholderTextColor="#aaa"
                  value={this.state.branchCode}
                  onChangeText={(text) => this.setState({ branchCode: text })}
                /> */}

                <TouchableOpacity
                  style={{alignSelf: 'center', marginTop: 20}}
                  onPress={() => this.bankDetailHandler()}>
                  <View style={Styles.btn}>
                    <Text style={Styles.textbtn}>{ArabicText?.Close}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>

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
          </View>
        </ScrollView>
      </SafeAreaView>
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
export default connect(mapStateToProps, mapDispatchToProps)(MovingCamelForm);
