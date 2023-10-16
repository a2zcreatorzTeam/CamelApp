import React from 'react';
import {View, TouchableOpacity, Text, Image, Linking} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Dimensions} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';
import * as ArabicText from '../language/EnglishToArabic';
import BackBtnHeader from '../components/headerWithBackBtn';
import Toast from 'react-native-toast-message';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

export default function App() {
  const openWhatsApp = () => {
    let msg = 'Hello';
    let mobile = '6531301053';
    if (mobile) {
      if (msg) {
        let url = 'whatsapp://send?text=' + msg + '&phone=96' + mobile;
        Linking.openURL(url)
          .then(data => {
            //console.log("WhatsApp Opened successfully " + data);
          })
          .catch(() => {
            Toast.show({
              text1: ArabicText?.MakesureWhatsAppinstalledonyourdevice,
              type: 'error',
              visibilityTime: 3000,
            });
          });
      } else {
        Toast.show({
          text1: ArabicText?.Pleaseentermessagetosend,
          type: 'error',
          visibilityTime: 3000,
        });
      }
    } else {
      Toast.show({
        text1: ArabicText.Pleaseentermobileno,
        type: 'error',
        visibilityTime: 3000,
      });
      // alert('Please enter mobile no');
    }
  };
  const openIstagram = () => {
    const url = 'https://instagram.com/alsyahd?igshid=YmMyMTA2M2Y=';
    Linking.openURL(url)
      .then(data => {
        alert('Instagram Opened');
      })
      .catch(() => {
        Toast.show({
          text1: ArabicText?.Somethingwentwrong,
          type: 'error',
          visibilityTime: 3000,
        });
      });
  };
  const tweetNow = () => {
    // let twitterParameters = [];
    // if (twitterShareURL)
    //   twitterParameters.push('url=' + encodeURI(twitterShareURL));
    // if (tweetContent)
    //   twitterParameters.push('text=' + encodeURI(tweetContent));
    // if (twitterViaAccount)
    //   twitterParameters.push('via=' + encodeURI(twitterViaAccount));
    // const url =
    //   'https://twitter.com/intent/tweet?'
    //   + twitterParameters.join('&');

    const url = 'https://twitter.com/Alsyahdapp';
    Linking.openURL(url)
      .then(data => {
        alert('Twitter Opened');
      })
      .catch(() => {
        Toast.show({
          text1: ArabicText?.Somethingwentwrong,
          type: 'error',
          visibilityTime: 3000,
        });
      });
  };
  const navigation = useNavigation();
  return (
    <View style={Styles.container}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          color: '#d2691e',
          position: 'absolute',
          top: 40,
        }}>
        نشر الطبيق مع الا صدقاء
      </Text>
      {/* <TouchableOpacity style={{ top: 80, position: 'absolute' }}>
        <View style={Styles.sharebtn}>
          <Ionicons name="md-arrow-redo" size={24} color="#fff" />
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{top: 80, position: 'absolute'}}
        onPress={() => navigation.navigate('Home')}>
        <View style={Styles.sharebtn}>
          <Ionicons name="arrow-undo-circle" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <View style={Styles.quesmark}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AboutUs')}
          style={Styles.aboutUsTouchableOpacity}>
          <Text style={Styles.boxtext}>{ArabicText.AboutUs}</Text>

          <View style={Styles.iconbox}>
            <AntDesign name="questioncircle" size={26} color="#8b4513" />
          </View>
        </TouchableOpacity>
        <View style={Styles.iconbox}>
          <TouchableOpacity onPress={() => navigation.navigate('AboutUs')}>
            <AntDesign
              name="questioncircle"
              size={26}
              color="#8b4513"
              style={{position: 'absolute', left: -13, top: -12}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Sponcers')}
        style={Styles.hand}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Sponcers')}
          style={Styles.aboutUsTouchableOpacity}>
          <Text style={Styles.boxtext}>شركاء النجام</Text>

          <View style={Styles.iconbox}>
            <FontAwesome5 name="handshake" size={28} color="#deb887" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('PrivacyPolicy')}
        style={Styles.warning}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PrivacyPolicy')}
          style={Styles.aboutUsTouchableOpacity}>
          <Text style={Styles.boxtext}>{ArabicText.PrivacyPolicy}</Text>
          <View style={Styles.iconbox}>
            <FontAwesome name="warning" size={28} color="#a9a9a9" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Bank')}
        style={Styles.bank}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Bank')}
          style={Styles.aboutUsTouchableOpacity}>
          <Text style={Styles.boxtext}>{ArabicText.Bank}</Text>

          <View style={Styles.iconbox}>
            <MaterialCommunityIcons name="bank" size={28} color="#0000cd" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      {/* <View style={Styles.whtsapp}
        <TouchableOpacity onPress={() => openWhatsApp()}
          <Text style={Styles.boxtext} >تحدث معنا</Text
        </TouchableOpacity
        <View style={Styles.iconbox}
          <TouchableOpacity onPress={() => openWhatsApp()}>
            <FontAwesome5 name="whatsapp-square" size={35} color="#00ff00" />
          </TouchableOpacity>
        </View>
      </View> */}

      <Text style={{fontWeight: '400', fontSize: 14, color: 'grey', margin: 3}}>
        حسابات مواقع التواصل الاجتماعي
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: width / 2,
          alignSelf: 'center',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity onPress={() => tweetNow()}>
          <Entypo name="twitter-with-circle" size={45} color="#d2691e" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            openIstagram();
          }}
          style={{
            width: 43,
            height: 43,
            borderRadius: 20,
            backgroundColor: '#d2691e',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome5 name="instagram" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openWhatsApp()}
          style={{
            width: 43,
            height: 43,
            borderRadius: 20,
            backgroundColor: '#d2691e',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Fontisto name="whatsapp" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={{fontSize: 12, color: '#d2691e', margin: 3}}>
        Contact@Alsyahd.com
      </Text>
      <Text style={{fontSize: 15, color: '#d2691e', fontWeight: '400'}}>
        WWW.ALSYAHD.COM
      </Text>
      <Image
        source={require('../../assets/image.png')}
        style={Styles.bottomimg}></Image>
    </View>
  );
}
