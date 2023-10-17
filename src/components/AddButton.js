import React from 'react';
import {Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
import {Styles} from '../styles/globlestyle';

const AddButton = ({onPress}) => (
  <TouchableOpacity
    style={{
      marginTop: 20,
      marginBottom: 20,
      borderRadius: 20,
      backgroundColor: '#D2691Eff',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    }}
    onPress={onPress}>
    <Text
      style={[
        Styles.textbtn,
        {
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 20,
          paddingRight: 20,
        },
      ]}>
      {ArabicText.add}
    </Text>
  </TouchableOpacity>
);
export default AddButton;