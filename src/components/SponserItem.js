import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
import { profileBaseUrl } from '../constants/urls';
import { family } from '../constants/Family';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

const BankItem = ({name, address, userImage, phone}) => (
  <View
    style={{
      width: width,
      height: 140,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 30,
        width: width - 20,
        height: '100%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 20,
        elevation: 5,
      }}>
      <View style={{width: 150}}>
        <Text
          numberOfLines={1}
          style={{
            textAlign: 'right',
            fontWeight: '600',
            color: '#D2691E',
            fontSize: 16,
            fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
            fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
          }}>
          {ArabicText.phone}:{phone}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            textAlign: 'right',
            fontWeight: '600',
            fontSize: 16,
            color: '#D2691E',
            fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
          }}>
          {ArabicText.Address}:{address}
        </Text>
      </View>
      <Image
        source={{
          uri: profileBaseUrl + userImage,
        }}
        resizeMode={'contain'}
        style={{
          width: 130,
          height: 120,
          borderRadius: 18,
          borderWidth: 0.5,
          borderColor: 'black',
        }}></Image>
    </View>
  </View>
);
export default BankItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
