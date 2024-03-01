/* eslint-disable react-native/no-inline-styles */
import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
  BackHandler,
  NativeModules,
} from 'react-native';
const {RNTwitterSignIn} = NativeModules;
import * as ArabicText from '../language/EnglishToArabic';
import {Styles} from '../styles/globlestyle';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Dimensions} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getFCMToken} from '../services/Helper';
import Toast from 'react-native-toast-message';
import InstagramLogin from 'react-native-instagram-login';
import CookieManager from '@react-native-cookies/cookies';
import BackBtnHeader from '../components/headerWithBackBtn';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;

RNTwitterSignIn.init(
  'ss6WPZy3wAQXXSRdci89Hwjwd',
  'MggWb6ZXkPN19emSBEMt9yDi1tNf5sIF22eeaSh7O3L83c2NDv',
).then(res => console.log('Twitter SDK initialized', res));

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactNumber: '',
      contactNumberError: '',
      password: '',
      passwordError: '',
      modalVisible: false,
      loader: false,
      openloader: false,
      checked: false,
      otp: false,
      randomIndex: 0,
      hidePassword: true,
      token: '',
      emailModal: false,
    };
    this.backHandler = null;
    this.instagramLoginRef = createRef();
  }
  saveData() {}
  userlogin = async () => {
    try {
      let userPhone = await AsyncStorage.getItem('@UserPhone');
      const userPass = await AsyncStorage.getItem('@UserPassword');
      // const phoneParse = JSON.parse(userPhone);
      // const passParse = JSON.parse(userPass);

      console.log(userPhone, '====userCheck====', userPass);
    } catch (e) {
      Toast.show({
        text1: e,
        type: 'error',
        visibilityTime: 3000,
      });
      // alert(e);
    }
  };
  componentDidMount = () => {
    // this.onClear();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          this.props.navigation.navigate('Home', {screen: ArabicText?.home});
          return true; // or false based on your requirements
        },
      );
    });
  };
  componentWillUnmount = () => {
    this?.focusListener(); // Remove the focus listener
    this?.backHandler?.remove(); // Remove the BackHandler event listener
  };

  // InstagramTwitterLogin
  setIgToken = async data => {
    console.log(data?.access_token, 'data?.access_tokendata?.access_token');
    this.setState({loader: true});
    await getFCMToken();
    const deviceToken = await AsyncStorage?.getItem('fcmToken');
    try {
      camelapp
        .post('/social/login', {
          socialToken: data?.access_token,
          social_id: data?.user_id,
          socialType: data?.socialType ? data?.socialType : 'instagram',
          device_token: deviceToken,
        })

        .then(res => {
          console.log(res?.data?.user_details?.is_complete, 'dataaa');
          if (
            res?.data?.user?.is_complete == 1 ||
            res?.data?.user_details?.is_complete == 1
          ) {
            let {actions} = this.props;
            actions.userData(res?.data);
            this.saveData();
            this.props.navigation.navigate('Home');
          } else {
            this.props.navigation.navigate('CreateProfile', {
              response: res?.data,
              screen: 'socialLogin',
            });
          }
          this.setState({loader: false});
        })
        .catch(error => {
          console.log(error, 'errorr');
          this.setState({loader: false});
        });
    } catch (error) {
      this.setState({loader: false});
      Toast.show({
        text1: error?.response + '',
        type: 'error',
        visibilityTime: 3000,
      });
      // alert(error?.response + '');
      console.log('Error Message--- signin', error);
    }
  };
  // TWITTERLOGIN
  signInWithTwitter = async () => {
    console.log('Twittterrrrrrrr');
    try {
      const loginData = await RNTwitterSignIn.logIn();
      console.log(loginData, 'loginnn147777');
      const {authToken, authTokenSecret} = loginData;
      console.log(authToken, 'authToken', authTokenSecret);
      if (authToken && authTokenSecret) {
      }
    } catch (error) {
      console.log(error, 'errr');
      try {
        const message = error?.message;
        const startIndex = message.indexOf('{ NativeMap: ');
        const endIndex = message.lastIndexOf('"}');
        if (startIndex !== -1 && endIndex !== -1) {
          const innerJsonString = message.slice(12, endIndex + 2); // Include the closing double quote and curly brace
          try {
            const data = JSON.parse(innerJsonString);
            const {email, userName, userID, name, authToken, authTokenSecret} =
              data;
            this.setIgToken({
              access_token: authToken,
              user_id: userID,
              socialType: 'twitter',
            });
          } catch (e) {
            console.log(e, 'eeeeee');
            return Toast.show({
              text1: ArabicText.somethingwentwrong,
              type: 'error',
              visibilityTime: 3000,
            });
          }
        } else {
          console.log(error, 'errorerror');
          if (message == 'Failed to get request token') {
            return Toast.show({
              text1: 'Please install twitter app and login your account first',
              type: 'error',
              visibilityTime: 3000,
            });
          } else {
            return Toast.show({
              text1: ArabicText.somethingwentwrong,
              type: 'error',
              visibilityTime: 3000,
            });
          }
          // console.error('Data not found in the string');
        }
      } catch (err) {
        console.log(err, 'errorrrr');
        return Toast.show({
          text1: error + '',
          type: 'error',
          visibilityTime: 3000,
        });
      }
    }
  };
  // clearAll COOKIES
  onClear = () => {
    CookieManager.clearAll(true).then(res => {
      console.log(res, 'responsee');
    });
  };

  render() {
    const authentication = async () => {
      const {contactNumber, password} = this.state;
      this.setState({loader: true});
      // await getFCMToken();
      // const deviceToken = await AsyncStorage?.getItem('fcmToken');
      const [_, deviceToken] = await Promise.all([
        getFCMToken(),
        AsyncStorage.getItem('fcmToken'),
      ]);
      console.log(deviceToken, 'deviceTokeennnn', Platform?.OS);
      let number = 0;
      do {
        number = Math.floor(Math.random() * 10000) + 1;
      } while (number < 1000 || number > 10000);
      this.setState({randomIndex: number});
      if (this.state.contactNumber.length >= 10 && this.state.password != '') {
        var response = null;
        try {
          camelapp
            .post('/login', {
              phone: contactNumber,
              password: password,
              device_type: Platform?.OS,
              device_token: deviceToken,
            })
            .then(res => {
              console.log(res, 'login responseee');
              response = res?.data;
              if (response?.status == true) {
                this.setState({loader: false});
                if (
                  response?.data?.is_complete == 1 ||
                  response?.user?.is_complete == 1
                ) {
                  let {actions} = this.props;
                  actions.userData(response);
                  AsyncStorage.setItem('@UserPhone', contactNumber);
                  AsyncStorage.setItem('@UserPassword', password);
                  this.props.navigation.navigate('Home');
                } else {
                  this.props.navigation.navigate('CreateProfile', {
                    response: response,
                  });
                }
                // this.props.navigation.navigate('Home', {
                //   // response: response,
                // });
              } else {
                Toast.show({
                  text1: response?.error + '',
                  type: 'error',
                  visibilityTime: 3000,
                });
                this.setState({loader: false});
              }
            })
            .catch(error => {
              console.log(error, 'errr000');
              this.setState({loader: false});
              Toast.show({
                text1: error?.response?.message + '',
                type: 'error',
                visibilityTime: 3000,
              });
            });
        } catch (error) {
          console.log(error, 'errrr');
          this.setState({loader: false});
          Toast.show({
            text1: error?.response + '',
            type: 'error',
            visibilityTime: 3000,
          });
          // alert(error?.response + '');
          console.log('Error Message--- signin', error);
        }
      } else {
        console.log('287777');
        this.setState({loader: false});
        Toast.show({
          text1: ArabicText.Please_complete_the_fields + '',
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(ArabicText.Please_complete_the_fields + '');
      }
    };
    return (
      <View
        style={[
          Styles.container,
          {backgroundColor: '#D2691Eff', flex: 1, width: '100%'},
        ]}>
        <BackBtnHeader
          Nav={true}
          customNav={() => {
            this.props.navigation.navigate('Home', {screen: ArabicText?.home});
          }}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: '#fff', width: '100%'}}>
          <Image
            source={require('../../assets/logo-camel.png')}
            style={{
              height: 90,
              width: 90,
              marginTop: 60,
              alignSelf: 'center',
            }}
          />

          <Text style={Styles.text}>{ArabicText.login}</Text>
          <View style={Styles.card}>
            <TextInput
              style={Styles.inputs}
              keyboardType="numeric"
              placeholder={ArabicText.phone}
              maxLength={10}
              placeholderTextColor="#000000"
              onChangeText={text =>
                this.setState({contactNumber: text.replace(/[^0-9]/g, '')})
              }
            />

            <Text
              style={{
                color: 'red',
                marginRight: 200,
                fontFamily: family.Neo_Regular,
              }}>
              {this.state.contactNumberError}
            </Text>

            <View
              style={[
                Styles.inputs,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              {this.state.hidePassword === true ? (
                <Ionicons
                  name="eye"
                  size={18}
                  color="brown"
                  onPress={() => this.setState({hidePassword: false})}
                />
              ) : (
                <Ionicons
                  name="eye-off"
                  size={18}
                  color="brown"
                  onPress={() => this.setState({hidePassword: true})}
                />
              )}
              <TextInput
                style={{
                  textAlign: 'right',
                  color: 'black',
                  width: width - 100,
                  fontFamily: family.Neo_Regular,
                }}
                placeholder={ArabicText.passwords}
                secureTextEntry={this.state.hidePassword}
                placeholderTextColor="#000000"
                onChangeText={text => this.setState({password: text})}
              />
            </View>

            <Text
              style={{
                color: 'red',
                marginRight: 160,
                fontFamily: family.Neo_Regular,
              }}>
              {this.state.passwordError}
            </Text>

            <TouchableOpacity
              style={{alignSelf: 'flex-end', marginRight: 15}}
              onPress={() => this.props.navigation.navigate('Forgetpass')}>
              <Text
                style={{
                  color: '#d2691e',
                  fontFamily: family.Neo_Medium,
                  fontSize: 14,
                }}>
                {ArabicText.forget_Password}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{alignSelf: 'flex-end', marginRight: 15, marginTop: 20}}
              onPress={() => this.props.navigation.navigate('Signup')}>
              <Text
                style={{
                  color: '#d2691e',
                  fontFamily: family.Neo_Regular,
                  fontSize: 14,
                  // fontWeight: '700',
                }}>
                {ArabicText.Create_an_account}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
            <TouchableOpacity
              onPress={() => {
                // this.onClear();
                // this.props.navigation?.navigate('InstagramScreen');
                this.instagramLogin.show();
              }}
              style={{flexDirection: 'row'}}>
              <Fontisto
                name="instagram"
                size={24}
                color="#d2691e"
                style={{margin: 5}}
              />

              <Text
                style={{
                  margin: 5,
                  color: '#d2691e',
                  fontFamily: family.Neo_Regular,
                  // fontWeight: '700',
                }}>
                {ArabicText?.Instagram}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                RNTwitterSignIn.logOut();
                this.signInWithTwitter();
              }}
              style={{flexDirection: 'row'}}>
              <Feather
                name="twitter"
                size={24}
                color="#d2691e"
                style={{margin: 5}}
              />

              <Text
                style={{
                  margin: 5,
                  color: '#d2691e',
                  fontFamily: family.Neo_Regular,
                  // fontWeight: '700',
                }}>
                {ArabicText?.Twitter}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => authentication()}
            style={{alignSelf: 'center'}}>
            <View
              style={[
                Styles.btn,
                {
                  backgroundColor:
                    this.state.loader == false ? '#8b4513' : '#cccbca',
                },
              ]}>
              {this.state.loader && (
                <ActivityIndicator
                  size="large"
                  color="#D2691Eff"
                  animating={this.state.loader}
                />
              )}
              {this.state.loader == false && (
                <Text style={Styles.textbtn}>{ArabicText.login}</Text>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          {this.state.otp === true && (
            <View style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'black',
                  opacity: 0.7,
                }}
              />

              <View
                style={[
                  styles.modalView,
                  {
                    bottom: 0,
                  },
                ]}>
                {/* <Text style={{ fontSize: 25, textAlign: "center", fontWeight: "700", color: "black" }}>Enter OTP</Text> */}
                <OTPTextView
                  ref={e => (this.input1 = e)}
                  handleTextChange={e => {
                    if (parseInt(e) == this.state.randomIndex) {
                      // setTimeout(() => {
                      this.setState({otp: false, loader: true});

                      setTimeout(() => {
                        this.setState({checked: true, loader: false});

                        setTimeout(() => {
                          this.setState({checked: false, modalVisible: false});
                          this.props.navigation.navigate('Home');
                        }, 1000);
                      }, 1000);
                      // }, 2000);
                    }
                  }}
                  containerStyle={styles.textInputContainer}
                  textInputStyle={styles.roundedTextInput}
                  inputCount={4}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}

          {/* {this.state.checked === true &&
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: "black", opacity: 0.7 }}>
              </View>


              <View style={[styles.modalView,
              {
                bottom: 0,

              }

              ]}>
                <LottieView
                  source={require('../../assets/animations/checked.json')}
                  autoPlay
                  loop />

              </View>
            </View>
          } */}
          {/* {this.state.loader === true &&

            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: "black", opacity: 0.7 }}>
              </View>


              <View style={[styles.modalView,
              {
                bottom: 0,

              }

              ]}>
                <LottieView
                  source={require('../../assets/animations/loader.json')}
                  autoPlay
                  loop />

              </View>
            </View>
          } */}

          {/* {this.state.openloader == true &&
            <View
              style={
                [styles.modalView, {
                  bottom: 0,
                }]
              }>
              <LottieView
                source={require('../../assets/animations/loader.json')}
                autoPlay
                loop />

            </View>
          } */}
        </Modal>

        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          appId="1623382674858969"
          appSecret="7e912ae51583adeba9a174b5c468aba2"
          redirectUrl="https://com.alsyahd.camel/redirect"
          incognito={false}
          // scopes={['user_profile', 'user_email']}
          scopes={['user_profile', 'user_media']}
          onLoginSuccess={this.setIgToken}
          onLoginFailure={data => console.log(data, 'falseDataaaa')}
          language="en" //default is 'en' for english
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    marginBottom: 20,
    padding: 10,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
  },
  modalView: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 35,
    width: width,
    alignItems: 'center',
    shadowColor: '#000',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    height: 150,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
