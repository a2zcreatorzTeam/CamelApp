import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { Styles } from '../styles/globlestyle'

export default function App() {
   return (
      <View style={Styles.container}>
         <ScrollView>
            <View style={Styles.winnerList}>
               <View style={Styles.winnerinfo}>
                  <Text style={{ left: 10, position: 'absolute', fontWeight: 'bold', color: '#D2691Eff' }}>100</Text>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                     <Text style={{ fontWeight: 'bold', color: '#D2691Eff' }}>نص وهمي</Text>
                     <View style={Styles.ratingline}></View>
                  </View>
                  <Image source={require('../../assets/camel.png')} style={Styles.imagecircle}></Image>
                  <Text style={{ right: 10, position: 'absolute', fontWeight: 'bold', color: '#D2691Eff', fontSize: 20 }}>1</Text>
               </View>
            </View>
         </ScrollView>
      </View>
   )
}

