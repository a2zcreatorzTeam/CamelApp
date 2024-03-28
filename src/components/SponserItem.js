/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
import {profileBaseUrl} from '../constants/urls';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import FastImage from 'react-native-fast-image';

const BankItem = ({name, address, userImage, phone}) => (
  <View
    style={{
      width: width,
      height: 125,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    }}>
    <View
      style={{
        marginTop: 10,
        marginBottom: 30,
        height: '100%',
        borderRadius: 20,
        elevation: 5,
        width: width - 20,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}>
      <FastImage
        style={{flex: 1, width: '100%', height: undefined, borderRadius: 20}}
        source={{
          uri: profileBaseUrl + userImage,

          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage?.resizeMode.contain}
      />
      {/* <Image
        source={{
          uri: profileBaseUrl + userImage,
        }}
        resizeMode={'contain'}
        style={{
          width: '100%',
          height: 120,
          borderRadius: 18,
          borderWidth: 0.5,
          borderColor: 'black',
        }}></Image> */}
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
