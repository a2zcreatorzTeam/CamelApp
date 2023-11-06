import {View, Text} from 'react-native';
import React from 'react';
import * as ArabicText from '../language/EnglishToArabic';

const NotFound = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 20, color: 'grey', fontWeight: '600'}}>
        {ArabicText?.Nodatafound}
      </Text>
    </View>
  );
};

export default NotFound;
