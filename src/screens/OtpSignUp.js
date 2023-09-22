import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';

import * as ArabicText from '../language/EnglishToArabic';

import camelapp from '../api/camelapp';
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
  submitOTP() {
    let number =
      this.state.one + this.state.two + this.state.three + this.state.four;

    //console.log('number', number);
    //console.log('sign_up_data', this.state.sign_up_data);

    let user_data = this.state.sign_up_data;

    //console.log('previous number', this.state.number);
    if (number != '') {
      if (parseInt(this.state.number) === parseInt(number)) {
        this.setState({btnPressed: true, loader: true});
        // //console.log("signUpUser", signUpUser)

        camelapp
          .post('/register', {
            name: user_data.name,
            phone: user_data.phone,
            password: user_data.password,
          })
          .then(respo => {
            console.log('respo', respo.data);

            if (respo.data.status === true) {
              camelapp
                .post('/login', {
                  phone: user_data.phone,
                  password: user_data.password,
                })
                .then(res => {
                  let response = res.data;

                  if (response.status == true) {
                    this.setState({loader: false, btnPressed: false});
                    let {actions} = this.props;
                    actions.userData(response);
                    console.log('response', response);
                    this.props.navigation.navigate('Home');
                  } else {
                    alert(response.error + '');
                    this.setState({loader: false});
                  }
                })
                .catch(error => {});
            }
          })
          .catch(error => {
            this.setState({loader: false, btnPressed: false});
            console.log('error', error);
          });
      } else {
        setTimeout(() => {
          this.setState({loader: false, btnPressed: false});
          alert('Invalid OTP!');
        }, 2000);
      }
    } else {
      setTimeout(() => {
        this.setState({loader: false, btnPressed: false});
        alert('Please enter the OTP');
      }, 2000);
    }
  }

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
        <Text
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: 'black',
          }}
          numberOfLines={3}>
          Enter the OTP Sent to Your Mobile
        </Text>

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
              nativeEvent.key === 'Backspace' ? this.backspace('three') : null
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
              nativeEvent.key === 'Backspace' ? this.backspace('four') : null
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
              <Text style={Styles.textbtn}>{ArabicText.Confirm}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* <Text
                            style={{ textAlign: "center", justifyContent: "center", fontSize: 15, textDecorationLine: "underline" }}
                            numberOfLines={3}>Resend</Text> */}
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
  },
});
