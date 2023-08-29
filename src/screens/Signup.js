import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';

import { Styles } from '../styles/globlestyle';

import camelapp from '../api/camelapp';
import * as ArabicText from '../language/EnglishToArabic';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';
import { SafeAreaView } from 'react-native-safe-area-context';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import { bindActionCreators } from 'redux';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      hidePassword: true,
      hideConfirmPassword: true,

    };
  }

  // createAnAccount = async signUpUser => {


  //   if (
  //     this.state.name.length >= 3 &&
  //     this.state.phone.length >= 9 &&
  //     this.state.password.length >= 5
  //   ) {
  //     //console.log('state', this.state);

  //     if (this.state.password === this.state.confirm_password) {
  //       this.setState({ btnPressed: true, loader: true })
  //       camelapp
  //         .get('checkemail?phone=' + this.state.phone)
  //         .then(response => {
  //           //console.log('response check phone', response.data);

  //           let number = 0;

  //           do {
  //             number = Math.floor(Math.random() * 10000) + 1;
  //             //console.log('number', number);
  //           } while (number < 1000 || number > 10000);
  //           this.setState({ randomIndex: number });
  //           if (response.data.status === true) {
  //             this.setState({ loader: false });
  //             camelapp
  //               .post('sendsms', {
  //                 phone: this.state.phone,
  //                 message: number,
  //               })
  //               .then(response => {
  //                 if (response.data.status === true) {
  //                   let tempSignUpObj = {
  //                     name: this.state.name,
  //                     phone: this.state.phone,
  //                     password: this.state.password,
  //                     confirm_password: this.state.confirm_password,
  //                   };
  //                   this.props.navigation.navigate('OtpSignUp', {
  //                     code: number,
  //                     sign_up: tempSignUpObj,
  //                   });
  //                   this.setState({ loader: false });
  //                 }
  //               })
  //               .catch(error => {
  //                 //console.log('error', error);
  //               });
  //           }
  //         })
  //         .catch(error => {
  //           //console.log('error', error);
  //         });
  //     } else {
  //       setTimeout(() => {
  //         this.setState({ loader: false });
  //         alert('Password does not match!');
  //       }, 1000);
  //     }
  //   } else {
  //     // //console.log("error", this.state)
  //     setTimeout(() => {
  //       this.setState({ loader: false });
  //       alert('Please Complete fields!');
  //     }, 1000);
  //   }
  // };

  createAnAccount = async signUpUser => {

    let {
      name,
      phone,
      password,
      confirm_password,
      flagname,
      flagphone,
      flagpassword,
      flag_confirm_password,

    } = this.state;


    // check name
    if (name.length >= 3) {
      this.setState({
        flagname: false,

      })
      flagname = false;
      console.log(" name done", flagname)
    } else {
      this.setState({
        flagname: true,
      })
      flagname = true
      console.log(" name  not done", flagname)
    }

    // check phone mumber
    if (phone.length >= 3) {
      this.setState({
        flagphone: false,
      })
      flagphone = false
      console.log(" phone done", flagphone)
    } else {
      this.setState({
        flagphone: true,
      })
      flagphone = true
      console.log(" phone not done", flagphone)
    }

    // check password
    if (password.length >= 3 && password.length != 0) {
      this.setState({
        flagpassword: false,
      })
      flagpassword = false
      console.log(" paswword done", flagpassword)
    } else {
      this.setState({
        flagpassword: true,
      })
      flagpassword = true
      console.log(" password not done", flagpassword)
    }

    // check password
    if (password === confirm_password && confirm_password.length != 0) {
      this.setState({
        flag_confirm_password: false,
      })
      flag_confirm_password = false
      console.log(" confirm paswword done", flag_confirm_password)
    } else {
      this.setState({
        flag_confirm_password: true,
      })
      flag_confirm_password = true
      console.log("  confirm paswword not done", flag_confirm_password)
    }

    if (
      flagname == false &&
      flagphone == false &&
      flagpassword == false &&
      flag_confirm_password == false
    ) {
      console.log('state', this.state);
      this.setState({ btnPressed: true, loader: true })
      camelapp
        .get('checkemail?phone=' + this.state.phone)
        .then(response => {
          console.log('response check phone', response.data);

          let number = 0;

          do {
            number = Math.floor(Math.random() * 10000) + 1;
            console.log('number', number);
          } while (number < 1000 || number > 10000);
          this.setState({ randomIndex: number });
          if (response.data.status === true) {
            this.setState({ loader: false });
            camelapp
              .post('sendsms', {
                phone: this.state.phone,
                message: number,
              })
              .then(response => {
                if (response.data.status === true) {
                  let tempSignUpObj = {
                    name: this.state.name,
                    phone: this.state.phone,
                    password: this.state.password,
                    confirm_password: this.state.confirm_password,
                  };
                  this.props.navigation.navigate('OtpSignUp', {
                    code: number,
                    sign_up: tempSignUpObj,
                  });
                  this.setState({ loader: false, btnPressed: false });
                }
              })
              .catch(error => {
                console.log('error', error);
                this.setState({ loader: false, btnPressed: false });
              });
          } else {
            alert(response?.data?.message)
      this.setState({ btnPressed: false, loader: false })

          }
        })
        .catch(error => {
          console.log('error', error);
          this.setState({ loader: false, btnPressed: false });
        });

    } else {

      // //console.log("error", this.state)

      this.setState({ loader: false, btnPressed: false });
      alert('Please Complete fields!');

    }
  };

  render() {
    let {
      name,
      phone,
      password,
      confirm_password,
      flagname,
      flagphone,
      flagpassword,
      flag_confirm_password,

    } = this.state;
    return (
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
            style={Styles.inputs}
            placeholder={ArabicText.Name}
            placeholderTextColor="#000000"
            onChangeText={text => this.setState({ name: text })}></TextInput>
          {flagname == true && <Text
            style={{
              color: "crimson",
              fontSize: 12,
              textAlign: "right",

            }}
          >يجب أن يحتوي الاسم على 3 أحرف على الأقل</Text>}

          <TextInput
            style={Styles.inputs}
            placeholder={ArabicText.phone}
            keyboardType="numeric"
            maxLength={11}
            placeholderTextColor="#000000"
            onChangeText={text => this.setState({ phone: text })}></TextInput>
          {flagphone == true && <Text
            style={{
              color: "crimson",
              fontSize: 12,
              textAlign: "right",
            }}>
            يجب أن يحتوي رقم الهاتف على أرقام فقط</Text>}

          <View style={[Styles.inputs, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>

            {this.state.hidePassword === true ? <Ionicons name='eye' size={18} color="brown"
              onPress={() => this.setState({ hidePassword: false })}
            /> :
              <Ionicons name='eye-off' size={18} color="brown"
                onPress={() => this.setState({ hidePassword: true })}
              />}

            <TextInput
              style={{ textAlign: "right", color: "black" }}
              placeholderTextColor="#000000"
              placeholder={ArabicText.passwords}
              onChangeText={text => this.setState({ password: text })}
              secureTextEntry={this.state.hidePassword} />
          </View>

          {flagpassword == true && <Text
            style={{
              color: "crimson",
              fontSize: 12,
              textAlign: "right",
            }}
          >يجب أن يحتوي الاسم على 4 أحرف على الأقل</Text>}

          <View style={[Styles.inputs, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>

            {this.state.hideConfirmPassword === true ? <Ionicons name='eye' size={18} color="brown"
              onPress={() => this.setState({ hideConfirmPassword: false })}
            /> :
              <Ionicons name='eye-off' size={18} color="brown"
                onPress={() => this.setState({ hideConfirmPassword: true })}
              />}

            <TextInput
              style={{ textAlign: "right", color: "black" }}
              placeholderTextColor="#000000"
              placeholder={ArabicText.confirm_password}
              onChangeText={text => this.setState({ confirm_password: text })}
              secureTextEntry={this.state.hideConfirmPassword} />
          </View>

          {flag_confirm_password == true && <Text
            style={{
              color: "crimson",
              fontSize: 12,
              textAlign: "right",

            }}
          >يجب أن يحتوي الاسم على 4 أحرف على الأقل</Text>}


        </View>

        <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
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
              console.log("Waiting For Response")
            }


          }}
          style={{ alignSelf: 'center', margin: 10 }}>
          <View style={[Styles.btn, {
            backgroundColor: this.state.loader == false ? '#8b4513' : "#cccbca",

          }]}>
            {this.state.loader &&
              <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} />
            }
            {this.state.loader == false &&
              <Text style={Styles.textbtn}
              >{ArabicText.signUp}</Text>
            }

          </View>
        </TouchableOpacity>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}>
          {this.state.otp === true && (
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
                {/* <Text style={{ fontSize: 25, textAlign: "center", fontWeight: "700", color: "black" }}>Enter OTP</Text> */}
                <OTPTextView
                  ref={e => (this.input1 = e)}
                  handleTextChange={e => {
                    if (parseInt(e) == this.state.randomIndex) {
                      // setTimeout(() => {
                      this.setState({ otp: false, loader: true });

                      setTimeout(() => {
                        this.setState({ checked: true, loader: false });

                        setTimeout(() => {
                          this.setState({ checked: false, modalVisible: false });
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
