import React, {Component} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {requestUserPermission} from '../services/Helper';
import {auth} from '@react-native-firebase/auth';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
RNTwitterSignIn.init(
  'WzSvycGgEkZsznUOoqi18XUBP',
  '0cfvEIxQgytLEL5TS5y1Ys8uNvHHpoMiIWZSbxDF8xKKolb2Iq',
).then(res => console.log(res, 'Twitter SDK initialized'));
// RNTwitterSignIn.init({
//   apiKey: 'gvjMAUvs5tp11k4tZhT9TU7bm',
//   apiSecret: '21PtUlWScusODhTFTc0xkOdfJHZd0Er4LUKJyNW0xnwLcNOowO',
//   // redirectURI: 'https://camelapplication-f93a0.firebaseapp.com/__/auth/handler',
// });
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
    };
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
      alert(e);
    }
  };

  openIstagram() {
    const url = 'https://instagram.com/alsyahd?igshid=YmMyMTA2M2Y=';
    Linking.openURL(url)
      .then(data => {})
      .catch(() => {
        alert('Something went wrong');
      });
  }
  tweetNow = async () => {
    // RNTwitterSignIn.logOut()
    console.log('Before RNTwitterSignIn.logIn');
    try {
      // Perform the login request
      const {authToken, authTokenSecret} = await RNTwitterSignIn.logIn();
      console.log(authToken, authTokenSecret);

      // Create a Twitter credential with the tokens
      if (authToken && authTokenSecret) {
        console.log('1', auth);
        const twitterCredential = await auth.TwitterAuthProvider.credential(
          authToken,
          authTokenSecret,
        );
        console.log(twitterCredential, 'twitterCredential');
        // const dddd = await auth().currentUser.linkWithCredential(twitterCredential);
        // console.log(twitterCredential, dddd, 'twitterCredential');
        // // Sign-in the user with the credential
        // // return auth().signInWithCredential(dddd);
        // return dddd
      }
    } catch (error) {
      const userDetails = error.NativeMap;
      console.log('ERROR', e);
    }
  };
  tweetNows() {
    const url = 'https://twitter.com/Alsyahdapp';
    Linking.openURL(url)
      .then(data => {
        // alert('Twitter Opened');
      })
      .catch(() => {
        alert('Something went wrong');
      });
  }
  componentDidMount = () => {
    requestUserPermission();
  };
  render() {
    const authentication = async () => {
      const deviceToken = await AsyncStorage?.getItem('fcmToken');
      console.log(deviceToken);
      this.setState({loader: true});
      this.setState({loader: true});
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
              console.log(response, 'responselogin');

              if (response.status == true) {
                this.setState({loader: false});
                let {actions} = this.props;
                actions.userData(response);
                this.saveData();
                this.userlogin();
                console.log('loginmnnn');
                this.props.navigation.navigate('Home');
              } else {
                alert(response.error + '');

                this.setState({loader: false});
              }
            })
            .catch(error => {});
        } catch (error) {
          //console.log("Error Message--- signin", error);
        }
      } else {
        this.setState({loader: false});

        alert(ArabicText.Please_complete_the_fields + '');
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
              onPress={this.openIstagram}
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
              onPress={this.tweetNow}
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
