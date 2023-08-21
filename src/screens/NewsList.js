import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, SafeAreaView } from 'react-native';
import { Styles } from '../styles/globlestyle'
import Feather  from 'react-native-vector-icons/Feather';
import AntDesign  from 'react-native-vector-icons/AntDesign';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import  Entypo  from 'react-native-vector-icons/Entypo';


import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height
export default function App() {
   const navigation = useNavigation()
   return (
      <View style={Styles.container}>
         <SafeAreaView>
      
               <View style={Styles.newsbox}>
                  <TouchableOpacity onPress={() => navigation.navigate('News')} style={{ right: 0, position: 'absolute' }}>
                     <Image source={require('../../assets/camel.png')} style={{ height: hight / 5, width: width / 3 }} resizeMode='cover'></Image>
                  </TouchableOpacity>
                  <View style={{ top: 20, bottom: 0, right: 140, position: 'absolute' }}>
                     <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}> New for test عنوان :</Text>
                  </View>
                  <View style={{ left: 10, position: 'absolute', top: 5, flexDirection: 'row' }}>
                     <Entypo name="star" size={15} color="brown" />
                     <Entypo name="star" size={15} color="brown" />
                     <Entypo name="star" size={15} color="brown" />
                     <Entypo name="star" size={15} color="brown" />
                     <Entypo name="star" size={15} color="brown" />
                  </View>
                  <TouchableOpacity style={{ left: 10, position: 'absolute', bottom: 0 }}>
                     <Ionicons name="arrow-back-sharp" size={30} color="brown" />
                  </TouchableOpacity>
               </View>
        
         </SafeAreaView>
      </View>
   )
}
