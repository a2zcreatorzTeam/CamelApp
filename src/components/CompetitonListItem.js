import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';

import * as ArabicText from '../language/EnglishToArabic';
import {mainImageUrl} from '../constants/urls';
import FastImage from 'react-native-fast-image';
import { family } from '../constants/Family';

export const Item = ({name, start_date, end_date, onItemClick, image}) => (
  <View>
    <TouchableOpacity onPress={onItemClick} style={{padding: 10}}>
      <View>
        {console.log(`${mainImageUrl}competition/` + image,"`${mainImageUrl}competition/` + image")}
        <FastImage
          style={Styles.BeautyImages}
          source={{
            uri: `${mainImageUrl}competition/` + image,
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage?.resizeMode.cover}
        />
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 14,
            fontFamily: family.Neo_Medium,
          }}>
          {' '}
          {name}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
        <Text style={{textAlign: 'right',  fontSize: 12, fontFamily: family.Neo_Medium,}}>
          {' '}
          {end_date}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
        <Text style={{textAlign: 'right', fontSize: 12, fontFamily: family.Neo_Medium,}}>
          {' '}
          {start_date}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);
