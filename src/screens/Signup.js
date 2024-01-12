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
  Linking,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import camelapp from '../api/camelapp';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';
const width = Dimensions.get('screen').width;

import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Checkbox} from 'react-native-paper';
import {Platform} from 'react-native';
import {ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFCMToken} from '../services/Helper';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      name: '',
      phone: '',
      btnPressed: false,
      password: '',
      confirm_password: '',
      modalVisible: false,
      loader: false,
      openloader: false,
      checked: false,
      otp: false,
      randomIndex: 0,
      flagname: false,
      flagphone: false,
      flagpassword: false,
      flag_confirm_password: false,
      flag_termsCondition: false,

      hidePassword: true,
      hideConfirmPassword: true,
    };
  }

  createAnAccount = async signUpUser => {
    let {
      name,
      phone,
      password,
      confirm_password,
      flag_confirm_password,
      isChecked,
    } = this.state;

    // check name
    if (name.length >= 4) {
      this.setState({
        flagname: false,
      });
      flagname = false;
    } else {
      this.setState({
        flagname: true,
      });
      flagname = true;
    }
    // check phone mumber
    if (phone.length == 10) {
      this.setState({
        flagphone: false,
      });
      flagphone = false;
    } else {
      this.setState({
        flagphone: true,
      });
      flagphone = true;
    }
    // check password
    if (password.length >= 6 && password.length != 0) {
      this.setState({
        flagpassword: false,
      });
    } else {
      this.setState({
        flagpassword: true,
      });
    }
    // check password
    if (password === confirm_password && confirm_password.length != 0) {
      this.setState({
        flag_confirm_password: false,
      });
      flag_confirm_password = false;
    } else {
      this.setState({
        flag_confirm_password: true,
      });
      flag_confirm_password = true;
    }
    //tersm cibdtiion
    if (this.state?.isChecked == true) {
      this.setState({
        flag_termsCondition: true,
      });
    } else {
      this.setState({
        flag_termsCondition: false,
      });
    }
    if (
      name?.length >= 4 &&
      phone?.length == 10 &&
      confirm_password &&
      password &&
      password == confirm_password &&
      isChecked == true
    ) {
      this.setState({btnPressed: true, loader: true});
      await getFCMToken();
      const deviceToken = await AsyncStorage?.getItem('fcmToken');
      camelapp
        .get('checkemail?phone=' + this.state.phone)
        .then(response => {
          if (response.data?.message != 'Phone Already exists!') {
            camelapp
              .post('sendsms', {
                phone: this.state.phone,
              })
              .then(res => {
                console.log(res, 'responseee');
                this.setState({loader: false});
                if (res) {
                  let tempSignUpObj = {
                    name: this.state.name,
                    phone: this.state.phone,
                    password: this.state.password,
                    confirm_password: this.state.confirm_password,
                    device_token: deviceToken,
                    device_type: Platform?.OS,
                  };
                  Toast.show({
                    text1: ArabicText?.otphasbeensenttoyourphonenumber,
                    type: 'success',
                    visibilityTime: 3000,
                  });
                  this.props.navigation.navigate('OtpSignUp', {
                    sign_up: tempSignUpObj,
                  });
                  this.setState({loader: false, btnPressed: false});
                }
              })
              .catch(error => {
                console.log('error', error);
                this.setState({loader: false, btnPressed: false});
              });
          } else {
            Toast.show({
              text1: response?.data?.message,
              type: 'error',
              visibilityTime: 3000,
            });
            this.setState({btnPressed: false, loader: false});
          }
        })
        .catch(error => {
          console.log(error, 'errorrrr');
          Toast.show({
            text1: ArabicText?.phoneNumberAlreadyExist,
            type: 'error',
            visibilityTime: 3000,
          });
          this.setState({loader: false, btnPressed: false});
        });
    } else {
      this.setState({loader: false, btnPressed: false});
      if (name && phone && confirm_password && password && !isChecked) {
        Toast.show({
          text1: 'الرجاء تحديد الشروط والأحكام',
          type: 'error',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          text1: ArabicText?.PleaseCompleteThefields,
          type: 'error',
          visibilityTime: 3000,
        });
      }
    }
  };

  render() {
    let {flagname, flagphone, flagpassword, flag_confirm_password} = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: 10, backgroundColor: '#fff'}}>
        <View style={Styles.container}>
          <Text style={Styles.text}>إنشاء حساب</Text>
          <Image
            source={require('../../assets/logo-camel.png')}
            style={{
              height: 90,
              width: 90,
              alignSelf: 'center',
              margin: 15,
            }}></Image>

          <View style={Styles.cardsignup}>
            <TextInput
              maxLength={30}
              value={this.state.name}
              style={Styles.inputs}
              placeholder={ArabicText.Name}
              placeholderTextColor="#000000"
              onChangeText={text => {
                const isArabic = Array.from(text).every(char =>
                  /^[\u0600-\u06FF\s]+$/.test(char),
                );
                if (isArabic) {
                  this.setState({name: text});
                }
              }}></TextInput>
            {flagname == true && (
              <Text
                style={{
                  color: 'crimson',
                  fontSize: 12,
                  textAlign: 'right',
                }}>
                {ArabicText?.Thenamemustcontainatleast3letters}
              </Text>
            )}

            <TextInput
              style={Styles.inputs}
              placeholder={ArabicText.phone}
              keyboardType="numeric"
              maxLength={10}
              placeholderTextColor="#000000"
              onChangeText={text =>
                this.setState({phone: text.replace(/[^0-9]/g, '')})
              }></TextInput>
            {flagphone == true && (
              <Text
                style={{
                  color: 'crimson',
                  fontSize: 12,
                  textAlign: 'right',
                }}>
                {ArabicText?.Thephonenumbermustonlyhavenumbers}
              </Text>
            )}

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
                placeholderTextColor="#000000"
                placeholder={ArabicText.passwords}
                onChangeText={text => this.setState({password: text})}
                secureTextEntry={this.state.hidePassword}
              />
            </View>

            {flagpassword == true && (
              <Text
                style={{
                  color: 'crimson',
                  fontSize: 12,
                  textAlign: 'right',
                }}>
                {ArabicText?.Thenamemustcontainatleast6letters}
              </Text>
            )}

            <View
              style={[
                Styles.inputs,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              {this.state.hideConfirmPassword === true ? (
                <Ionicons
                  name="eye"
                  size={18}
                  color="brown"
                  onPress={() => this.setState({hideConfirmPassword: false})}
                />
              ) : (
                <Ionicons
                  name="eye-off"
                  size={18}
                  color="brown"
                  onPress={() => this.setState({hideConfirmPassword: true})}
                />
              )}

              <TextInput
                style={{textAlign: 'right', color: 'black'}}
                placeholderTextColor="#000000"
                placeholder={ArabicText.confirm_password}
                onChangeText={text => this.setState({confirm_password: text})}
                secureTextEntry={this.state.hideConfirmPassword}
              />
            </View>

            {flag_confirm_password == true && (
              <Text
                style={{
                  color: 'crimson',
                  fontSize: 12,
                  textAlign: 'right',
                }}>
                {ArabicText?.Thenamemustcontainatleast6letters}
              </Text>
            )}
          </View>

          <TouchableOpacity style={{alignSelf: 'flex-end'}}>
            <Text
              style={{
                color: '#d2691e',
                fontSize: 12,
                margin: 5,
                marginRight: 25,
              }}
              onPress={() => this.props.navigation.navigate('Login')}>
              {ArabicText.Already_an_account}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (this.state.btnPressed != true) {
                this.createAnAccount();
              } else {
                console.log('Waiting For Response');
              }
            }}
            style={{alignSelf: 'center', margin: 10}}>
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
                <Text style={Styles.textbtn}>{ArabicText.signUp}</Text>
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontSize: 14}}>
              {ArabicText?.Iagreetothetermsandconditions}
            </Text>
            <Checkbox
              color="#D2691Eff"
              onPress={() => this.setState({isChecked: !this.state?.isChecked})}
              status={this.state?.isChecked ? 'checked' : 'unchecked'}
            />
          </View>
          <TouchableOpacity
            style={{marginBottom: 10}}
            onPress={() => Linking.openURL('https://www.google.com')}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: '#D2691Eff',
                fontSize: 14,
              }}>
              {ArabicText?.Learnmoreabouttermsandconditions}
            </Text>
          </TouchableOpacity>
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
                            this.setState({
                              checked: false,
                              modalVisible: false,
                            });
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

            {/* {this.state.checked === true && (
            <View style={{ flex: 1 }}>
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
                <LottieView
                  source={require('../../assets/animations/checked.json')}
                  autoPlay
                  loop
                />
              </View>
            </View>
          )} */}
            {/* {this.state.loader === true && (
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
                <LottieView
                  source={require('../../assets/animations/loader.json')}
                  autoPlay
                  loop
                />
              </View>
            </View>
          )} */}

            {/* {this.state.openloader == true && (
            <View
              style={[
                styles.modalView,
                {
                  bottom: 0,
                },
              ]}>
              <LottieView
                source={require('../../assets/animations/loader.json')}
                autoPlay
                loop
              />
            </View>
          )} */}
          </Modal>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
