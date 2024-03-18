import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import camelapp from '../api/camelapp';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
import Toast from 'react-native-toast-message';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      modalVisible: false,
      loader: false,
      btnPressed: false,
      openloader: false,
      checked: false,
      otp: false,
      randomIndex: 0,
    };
  }

  sendOTP() {
    if (this.state.phone.length > 9) {
      this.setState({btnPressed: true, loader: true});
      camelapp.get('checkemail?phone=' + this.state.phone).then(response => {
        if (response.data?.message == 'الهاتف موجود بالفعل') {
          console.log('response', response?.data);
          this.setState({otp: true});
          camelapp
            .post('/reset/otp', {
              phone: this.state.phone,
            })
            .then(response => {
              this.setState({btnPressed: false, loader: false});
              console.log(response?.data, 'respnesse4888');
              if (response) {
                Toast.show({
                  text1: ArabicText.OTPsenttoyourPhoneNumber,
                  type: 'success',
                  visibilityTime: 3000,
                });
                this.props.navigation.navigate('OtpForgetPassword', {
                  phone: this.state.phone,
                });
              } else {
                Toast.show({
                  text1: response?.data?.message
                    ? response?.data?.message
                    : ArabicText?.Somethingwentwrong,
                  type: 'error',
                  visibilityTime: 3000,
                });
              }
            })
            .catch(error => {
              this.setState({btnPressed: false, loader: false});
              Toast.show({
                text1: ArabicText?.Somethingwentwrong,
                type: 'error',
                visibilityTime: 3000,
              });
              //console.log("error", error)
            });
        } else {
          this.setState({loader: false});
          Toast.show({
            text1: ArabicText.Pleaseentervalidphonenumber,
            type: 'error',
            visibilityTime: 3000,
          });
          // alert('Please enter valid phone');
        }
      });
    } else {
      this.setState({loader: false});
      Toast?.show({
        text1: ArabicText.Pleaseentervalidphonenumber,
        type: 'error',
        visibilityTime: 3000,
      });
      // alert('Please enter valid phone');
    }
  }
  render() {
    return (
      <View style={[Styles.container, {flex: 1, backgroundColor: '#D2691Eff'}]}>
        <KeyboardAvoidingView
          style={Styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={Styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginTop: 40,
                width: width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
              }}>
              <Text style={Styles.text}> {ArabicText.forget_Password}</Text>
              <Image
                source={require('../../assets/password.png')}
                style={styles.image}></Image>

              <Text
                style={{
                  fontSize: 22,
                  fontFamily: family.Neo_Regular,
                }}>
                {ArabicText.Enter_Phone_Number}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: 'grey',
                  marginVertical: 20,
                  fontFamily: family.Neo_Regular,
                }}>
                {ArabicText.We_will_send_you_a_code_to_reset}
              </Text>

              <TextInput
                autoFocus={true}
                style={Styles.inputs}
                placeholder={ArabicText.Enter_Phone_Number}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={text =>
                  this.setState({phone: text.replace(/[^0-9]/g, '')})
                }></TextInput>

              <TouchableOpacity
                style={{marginTop: 20}}
                onPress={() => {
                  if (this.state.loader == false) {
                    this.sendOTP();
                  } else {
                    console.log('Waiting For Response');
                  }
                }}>
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
                    <Text style={Styles.textbtn}>{ArabicText.send}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: 190, height: 190},
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
