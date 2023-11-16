import React from 'react';
import {View, Text} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';

const EmptyComponent = ({text, textStyle}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={[{
          color: 'black',
          textAlign: 'center',
          
        }, textStyle]}>
        {ArabicText?.Nodatafound}
      </Text>
    </View>
  );
};

export default EmptyComponent;
