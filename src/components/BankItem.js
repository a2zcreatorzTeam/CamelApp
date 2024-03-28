import React from 'react';
import {View, Text, Image, Platform} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
import {mainImageUrl} from '../constants/urls';
import FastImage from 'react-native-fast-image';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;
const BankItem = ({name, address, userImage, phone}) => (
  <View style={Styles.containerSponsor}>
    <View
      style={{
        width: width - 30,
        backgroundColor: '#fff',
        alignSelf: 'center',
        padding: 20,
        borderRadius: 20,
      }}>
      <View style={Styles.sponsorItem}>
        <View style={{padding: 20, width: '70%', alignItems: 'flex-end'}}>
          <Text
            style={{
              textAlign: 'right',
              color: '#D2691E',
              fontSize: 16,
              padding: 5,
              fontFamily: family.Neo_Regular,
              width: '90%',
            }}>
            {ArabicText.Title}:{name}
          </Text>
          <Text
            style={{
              textAlign: 'right',
              fontSize: 16,
              color: '#D2691E',
              padding: 5,
              fontFamily: family.Neo_Regular,
            }}>
            {ArabicText.Address}:{address}
          </Text>
          <Text
            style={{
              textAlign: 'right',
              fontSize: 16,
              color: '#D2691E',
              padding: 5,
              fontFamily: family.Neo_Regular,
              width: '90%',
            }}>
            {ArabicText.phone}:{phone}
          </Text>
        </View>
        <FastImage
          style={{width: 145, height: 145, marginRight: 10, borderRadius: 18}}
          source={{
            uri: `${mainImageUrl}bank/` + userImage,
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
        />
      </View>
    </View>
  </View>
);
export default BankItem;
