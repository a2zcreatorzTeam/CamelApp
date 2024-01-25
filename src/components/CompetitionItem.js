import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
const width = Dimensions.get('screen').width;
import * as ArabicText from '../language/EnglishToArabic';
import FastImage from 'react-native-fast-image';
import {mainImageUrl} from '../constants/urls';
import { family } from '../constants/Family';
const itemWidth = (width - 15) / 2;
const Item = ({name, start_date, end_date, onItemClick, image, loader}) => (
  <View
    style={{
      alignSelf: 'center',
      justifyContent: 'space-evenly',
      marginHorizontal: loader == false ? 3 : 0,
      marginVertical: loader == false ? 3 : 0,
      elevation: 0.5,
      maxWidth: '50%',
      minWidth: itemWidth,
    }}>
    <TouchableOpacity
      onPress={onItemClick}
      style={{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <FastImage
        style={Styles.BeautyImages}
        source={{
          uri: `${mainImageUrl}competition/` + image,
          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage?.resizeMode.cover}
      />
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text
          numberOfLines={2}
          style={{
            height: 40,
            alignSelf: 'center',
            color: 'black',
            textAlign: 'right',
            fontWeight: '600',
            fontSize: 14,
            fontFamily:family.Neo_Regular
          }}>
          {name}
        </Text>
        {/* <Text style={{ textAlign: 'right', fontWeight: '600', fontSize: 14 }}> {ArabicText.Title} </Text> */}
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text
          style={{
            color: 'black',
            textAlign: 'right',
            fontWeight: '600',
            fontSize: 12,
            fontFamily:family.Neo_Regular
          }}>
          {start_date} :{' '}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            color: 'black',
            fontWeight: 'bold',
            fontSize: 12,
            fontFamily:family.Neo_Regular
          }}>
          {ArabicText.Start_Date}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text
          style={{
            color: 'black',
            textAlign: 'right',
            fontWeight: '600',
            fontSize: 12,
            fontFamily:family.Neo_Regular
          }}>
          {end_date} :{' '}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            color: 'black',
            fontWeight: 'bold',
            fontSize: 12,
            fontFamily:family.Neo_Regular
          }}>
          {ArabicText.End_Date}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);
export default Item;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
