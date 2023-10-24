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
  Linking,
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
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import InstagramLogin from 'react-native-instagram-login';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import CookieManager from '@react-native-cookies/cookies';
import {encode as base64Encode} from 'base-64';

RNTwitterSignIn.init(
  'WW08tCdnwdVjaEwHkRUJsKyXK',
  'QJKZDX6neisbF6pKB3rNuL1CkYoIPRErRDJX5mcXa4Sg0bK0KU',
).then(() => console.log('Twitter SDK initialized'));
// b2O6ZYjbTBfD6If5Sk9WQY9N0 //appKEY
//CSMNevPnxKSPXOj4GE8Zdr0fGMyt1PwX8gwK0ML1V5GLKFTGzK app secretkey
// AAAAAAAAAAAAAAAAAAAAAIOxqgEAAAAA70t7%2B6N8GbN%2BNOXoqit47AwUnBQ%3D7LUQVc4o4n34SAvp2TkaiAGGH4uXaxMLn4h9YDBtY7c88DaENi Bearertoken

// 1711260246377730048-evHWc3jllY5Ci2kU6DH5V3ZcxzNuh6 access token
// vyD5PFr1QBXSE6J6wud5dpDMcN0dDe7JR4RnqXmaQqGqI access secret key
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
    };
    this.backHandler = null;
    this.instagramLoginRef = createRef();
  }
  saveData() {
    let phone = this.state.contactNumber;
    let password = this.state.password;
    AsyncStorage.setItem('@UserPhone', phone);
    AsyncStorage.setItem('@UserPassword', password);
  }
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
  setIgToken = data => {
    this.onClear();
    this.setState({loader: true});
    try {
      camelapp
        .post('/social/login', {
          socialToken: data?.access_token,
          userId: data?.user_id,
        })
        .then(res => {
          console.log(res, 'resposr');
          this.props.navigation?.navigate('CreateProfile', {
            screen: 'socialLogin',
          });
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
  componentDidMount = () => {
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
  signInWithTwitter = async () => {
    console.log('heyyyy');
    // try {
    //   // Log in with Twitter and get tokens
    //   const {authToken, authTokenSecret, email} = await RNTwitterSignIn.logIn();
    //   console.log(authToken, authTokenSecret, email);
    //   if (!email) {
    //     console.log('Email is missing. Prompt the user to enter their email.');
    //     return;
    //   }

    //   // Create a Twitter credential with the tokens
    //   const twitterCredential = auth.TwitterAuthProvider.credential(
    //     authToken,
    //     authTokenSecret,
    //   );
    //   console.log(twitterCredential, 'twitterCredential');

    //   // Sign in the user with the Twitter credential
    //   const userCredential = await auth().signInWithCredential(
    //     twitterCredential,
    //   );

    //   console.log('User signed in:', userCredential.user);
    // } catch (error) {
    //   let err= error
    //   console.error('Error signing in with Twitter and Firebase:', error);
    // }
    // Log in with Twitter and get tokens
    // RNTwitterSignIn.init(
    //   'b2O6ZYjbTBfD6If5Sk9WQY9N0',
    //   'CSMNevPnxKSPXOj4GE8Zdr0fGMyt1PwX8gwK0ML1V5GLKFTGzK',
    // );
    // RNTwitterSignIn.logIn()
    //   .then(loginData => {
    //     console.log(loginData);
    //     const {authToken, authTokenSecret} = loginData;
    //     console.log(authToken, 'authToken', authTokenSecret);
    //     if (authToken && authTokenSecret) {
    //     }
    //   })
    //   .catch(error => {
    //     try {
    //       const message = error?.message;
    //       const startIndex = message.indexOf('{"email":');
    //       const endIndex = message.lastIndexOf('"}');
    //       if (startIndex !== -1 && endIndex !== -1) {
    //         const innerJsonString = message.slice(startIndex, endIndex + 2); // Include the closing double quote and curly brace
    //         try {
    //           const data = JSON.parse(innerJsonString);
    //           const {
    //             email,
    //             userName,
    //             userID,
    //             name,
    //             authToken,
    //             authTokenSecret,
    //           } = data;
    //           const twitterCredential = auth.TwitterAuthProvider.credential(
    //             authToken,
    //             authTokenSecret,
    //           );
    //           const userCredential =
    //             auth().signInWithCredential(twitterCredential);
    //           console.log(userCredential, 'Name:123', twitterCredential);
    //         } catch (e) {
    //           console.error('Error parsing inner data:', e);
    //         }
    //       } else {
    //         console.error('Data not found in the string');
    //       }
    //     } catch {}
    //   });
    // try {
    //   RNTwitterSignIn.init(
    //     'WW08tCdnwdVjaEwHkRUJsKyXK',
    //     'QJKZDX6neisbF6pKB3rNuL1CkYoIPRErRDJX5mcXa4Sg0bK0KU',
    //   );
    //   const loginData = await RNTwitterSignIn.logIn();
    //   const {authToken, authTokenSecret} = loginData;
    //   console.log(authToken, 'authToken', authTokenSecret);
    //   if (authToken && authTokenSecret) {
    //   }
    // } catch (error) {
    //   try {
    //     const message = error?.message;
    //     console.log(error, 'error');
    //     const startIndex = message.indexOf('{"email":');
    //     const endIndex = message.lastIndexOf('"}');
    //     console.log(startIndex, endIndex);
    //     if (startIndex !== -1 && endIndex !== -1) {
    //       const innerJsonString = message.slice(startIndex, endIndex + 2); // Include the closing double quote and curly brace
    //       console.log(innerJsonString);
    //       try {
    //         const data = JSON.parse(innerJsonString);
    //         const {email, userName, userID, name, authToken, authTokenSecret} =
    //           data;
    //         // Create a Twitter credential with the tokens
    //         let twitterCredential = await auth.TwitterAuthProvider.credential(
    //           authToken,
    //           authTokenSecret,
    //         );
    //         twitterCredential.email = 'developer.a2zcreatorz@gmail.com';
    //         console.log(twitterCredential, 'twitterCredential');
    //         // Sign-in the user with the credential
    //         const results = await auth().signInWithCredential(
    //           twitterCredential,
    //         );
    //         console.log(results, 'Name:123');
    //       } catch (e) {
    //         console.error('Error parsing inner data:', e);
    //       }
    //     } else {
    //       console.error('Data not found in the string');
    //     }
    //   } catch (err) {
    //     console.log('errr', err);
    //   }
    // }

    const API_KEY = 'WW08tCdnwdVjaEwHkRUJsKyXK';
    const API_SECRET_KEY = 'CSMNevPnxKSPXOj4GE8Zdr0fGMyt1PwX8gwK0ML1V5GLKFTGzK';
    const credentials = `${API_KEY}:${API_SECRET_KEY}`;
    console.log(credentials);
    const base64Credentials = base64Encode(credentials);
    console.log(base64Credentials,"credentials");
    fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: 'grant_type=client_credentials',
    })
      .then(response => response.json())
      .then(data => {
        const bearerToken = data.access_token;
        console.log(data, 'bearerToken', bearerToken);
        // Use the bearer token for API requests
      })
      .catch(error => {
        console.error('Error obtaining bearer token:', error);
      });
  };
  onClear = () => {
    CookieManager.clearAll(true).then(res => {
      console.log(res, 'responsee');
    });
  };

  render() {
    const authentication = async () => {
      this.setState({loader: true});
      await getFCMToken();
      const deviceToken = await AsyncStorage?.getItem('fcmToken');
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
              phone: this.state.contactNumber,
              password: this.state.password,
              device_type: Platform?.OS,
              device_token: deviceToken,
            })
            .then(res => {
              response = res.data;
              if (response.status == true) {
                this.setState({loader: false});
                let {actions} = this.props;
                actions.userData(response);
                this.saveData();
                this.userlogin();
                this.props.navigation.navigate('Home');
              } else {
                Toast.show({
                  text1: response?.error + '',
                  type: 'error',
                  visibilityTime: 3000,
                });
                // alert(response?.error);
                // alert(response.error + '');
                this.setState({loader: false});
              }
            })
            .catch(error => {});
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
      } else {
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
      <View style={Styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: '#fff'}}>
          <Image
            source={require('../../assets/logo-camel.png')}
            style={{
              height: 90,
              width: 90,
              marginTop: 60,
              alignSelf: 'center',
            }}></Image>

          <Text style={Styles.text}>{ArabicText.login}</Text>
          <View style={Styles.card}>
            <TextInput
              // placeholder="05xxxxxxxx"

              style={Styles.inputs}
              keyboardType="numeric"
              placeholder={ArabicText.phone}
              maxLength={11}
              placeholderTextColor="#000000"
              onChangeText={text =>
                this.setState({contactNumber: text.replace(/[^0-9]/g, '')})
              }></TextInput>

            <Text style={{color: 'red', marginRight: 200}}>
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
                style={{textAlign: 'right', color: 'black'}}
                placeholder={ArabicText.passwords}
                secureTextEntry={this.state.hidePassword}
                placeholderTextColor="#000000"
                onChangeText={text => this.setState({password: text})}
              />
            </View>

            <Text style={{color: 'red', marginRight: 160}}>
              {this.state.passwordError}
            </Text>

            <TouchableOpacity
              style={{alignSelf: 'flex-end', marginRight: 15}}
              onPress={() => this.props.navigation.navigate('Forgetpass')}>
              <Text
                style={{color: '#d2691e', fontWeight: 'bold', fontSize: 14}}>
                {ArabicText.forget_Password}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{alignSelf: 'flex-end', marginRight: 15, marginTop: 20}}
              onPress={() => this.props.navigation.navigate('Signup')}>
              <Text
                style={{color: '#d2691e', fontWeight: 'bold', fontSize: 14}}>
                {ArabicText.Create_an_account}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
            <TouchableOpacity
              onPress={() => {
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

              <Text style={{margin: 5, color: '#d2691e'}}>إنستغرام</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.signInWithTwitter();
              }}
              style={{flexDirection: 'row'}}>
              <Feather
                name="twitter"
                size={24}
                color="#d2691e"
                style={{margin: 5}}
              />

              <Text style={{margin: 5, color: '#d2691e'}}>تويتر</Text>
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
                }}></View>

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
          appId="1337858990436785"
          appSecret="7515c4a451f66cc42943205054700db2"
          redirectUrl="https://com.alsyahd.camel/redirect"
          incognito={false}
          // scopes={['user_profile', 'user_media']}
          scopes={['user_profile', 'user_email']}
          onLoginSuccess={this.setIgToken}
          onLoginFailure={data => console.log(data)}
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
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  textInputContainer: {
    marginBottom: 20,
    padding: 10,
    // alignSelf:"center"
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
    //top: hight / 1.25,
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
