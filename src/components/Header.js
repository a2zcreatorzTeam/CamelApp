import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Header = props => {
  let {navRoute, onChangeText, onPressSearch} = props;
  const navigation = useNavigation(0);
  const goBack = () => {
    navigation.goBack();
  };
  const whatsApp = () => {
    navigation.navigate('Whatsapp');
  };
  return (
    <View style={Styles.header}>
      <CircularBTN iconName="arrow-back-sharp" onPress={onPressSearch} />

      <View style={Styles.searchbar}>
        <TextInput
          placeholder="البحث"
          value={props.onChangeText}
          style={styles.searchInput}
          placeholderTextColor={'#919191'}
          onChangeText={onChangeText}
        />
      </View>

      <CircularBTN
        iconName="md-arrow-redo"
        onPress={navRoute === 'Home' ? whatsApp : goBack}
      />
    </View>
  );
};

export default Header;

const CircularBTN = ({onPress, iconName}) => (
  <TouchableOpacity onPress={onPress} style={styles.btnContainer}>
    <Ionicons name={iconName} size={24} color="brown" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btnContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  searchInput: {
    color: 'black',
    alignSelf: 'center',
    textAlign: 'right',
    width: '90%',
    height: '100%',
    zIndex: 20,
    position: 'absolute',
  },
});
