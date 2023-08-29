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
} from 'react-native';

import {Styles} from '../styles/globlestyle';

import camelapp from '../api/camelapp';

import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';

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
        console.log("response check phone", response.data)

        let number = 0;

        do {
          number = Math.floor(Math.random() * 10000) + 1;
          //console.log('number', number);
        } while (number < 1000 || number > 10000);

        if (response.data.status === false) {
          this.setState({otp: true, loader: false});
          camelapp
            .post('sendsms', {
              phone: this.state.phone,
              message: number,
            })
            .then(response => {
              if (response.data.status === true) {
                  alert("Opt sent to your Phone Number")
                this.props.navigation.navigate('OtpForgetPassword', {
                  code: number,
                  phone: this.state.phone,
                });
              }
            })
            .catch(error => {
              //console.log("error", error)
            });
        }
      });
    } else {
      alert('Please enter valid phone');
    }
  }
  render() {
    return (
      <View style={Styles.container}>
        <ScrollView>
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

            <Text style={{fontSize: 22, fontWeight: '500'}}>
              {ArabicText.Enter_Phone_Number}
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '300',
                color: 'grey',
                marginTop: 70,
              }}>
              {ArabicText.We_will_send_you_a_code_to_reset}
            </Text>

            <TextInput
              autoFocus={true}
              style={Styles.inputs}
              placeholder={ArabicText.Enter_Phone_Number}
              keyboardType="numeric"
              maxLength={11}
              onChangeText={text => this.setState({phone: text})}></TextInput>

            <TouchableOpacity
              onPress={() => {
                if (this.state.btnPressed != true) {
                  this.sendOTP();
                } else {
                  //console.log("Waiting For Response")
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
  image: {width: 190, height: 190, marginBottom: 10},
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
