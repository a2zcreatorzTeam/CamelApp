import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';

import * as ArabicText from '../language/EnglishToArabic';

import camelapp from '../api/camelapp';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {family} from '../constants/Family';
import BackBtnHeader from '../components/headerWithBackBtn';
const {width} = Dimensions.get('window');
class App extends Component {
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
      number: props.route.params.code,

      sign_up_data: props.route.params.sign_up,
      loader: false,
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
  submitOTP = async () => {
    this.setState({btnPressed: true, loader: true});
    const deviceToken = await AsyncStorage?.getItem('fcmToken');
    let number =
      this.state.one + this.state.two + this.state.three + this.state.four;
    let user_data = this.state.sign_up_data;
    let {screenType} = this.props.route.params?.sign_up;
    if (number != '') {
      camelapp
        .post('/check/otp', {
          otp_code: number,
          phone: user_data?.phone,
        })
        .then(response => {
          console.log(response?.data, 'resp[oonseee');
          if (response?.data?.success == true) {
            {
              screenType == 'update'
                ? camelapp
                    .post('/update', {
                      user_id: this.props.user?.user?.user.id,
                      phone: user_data?.newphone,
                    })
                    .then(res => {
                      this.setState({btnPressed: false, loader: false});
                      this.props.navigation.goBack();
                    })
                    .catch(error => {
                      console.log(error, 'errorerror');
                    })
                : camelapp
                    .post('/register', {
                      name: user_data.name,
                      phone: user_data.phone,
                      password: user_data.password,
                      device_type: Platform.OS,
                      device_token: deviceToken,
                    })
                    .then(res => {
                      this.setState({btnPressed: false, loader: false});
                      this.props.navigation.navigate('CreateProfile', {
                        response: res?.data,
                      });
                    })
                    .catch(error => {
                      console.log(error, 'errrrrr');
                      this.setState({btnPressed: false, loader: false});
                      Toast.show({
                        text1: response?.data?.message,
                        type: 'error',
                        visibilityTime: 3000,
                      });
                    });
            }
          } else {
            this.setState({btnPressed: false, loader: false});
            Toast.show({
              text1: response?.data?.message,
              type: 'error',
              visibilityTime: 3000,
            });
          }
        })
        .catch(error => {
          console.log(error, 'errorrrr');
          Toast.show({
            text1: ArabicText?.Somethingwentwrong,
            type: 'error',
            visibilityTime: 3000,
          });
          this.setState({btnPressed: false, loader: false});
        });
      // API TO VERFY THE OTP
    } else {
      this.setState({loader: false, btnPressed: false});
      Toast.show({
        text1: ArabicText?.PleaseentertheOTP,
        type: 'error',
        visibilityTime: 3000,
      });
    }
  };

  render() {
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
        <BackBtnHeader />
        <KeyboardAvoidingView
          style={Styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            alwaysBounceVertical={false}
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 10,
              backgroundColor: '#fff',
              paddingBottom: width * 0.2,
              justifyContent: 'center',
            }}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text
                style={{
                  justifyContent: 'center',
                  fontSize: 24,
                  color: 'black',
                  width: '80%',
                  textAlign: 'center',
                  fontFamily: family.Neo_Regular,
                }}
                numberOfLines={3}>
                {ArabicText?.EntertheOTPSenttoYourMobile}
              </Text>
            </View>

            <View style={styles.inputcontainer}>
              <TextInput
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
                value={this.state.five}
              />
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
                  <Text style={Styles.textbtn}>{ArabicText.verification}</Text>
                )}
              </View>
            </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#D2691Eff',
  },
  inputcontainer: {
    marginVertical: 25,
    // height: '5%',
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
    fontFamily: family.Neo_Regular,
  },
});
