import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  Dimensions,
  StyleSheet,
  Share,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as ArabicText from '../language/EnglishToArabic';
import { Styles } from '../styles/globlestyle';
import BackBtnHeader from '../components/headerWithBackBtn';
import { family } from '../constants/Family';

const width = Dimensions.get('screen').width;

export default function AppDetails() {
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
        // alert('Instagram Opened');
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
        // alert('Twitter Opened');
      })
      .catch(() => {
        Toast.show({
          text1: ArabicText?.Somethingwentwrong,
          type: 'error',
          visibilityTime: 3000,
        });
      });
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'SHARE POST',
        message: `URL`,
        url: `www.google.com`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const navigation = useNavigation();
  return (
    <View style={Styles.container}>
      <BackBtnHeader />
      <Text style={styles.heading}>{ArabicText.shareWithYourFriends}</Text>
      <TouchableOpacity style={Styles.sharebtn} onPress={() => { onShare() }}>
        <Ionicons name="arrow-undo-circle" size={24} color="#fff" />
      </TouchableOpacity>
      {/* ABOUT US  */}
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
              style={{ position: 'absolute', left: -13, top: -12 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Sponcers */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Sponcers')}
        style={Styles.hand}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Sponcers')}
          style={Styles.aboutUsTouchableOpacity}>
          <Text style={Styles.boxtext}>{ArabicText.start_partner}</Text>

          <View style={Styles.iconbox}>
            <FontAwesome5 name="handshake" size={28} color="#deb887" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      {/* PrivacyPolicy */}
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
      {/* Bank */}
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
      <Text style={styles.socialMediaText}>
        {ArabicText?.Socialmediaaccounts}
      </Text>
      {/* Social Share  */}
      <View style={styles.socialMediaView}>
        {/* Twitter  */}
        <TouchableOpacity onPress={() => tweetNow()}>
          <Entypo name="twitter-with-circle" size={45} color="#d2691e" />
        </TouchableOpacity>
        {/* instagram  */}
        <TouchableOpacity
          onPress={() => {
            openIstagram();
          }}
          style={styles.socialIcon}>
          <FontAwesome5 name="instagram" size={28} color="#fff" />
        </TouchableOpacity>
        {/* WhatsApp  */}
        <TouchableOpacity
          onPress={() => openWhatsApp()}
          style={styles.socialIcon}>
          <Fontisto name="whatsapp" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Contact */}
      <Text style={styles.email}>Contact@Alsyahd.com</Text>
      <Text style={styles.website}>WWW.ALSYAHD.COM</Text>
      <Image
        source={require('../../assets/image.png')}
        style={Styles.bottomimg}></Image>
    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#d2691e',
    marginTop: 100,
    fontFamily: family.Neo_Regular
  },
  socialMediaText: {
    fontWeight: '400',
    fontSize: 14,
    color: 'grey',
    margin: 3,
    marginVertical: 10,
    fontFamily: family.Neo_Regular
  },
  socialMediaView: {
    flexDirection: 'row',
    width: width / 2,
    alignSelf: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  socialIcon: {
    width: 43,
    height: 43,
    borderRadius: 20,
    backgroundColor: '#d2691e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: { fontSize: 12, color: '#d2691e', margin: 3, fontFamily: family.Neo_Regular },
  website: { fontSize: 15, color: '#d2691e', fontWeight: '400', fontFamily: family.Neo_Regular },
});
