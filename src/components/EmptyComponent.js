import React from 'react';
import {View, Text, Platform} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
import { family } from '../constants/Family';

const EmptyComponent = ({text, textStyle}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={[
          {
            color: 'black',
            textAlign: 'center',
            fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
          },
          textStyle,
        ]}>
        {ArabicText?.Nodatafound}
      </Text>
    </View>
  );
};

export default EmptyComponent;
