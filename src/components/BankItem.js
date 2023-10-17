import React from 'react';
import {View, Text, Image} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
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
        <View style={{padding: 20}}>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'right',
              fontWeight: '600',
              color: '#D2691E',
              fontSize: 16,
              padding: 5,
            }}>
            {ArabicText.Title}:{name}{' '}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'right',
              fontWeight: '600',
              fontSize: 16,
              color: '#D2691E',
              padding: 5,
            }}>
            {ArabicText.Address}:{address}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'right',
              fontWeight: '600',
              fontSize: 16,
              color: '#D2691E',
              padding: 5,
            }}>
            {ArabicText.phone}:{phone?.slice(8, 11)}********
          </Text>
        </View>
        <Image
          source={{
            uri: 'https:www.tasdeertech.com/images/bank/' + userImage,
          }}
          style={{
            width: 145,
            height: 145,
            marginRight: 10,
            borderRadius: 18,
          }}></Image>
      </View>
    </View>
  </View>
);
export default BankItem;