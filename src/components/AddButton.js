/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
import {Styles} from '../styles/globlestyle';
import {family} from '../constants/Family';

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
          fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
        },
      ]}>
      {ArabicText.add}
    </Text>
  </TouchableOpacity>
);
export default AddButton;
