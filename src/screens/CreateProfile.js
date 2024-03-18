/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import {bindActionCreators} from 'redux';
import {ImageBackground} from 'react-native';
import * as EmailValidator from 'email-validator';
import {ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GooglePlaceAutocomplete from '../components/GooglePlaceHolder';
import {family} from '../constants/Family';
import BackBtnHeader from '../components/headerWithBackBtn';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      location: '',
      email: '',
      pickedImage: '',
      userName: '',
      phoneNumber: '',
    };
  }
  componentDidMount() {
    let {user} = this.props;
    user = user?.user?.user;
    this.setState({user: user, image: user?.image, location: user?.location});
  }
  saveData() {
    let phone = this.state.phoneNumber;
    AsyncStorage.setItem('@UserPhone', phone);
  }
  imagePick() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      selectionLimit: 1,
    })
      .then(async images => {
        if ((images.length = 1)) {
          this.setState({
            image: images.path,
            pickedImage: 'data:image/png;base64,' + images.data,
          });
        } else {
          Toast.show({
            text1: ArabicText.Only1imageallowed,
            type: 'error',
            visibilityTime: 3000,
          });
          // alert(ArabicText?.Only1imageallowed);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createProfile = async () => {
    const {pickedImage, location, email, userName, phoneNumber} = this.state;
    const {screen, response} = this.props.route?.params;
    console.log(response, 'responseee');
    if (screen == 'socialLogin' && !phoneNumber) {
      Toast.show({
        text1: ArabicText.phonenumbercantbeempty,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (screen == 'socialLogin' && phoneNumber?.length < 10) {
      Toast.show({
        text1: ArabicText.Pleaseentercorrectphonenumber,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (screen == 'socialLogin' && !userName) {
      Toast.show({
        text1: ArabicText.usernamecantbeempty,
        type: 'error',
        visibilityTime: 3000,
      });
    }
    //  else if (!email) {
    //   Toast.show({
    //     text1: ArabicText.EmailFieldCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    //   // alert(ArabicText?.EmailFieldCantBeEmpty);
    // } else if (!EmailValidator.validate(email)) {
    //   Toast.show({
    //     text1: ArabicText.EmailIsNotValid,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    //   // alert(ArabicText?.EmailIsNotValid);
    // }
    // else if (!location) {
    //   Toast.show({
    //     text1: ArabicText.LocationFieldCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    //   // alert(ArabicText?.LocationFieldCantBeEmpty);
    // } else if (!pickedImage) {
    //   Toast.show({
    //     text1: ArabicText.ImageCantBeEmpty,
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // }
    else {
      this.setState({btnLoader: true});
      await camelapp
        .post('/update', {
          // user_id: userdata?.user?.id,
          user_id: response?.user?.id
            ? response?.user?.id
            : response?.user_details?.id
            ? response?.user_details?.id
            : response?.user_id,
          location: location,
          email: email,
          image: pickedImage,
          phone: phoneNumber ? phoneNumber : null,
          name: userName ? userName : null,
        })
        .then(res => {
          console.log(res, 'res.data.status');
          this.setState({
            btnLoader: false,
          });

          if (res.data.status == true) {
            this.setState({
              btnLoader: false,
            });
            let {actions} = this.props;
            actions.userData(res?.data);
            this.saveData();
            this.props.navigation.navigate('Home');
          } else {
            this.setState({
              btnLoader: false,
            });
            Toast.show({
              text1: res?.data?.message
                ? res?.data?.message
                : ArabicText?.Somethingwentwrong,
              type: 'error',
              visibilityTime: 3000,
            });
          }
        })
        .catch(error => {
          console.log(error, 'errorrr');
          this.setState({
            btnLoader: false,
          });
        });
    }
  };
  callback = (formatted_address, geometry) => {
    this.setState({location: formatted_address});
  };
  render() {
    const {image, btnLoader, location} = this.state;
    const screen = this.props.route?.params?.screen;
    const response = this.props.route?.params?.response;
    console.log(response, 'responseeeee');
    let {actions} = this.props;
    return (
      <View
        style={[
          Styles.container,
          {flex: 1, backgroundColor: '#D2691Eff', width: '100%'},
        ]}>
        <BackBtnHeader />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          style={{flex: 1, backgroundColor: '#fff', width: '100%'}}
          contentContainerStyle={{alignItems: 'center', width:'100%'}}
          showsVerticalScrollIndicator={false}>
          {screen != 'socialLogin' && (
            <TouchableOpacity
              onPress={() => {
                actions.userData(response);
                this.saveData();
                this.props.navigation.navigate('Home', {
                  screen: ArabicText?.home,
                });
              }}
              style={{
                marginLeft: 'auto',
                backgroundColor: '#8b4513',
                marginRight: 20,
                padding: 5,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: family.Neo_Regular,
                  paddingHorizontal: 10,
                  color:'#fff'
                }}>
                {ArabicText.Skip}
              </Text>
            </TouchableOpacity>
          )}

          {/* PROFILE IMAGE  */}
          <View
            style={{
              backgroundColor: 'lightgrey',
              width: 150,
              height: 150,
              borderRadius: 100,
              marginTop: 30,
              marginBottom: 30,
            }}>
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
              }}
              source={
                image ? {uri: image} : require('../../assets/dummyImage.jpeg')
              }>
              <TouchableOpacity
                onPress={() => this.imagePick()}
                style={{
                  marginTop: -30,
                  position: 'absolute',
                  bottom: 0,
                  borderRadius: 100,
                  backgroundColor: 'orange',
                  // borderColor: Colors.color1,
                  // borderWidth: 4,
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
          </View>

          <Text style={[Styles.text, {marginVertical: 20}]}>
            {ArabicText?.CreateProfile}
          </Text>
          {/* INPUT FIELDS  */}
          <View style={Styles.profileQuestioncard}>
            {screen == 'socialLogin' ? (
              <>
                <TextInput
                  style={Styles.inputs}
                  keyboardType="numeric"
                  placeholder={ArabicText.phone}
                  maxLength={10}
                  placeholderTextColor="#b0b0b0"
                  onChangeText={text =>
                    this.setState({phoneNumber: text.replace(/[^0-9]/g, '')})
                  }
                />
                <TextInput
                  maxLength={30}
                  style={Styles.inputs}
                  value={this?.state?.userName}
                  onChangeText={text => {
                    const isArabic = Array.from(text).every(char =>
                      /^[\u0600-\u06FF\s]+$/.test(char),
                    );
                    if (isArabic) {
                      this.setState({userName: text});
                    }
                  }}
                  placeholder={ArabicText.name}
                  placeholderTextColor="#b0b0b0"
                />
              </>
            ) : null}
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
              value={location}
              onChangeText={text => this.setState({location: text})}
              placeholder={ArabicText.Location}
              placeholderTextColor="#b0b0b0"
            /> */}
            <GooglePlaceAutocomplete
              callback={(formatted_address, geometry) => {
                this.callback(formatted_address, geometry);
              }}
            />
          </View>

          {/* Create Profile */}
          <TouchableOpacity
            onPress={() => {
              !btnLoader && this.createProfile();
            }}
            style={{
              backgroundColor: '#8b4513',
              width: 200,
              height: 40,
              borderRadius: 7,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            {this?.state?.btnLoader ? (
              <ActivityIndicator
                size="large"
                color="white"
                animating={this?.state?.btnLoader}
              />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: family.Neo_Regular,
                }}>
                {ArabicText?.CreateProfile}
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile);
