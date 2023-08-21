import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Styles } from '../styles/globlestyle'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header(props) {



  let { navRoute, onChangeText,onPressSearch } = props
  const navigation = useNavigation();



  return (
    <View style={Styles.header}>


      <TouchableOpacity onPress={onPressSearch}>
        <View style={{
          width: 35,
          height: 35,
          borderRadius: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10
        }}>
          <Ionicons name="arrow-back-sharp" size={24} color="brown" />
        </View>
      </TouchableOpacity>


      <View style={Styles.searchbar}>
        <TextInput
          value={props.onChangeText}
          style={{ color: 'black',alignSelf: 'center', textAlign: 'right', width: "90%", height: "100%", zIndex: 20, position: "absolute" }}
          placeholder='البحث'
          placeholderTextColor={"#919191"}
          onChangeText={onChangeText}
        />
      </View>


      {navRoute == "Home" ? <TouchableOpacity
        onPress={() => navigation.navigate('Whatsapp')}>

        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 20,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}>

          <Ionicons name="md-arrow-redo" size={24} color="brown" />


        </View>
      </TouchableOpacity>
        :
        <TouchableOpacity
          onPress={() => navigation.goBack()}>

          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
            }}>

            <Ionicons name="md-arrow-redo" size={24} color="brown" />


          </View>
        </TouchableOpacity>}
    </View>
  )
}
