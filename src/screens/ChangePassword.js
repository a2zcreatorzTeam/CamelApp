import React from 'react';
import {Component} from 'react';
import {View, Text, Platform} from 'react-native';
import {connect} from 'react-redux';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ArabicText from '../language/EnglishToArabic';
import {TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {TextInput} from 'react-native';
import BackBtnHeader from '../components/headerWithBackBtn';
import Toast from 'react-native-toast-message';
import camelapp from '../api/camelapp';
import { family } from '../constants/Family';

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      hidePassword: true,
      hidePassword2: true,
      hidePassword3: true,
      loader: false,
      currentPassword: '',
      password: '',
      confirm_password: '',
    };
  }
  render() {
    const {currentPassword, password, confirm_password} = this.state;
    let user = this.props.user;
    user = user?.user?.user;
    console.log(user?.id, currentPassword, password, confirm_password);
    submit = async () => {
      if (currentPassword == '') {
        Toast.show({
          text1: ArabicText?.CurrentPasswordfieldcantbeempty,
          type: 'error',
          visibilityTime: 3000,
        });
      } else if (password == '') {
        Toast.show({
          text1: ArabicText?.NewPasswordfieldcantbeempty,
          type: 'error',
          visibilityTime: 3000,
        });
      } else if (password?.length < 6) {
        Toast.show({
          text1: ArabicText?.passwordmustbe6charcterslong,
          type: 'error',
          visibilityTime: 3000,
        });
      } else if (currentPassword == password)
        return Toast.show({
          text1: ArabicText?.CurrentpasswordandNewpasswordcantbesame,
          type: 'error',
          visibilityTime: 3000,
        });
      else if (confirm_password == '') {
        Toast.show({
          text1: ArabicText?.NewConfirmPasswordfieldcantbeempty,
          type: 'error',
          visibilityTime: 3000,
        });
      } else if (password != confirm_password) {
        Toast.show({
          text1: ArabicText?.NewPasswordandConfirmPasswordmustbesame,
          type: 'error',
          visibilityTime: 3000,
        });
      } else {
        this.setState({
          loader: true,
        });
        await camelapp
          .post('/change/password', {
            userid: user?.id,
            currentpaswd: currentPassword,
            newpswd: password,
            confirmpswd: confirm_password,
          })
          .then(res => {
            if (res?.data?.status == false) {
              this.setState({
                loader: false,
              });
              Toast.show({
                text1: res?.data?.message,
                type: 'error',
                visibilityTime: 3000,
              });
            } else {
              this.setState({
                loader: false,
              });
              Toast.show({
                text1: ArabicText?.passwordsuccessfullychanged,
                type: 'success',
                visibilityTime: 3000,
              });
              this.props.navigation.navigate('Profile');
            }
          })
          .catch(error => {
            console.log(error, 'errorrr');
            this.setState({
              loader: false,
            });
            Toast.show({
              text1: error?.message,
              type: 'error',
              visibilityTime: 3000,
            });
          });
      }
    };
    return (
      <View style={Styles.container}>
        <BackBtnHeader />
        <View style={{marginTop: 20, flex: 1}}>
          <Text
            style={{
              color: 'grey',
              textAlign: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: '600',
              marginBottom: 20,
               fontFamily: Platform.OS == 'ios' ? null: family.Neo_Regular
            }}
            numberOfLines={3}>
            {ArabicText?.Changepassword}
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {/* Current password  */}
            <View
              style={[
                Styles.inputs,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              {this.state.hidePassword3 === true ? (
                <Ionicons
                  name="eye"
                  size={18}
                  color="brown"
                  onPress={() => this.setState({hidePassword3: false})}
                />
              ) : (
                <Ionicons
                  name="eye-off"
                  size={18}
                  color="brown"
                  onPress={() => this.setState({hidePassword3: true})}
                />
              )}
              <TextInput
                secureTextEntry={this.state.hidePassword3}
                placeholderTextColor={'grey'}
                style={Styles.inputs}
                placeholder={ArabicText.currentpassword}
                onChangeText={text =>
                  this.setState({currentPassword: text})
                }></TextInput>
            </View>
            {/* NEW PASSWORD  */}
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
            {/* Confirm new password */}
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
                submit();
              } else {
                //console.log("Waiting For Response")
              }
            }}
            style={{alignSelf: 'center', margin: 10, marginTop: 'auto'}}>
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
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(ChangePassword);
