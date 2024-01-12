import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  NativeModules,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ArabicText from '../language/EnglishToArabic';
import AntDesign from 'react-native-vector-icons/AntDesign';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import {bindActionCreators} from 'redux';
import * as EmailValidator from 'email-validator';
import Toast from 'react-native-toast-message';
import BackBtnHeader from '../components/headerWithBackBtn';
import CookieManager from '@react-native-cookies/cookies';
import Loader from '../components/PleaseWait';
import GooglePlaceAutocomplete from '../components/GooglePlaceHolder';
import {profileBaseUrl} from '../constants/urls';

const {RNTwitterSignIn} = NativeModules;

class EditProfile extends Component {
  constructor(props) {
    super(props);
    let {user} = props;
    user = user?.user?.user;
    this.state = {
      userName: user?.name ? user?.name : null,
      image: '',
      location: user?.location ? user?.location : null,
      imageShow: undefined,
      pickedImage: '',
      btnLoader: false,
      email: user?.email ? user?.email : null,
      loading: false,
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      const user = this.props.user?.user?.user;
      this.setState({
        userName: user?.name ? user?.name : null,
        email: user?.email ? user?.email : null,
        location: user?.location ? user?.location : null,
        user: user,
      });
      console.log(this.props.user?.user, 'usere');
    });
  }
  componentWillUnmount() {
    this.setState({
      user: null,
      userName: null,
      location: null,
      email: null,
    });
    this.focusListener();
  }

  // clearAll COOKIES
  onClear = () => {
    CookieManager.clearAll(true).then(res => {
      console.log(res, 'responsee');
    });
  };
  logOut = async () => {
    try {
      let {user, actions} = this.props;
      let id = user?.user?.user?.id;
      let userdetail = user?.user?.user;
      this.setState({loading: true});
      await camelapp
        .get('/logout/' + id)
        .then(
          (response = async () => {
            console.log(response, 'responsee');
            if (userdetail?.socialType == 'instagram') {
              this.onClear();
            } else if (userdetail?.socialType == 'twitter') {
              console.log('twitter');
              await RNTwitterSignIn.logOut();
            }
            console.log('logouttttt successsss');
            actions?.userLogout();
            AsyncStorage.removeItem('@UserPassword');
            AsyncStorage.removeItem('@UserPhone');
            AsyncStorage.removeItem('fcmToken');
            this.setState({loading: false});
            console.log(this.props.user, 'userFromedittttt');
            this.props.navigation.replace('Home');
            Toast.show({
              text1: ArabicText.logoutsuccessfully,
              type: 'success',
              visibilityTime: 3000,
            });
          }),
        )
        .catch(error => {
          this.setState({loading: false});
          Toast.show({
            text1: ArabicText.somethingwentwrong,
            type: 'error',
            visibilityTime: 3000,
          });
          console.log(error, 'errrrr');
        });
    } catch (error) {
      console.log('error', error);
    }
  };
  openGallery() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      selectionLimit: 1,
    })
      .then(async images => {
        if ((images.length = 1)) {
          this.setState({
            image: images?.path,
            pickedImage: 'data:image/png;base64,' + images.data,
          });
        } else {
          Toast.show({
            text1: ArabicText.Only1imageallowed,
            type: 'error',
            visibilityTime: 3000,
          });
        }
        console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  clearText = () => {
    this.otpInput.clear();
  };
  setText = () => {
    this.otpInput.setValue('1234');
  };
  updateProfile = async () => {
    const image = this.props.user?.user?.user?.image;
    const {email, location, pickedImage, userName} = this.state;
    // if (!pickedImage && !image) {
    //   Toast.show({
    //     text1: ArabicText.ImageCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // }
    //  else if (!userName) {
    //   Toast.show({
    //     text1: ArabicText.UsernameCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // }
    // if (!email) {
    //   Toast.show({
    //     text1: ArabicText.EmailFieldCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // } else if (!EmailValidator.validate(email)) {
    //   Toast.show({
    //     text1: ArabicText.EmailIsNotValid,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // }
    // else if (!location) {
    //   Toast.show({
    //     text1: ArabicText.LocationFieldCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // }
    // else {
    this.setState({
      btnLoader: true,
    });
    let {actions} = this.props;
    if (this.state.imageShow == undefined) {
      console.log('99999');
      await camelapp
        .post('/update', {
          user_id: this.props.user?.user?.user.id,
          name: userName,
          location: location ? location : null,
          email: email ? email : null,
          image:
            pickedImage !== undefined
              ? pickedImage
              : image?.length
              ? image
              : null,
        })
        .then(res => {
          if (res.data.status == true) {
            this.setState({
              btnLoader: false,
            });
            actions.userData(res?.data);
            this.props.navigation.replace('Profile', {
              screen: ArabicText.profilee,
            });
          } else {
            this.setState({
              btnLoader: false,
            });
            this.props.navigation.replace('Profile', {
              screen: ArabicText.profilee,
            });
          }
        })
        .catch(error => {
          console.log(error, 'errorr');
          this.setState({
            btnLoader: false,
          });
        });
      // }
    }
  };
  callback = (formatted_address, geometry) => {
    this.setState({location: formatted_address});
    console.log(formatted_address, geometry, 'gejghgh');
  };

  render() {
    const {image, pickedImage} = this.state;
    let {user} = this.props;
    user = user?.user?.user;

    return (
      // <ScrollView
      //   showsVerticalScrollIndicator={false}
      //   contentContainerStyle={{ paddingTop: 10, backgroundColor: "#fff" }}>
      <View style={Styles.container}>
        <BackBtnHeader showToolTip style={{justifyContent: 'space-around'}} />
        <ImageBackground
          imageStyle={{
            borderRadius: 100,
            borderColor: 'orange',
            borderWidth: 2,
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            alignSelf: 'center',
            marginTop: 30,
          }}
          source={
            pickedImage?.length
              ? {uri: image}
              : this.props.user?.user?.user?.image
              ? {
                  uri:
                    // 'http://www.tasdeertech.com/public/images/profiles/' +
                    profileBaseUrl + this.props.user?.user?.user?.image,
                }
              : require('../../assets/dummyImage.jpeg')
          }>
          <TouchableOpacity
            onPress={() => this.openGallery()}
            style={{
              marginTop: -30,
              position: 'absolute',
              bottom: 0,
              borderRadius: 100,
              backgroundColor: 'orange',
              alignContent: 'center',
              alignSelf: 'center',
              padding: 10,
            }}>
            <Image
              source={require('../../assets/edit.png')}
              resizeMode="contain"
              style={{
                tintColor: 'white',
                width: 20,
                height: 20,
              }}
              name="upload"
            />
          </TouchableOpacity>
        </ImageBackground>
        <Loader loading={this.state.loading} />
        <Text style={Styles.text}>{ArabicText.Edit_profile}</Text>

        <View style={Styles.profileQuestioncard}>
          <TextInput
            maxLength={30}
            style={Styles.inputs}
            value={this.state.userName}
            onChangeText={text => {
              const isInitiallyEnglish = /^[a-zA-Z]+/.test(this.state.userName);
              const isArabicOnly = /^[\u0600-\u06FF\s]*$/.test(text);
              if (isInitiallyEnglish || isArabicOnly) {
                this.setState({userName: text});
              }
            }}
            placeholder={ArabicText.Name}
            placeholderTextColor="#b0b0b0"
          />
          <TextInput
            style={Styles.inputs}
            value={this?.state?.email}
            onChangeText={text => this.setState({email: text})}
            placeholder={ArabicText.EMAIL}
            placeholderTextColor="#b0b0b0"
            keyboardType="email-address"
          />

          {/* <TextInput
            style={Styles.inputs}
            value={this.state.location}
            onChangeText={text => this.setState({location: text})}
            placeholder={ArabicText.Location}
            placeholderTextColor="#b0b0b0"
          /> */}
          <GooglePlaceAutocomplete
            placeholder={user?.location}
            callback={(formatted_address, geometry) => {
              this.callback(formatted_address, geometry);
            }}
          />
        </View>
        {/* Update Profile */}
        <TouchableOpacity
          onPress={this.updateProfile}
          style={{
            backgroundColor: '#8b4513',
            width: 200,
            height: 40,
            borderRadius: 7,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          {this.state.btnLoader ? (
            <ActivityIndicator
              size="large"
              color="white"
              animating={this.state.btnLoader}
            />
          ) : (
            <Text style={{color: '#fff', fontSize: 16}}>
              {ArabicText?.UpdateProfile}
            </Text>
          )}
        </TouchableOpacity>

        {/* logout button */}
        <TouchableOpacity
          onPress={() => this.logOut()}
          style={{alignSelf: 'center', marginBottom: 20, marginTop: 10}}>
          <AntDesign name="poweroff" size={25} color="red" />
        </TouchableOpacity>
      </View>

      // <Modal
      //   animationType="slide"
      //   visible={this.state.modalVisible}
      //   transparent={true}
      //   onRequestClose={() => this.setState({ modalVisible: false })}
      // >
      //   <TouchableOpacity activeOpacity={1} style={{ height: height }}
      //     onPress={() => this.setState({ modalVisible: false })}
      //   />
      //   <View style={{
      //     height: '20%',
      //     width: width,
      //     marginTop: 'auto',
      //     backgroundColor: '#ccc',
      //     borderTopEndRadius: 20,
      //     borderTopStartRadius: 20,
      //     position: "absolute",
      //     bottom: 0
      //   }}>
      //     <View style={{
      //       height: 30,
      //       borderTopEndRadius: 25,
      //       borderTopStartRadius: 25,
      //       justifyContent: "center",
      //       alignItems: "center"
      //     }}>
      //       <Text style={{ color: "#8b4513", fontSize: 15, fontWeight: "600" }}>Enter OTP Here</Text>
      //     </View>

      //     <OTPTextInput
      //       tintColor="#8b4513"
      //       ref={e => (this.otpInput = e)}
      //       containerStyle={{ width: "90%", alignSelf: "center", bottom: 10 }}
      //       handleTextChange={(e) => this.setState({ optVal: e })} />
      //   </View>
      // </Modal>

      // </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
