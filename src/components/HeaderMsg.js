import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Styles } from '../Styles/globlestyle'
import Feather  from 'react-native-vector-icons/Feather';
import AntDesign  from 'react-native-vector-icons/AntDesign';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import Foundation  from 'react-native-vector-icons/Foundation';

export default function App() {
  const navigation = useNavigation()
  return (
    <View style={Styles.headermsg}>

      <Ionicons
        name="chevron-back"
        size={24}
        color="#d2691e"
        style={{
          left: 10,
          position: 'absolute'
        }}
        onPress={() => navigation.goBack()} />

      <Text style={{ fontWeight: 'bold' }}>User Name</Text>

      <Foundation
        name="telephone"
        size={24}
        color="#d2691e"
        style={{
          right: 20,
          position: 'absolute'
        }} />

    </View>

  )
}
