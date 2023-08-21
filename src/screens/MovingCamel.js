import React from 'react';
import { View, TouchableOpacity, Text, Image, SafeAreaView } from 'react-native';
import { Styles } from '../styles/globlestyle'
import { Dimensions } from "react-native";

const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height

export default function App() {
  return (
    <View style={Styles.container}>
      <SafeAreaView>
        <View style={Styles.newsbox}>
          <Image source={require('../../assets/camel.png')} style={{ right: 0, position: 'absolute', height: hight / 5, width: width / 3 }} resizeMode='cover'></Image>
          <View style={{ top: 20, bottom: 0, right: 140, position: 'absolute' }}>
            <Text style={{ textAlign: 'right', fontWeight: '500', fontSize: 16 }}> عنوان :</Text>
            <Text style={{ textAlign: 'right', fontWeight: '500', fontSize: 16 }}>النوع :</Text>
            <Text style={{ textAlign: 'right', fontWeight: '500', fontSize: 16 }}>الموقع :</Text>
            <Text style={{ textAlign: 'right', fontWeight: '500', fontSize: 16 }}>سعر :</Text>
          </View>
          <TouchableOpacity style={{ left: 5, position: 'absolute' }}>
            <View style={Styles.btnHome}><Text style={{ color: '#fff', fontWeight: 'bold' }}>تفاصيل</Text></View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}
