import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
const width = Dimensions.get('screen').width;
import * as ArabicText from '../language/EnglishToArabic';
import FastImage from 'react-native-fast-image';
import {mainImageUrl} from '../constants/urls';
import {family} from '../constants/Family';
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
        width: '100%',
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
      {/* TITLE VIEW  */}
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text
          numberOfLines={2}
          style={{
            height: 30,
            alignSelf: 'center',
            color: 'black',
            textAlign: 'right',
            fontSize: 14,
            fontFamily: family.Neo_Medium,
            marginTop: 10,
          }}>
          {name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            textAlign: 'right',
            fontSize: 12,
            fontFamily: family.Neo_Medium,
          }}>
          {start_date} :{' '}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            color: 'black',
            fontSize: 12,
            fontFamily: family.Neo_Medium,
          }}>
          {ArabicText.Start_Date}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            textAlign: 'right',
            fontSize: 12,
            fontFamily: family.Neo_Medium,
          }}>
          {end_date} :{' '}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            color: 'black',
            fontSize: 12,
            fontFamily: family.Neo_Medium,
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
