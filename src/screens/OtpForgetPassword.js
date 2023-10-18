import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import Toast from 'react-native-toast-message';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '',
      two: '',
      three: '',
      four: '',
      btnPressed: false,
      oneFocus: false,
      twoFocus: false,
      threeFocus: false,
      fourFocus: false,
      number: props?.route?.params?.code,
      hidePassword: true,
      hidePassword2: true,
      loader: false,
      password: '',
      confirm_password: '',
      phone: props.route.params.phone,
      optButtonController: true,
    };

    this.first = React.createRef();
    this.second = React.createRef();
    this.third = React.createRef();
    this.fourth = React.createRef();
  }

  componentDidMount() {
    this.first.current.focus();
  }

  handleChangeTextOne = text => {
    this.setState({one: text}, () => {
      if (this.state.one) this.second.current.focus();
    });
  };
  handleChangeTextTwo = text => {
    this.setState({two: text}, () => {
      if (this.state.two) this.third.current.focus();
    });
  };
  handleChangeTextThree = text => {
    this.setState({three: text}, () => {
      if (this.state.three) this.fourth.current.focus();
    });
  };
  handleChangeTextFour = text => {
    this.setState({four: text});
  };

  backspace = id => {
    if (id === 'two') {
      if (this.state.two) {
        this.setState({two: ''});
      } else if (this.state.one) {
        this.setState({one: ''});
        this.first.current.focus();
      }
    } else if (id === 'three') {
      if (this.state.three) {
        this.setState({three: ''});
      } else if (this.state.two) {
        this.setState({two: ''});
        this.second.current.focus();
      }
    } else if (id === 'four') {
      if (this.state.four) {
        this.setState({four: ''});
      } else if (this.state.three) {
        this.setState({three: ''});
        this.third.current.focus();
      }
    }
  };

  checkOtp() {
    this.setState({loader: true});
    let number =
      this.state.one + this.state.two + this.state.three + this.state.four;

    if (parseInt(this.state.number) == parseInt(number)) {
      setTimeout(() => {
        this.first.current.focus();

        this.setState({
          loader: false,
          optButtonController: false,
          four: '',
          one: '',
          two: '',
          three: '',
        });
      }, 2000);
    } else {
      setTimeout(() => {
        this.first.current.focus();

        this.setState({four: '', loader: false, one: '', two: '', three: ''});
        Toast.show({
          text1: ArabicText?.InvalidOTP,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Invalid OTP!');
      }, 1000);
    }
  }
  submitOTP(signUpUser) {
    this.setState({loader: true});
    let number =
      this.state.one + this.state.two + this.state.three + this.state.four;
    if (this.state.password.length > 5) {
      if (this.state.password === this.state.confirm_password) {
        camelapp
          .post('password/reset', {
            phone: this.state.phone,
            password: this.state.password,
          })
          .then(response => {
            if (response.data.status === true) {
              Toast.show({
                text1: response?.data?.message,
                type: 'error',
                visibilityTime: 3000,
              });
              // alert(response?.data?.message);
              setTimeout(() => {
                this.props.navigation.navigate('Login');
              }, 1000);
            }
          })
          .catch(error => {
            //console.log("error", error)
          });
      } else {
        Toast.show({
          text1: ArabicText?.Passworddoesnotmatch,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Password does not match');
        this.setState({loader: false});
      }
    } else {
      Toast.show({
        text1: ArabicText?.Passwordmustcontains6characters,
        type: 'error',
        visibilityTime: 3000,
      });
      // alert('Password must contains 6 characters');
      this.setState({loader: false});
    }
  }

  render() {
    console.log('====================================');
    console.log(this.state.number);
    console.log('====================================');
    const {oneFocus, twoFocus, threeFocus} = this.state;
    const oneStyle = {
      borderBottomColor: oneFocus ? 'red' : 'black',
      borderBottomWidth: oneFocus ? 2 : 1,
    };
    const twoStyle = {
      borderBottomColor: twoFocus ? 'red' : 'black',
      borderBottomWidth: twoFocus ? 2 : 1,
    };
    const threeStyle = {
      borderBottomColor: threeFocus ? 'red' : 'black',
      borderBottomWidth: threeFocus ? 2 : 1,
    };
    const fourStyle = {
      borderBottomColor: threeFocus ? 'red' : 'black',
      borderBottomWidth: threeFocus ? 2 : 1,
    };
    return (
      <View style={styles.container}>
        {/* <Image
            source={require('../../assets/logo-camel.png')}
            style={{ height: 90, width: 90,  alignSelf: 'center' }}/> */}

        {this.state?.optButtonController == true ? (
          <>
            <Text
              style={{
                color: 'grey',
                textAlign: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: '600',
              }}
              numberOfLines={3}>
              Enter the OTP Sent to Your Mobile
            </Text>
            <View style={styles.inputcontainer}>
              <TextInput
                placeholderTextColor={'grey'}
                ref={this.first}
                style={[styles.textInput, {...oneStyle}]}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="number-pad"
                caretHidden
                onFocus={() => this.setState({oneFocus: true})}
                onBlur={() => this.setState({oneFocus: false})}
                maxLength={1}
                onChangeText={text => {
                  this.handleChangeTextOne(text);
                }}
                value={this.state.one}
              />
              <TextInput
                placeholderTextColor={'grey'}
                ref={this.second}
                onKeyPress={({nativeEvent}) =>
                  nativeEvent.key === 'Backspace' ? this.backspace('two') : null
                }
                style={[styles.textInput, {...twoStyle}]}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={1}
                onFocus={() => this.setState({twoFocus: true})}
                onBlur={() => this.setState({twoFocus: false})}
                caretHidden
                keyboardType="number-pad"
                onChangeText={text => {
                  this.handleChangeTextTwo(text);
                }}
                value={this.state.two}
              />
              <TextInput
                placeholderTextColor={'grey'}
                ref={this.third}
                onKeyPress={({nativeEvent}) =>
                  nativeEvent.key === 'Backspace'
                    ? this.backspace('three')
                    : null
                }
                style={[styles.textInput, {...threeStyle}]}
                autoCorrect={false}
                autoCapitalize="none"
                onFocus={() => this.setState({threeFocus: true})}
                onBlur={() => this.setState({threeFocus: false})}
                maxLength={1}
                caretHidden
                keyboardType="number-pad"
                onChangeText={text => {
                  this.handleChangeTextThree(text);
                }}
                value={this.state.three}
              />
              <TextInput
                placeholderTextColor={'grey'}
                ref={this.fourth}
                onKeyPress={({nativeEvent}) =>
                  nativeEvent.key === 'Backspace'
                    ? this.backspace('four')
                    : null
                }
                style={[styles.textInput, {...fourStyle}]}
                autoCorrect={false}
                autoCapitalize="none"
                onFocus={() => this.setState({fourFocus: true})}
                onBlur={() => this.setState({fourFocus: false})}
                maxLength={1}
                caretHidden
                keyboardType="number-pad"
                onChangeText={text => {
                  this.handleChangeTextFour(text);
                }}
                value={this.state.four}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (this.state.btnPressed != true) {
                  this.checkOtp();
                } else {
                  //console.log("Waiting For Response")
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
                  <Text style={Styles.textbtn}>{ArabicText.Confirm}</Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text
              style={{
                color: 'grey',
                textAlign: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: '600',
              }}
              numberOfLines={3}>
              Enter Your New Password
            </Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
                  secureTextEntry={this.state.hidePassword}
                  placeholderTextColor={'grey'}
                  style={Styles.inputs}
                  placeholder={ArabicText.passwords}
                  onChangeText={text =>
                    this.setState({password: text})
                  }></TextInput>
              </View>
              <View
                style={[
                  Styles.inputs,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}>
                {this.state.hidePassword2 === true ? (
                  <Ionicons
                    name="eye"
                    size={18}
                    color="brown"
                    onPress={() => this.setState({hidePassword2: false})}
                  />
                ) : (
                  <Ionicons
                    name="eye-off"
                    size={18}
                    color="brown"
                    onPress={() => this.setState({hidePassword2: true})}
                  />
                )}
                <TextInput
                  placeholderTextColor={'grey'}
                  style={Styles.inputs}
                  placeholder={ArabicText.confirm_password}
                  onChangeText={text => this.setState({confirm_password: text})}
                  secureTextEntry={this.state.hidePassword2}></TextInput>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (this.state.btnPressed != true) {
                  this.submitOTP();
                } else {
                  //console.log("Waiting For Response")
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
                  <Text style={Styles.textbtn}>{ArabicText.Confirm}</Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputcontainer: {
    marginVertical: 25,
    // flexDirection: 'row-reverse',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: '20%',
    marginBottom: '2%',
  },
  textInput: {
    fontSize: 22,
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    width: '12%',
    color: 'black',
  },
});
