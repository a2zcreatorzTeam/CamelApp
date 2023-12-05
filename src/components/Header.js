import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import * as ArabicText from '../language/EnglishToArabic';

const {width} = Dimensions.get('screen');
const Header = props => {
  let {
    navRoute,
    onChangeText,
    onPressSearch = () => {},
    filterIcon,
    onChangeTo,
    onChangeFrom,
  } = props;
  const navigation = useNavigation(0);
  const goBack = () => {
    navigation.goBack();
  };
  const whatsApp = () => {
    navigation.navigate('AppDetails');
  };
  return (
    <View style={[Styles.header, {paddingVertical: 10}]}>
      <View style={Styles.subHeaderView}>
        {/* {filterIcon && (
          <TouchableOpacity
            onPress={() => setLocationInput(!locationInput)}
            style={[styles.btnContainer, {marginLeft: 10, marginRight: 0}]}>
            <FontAwesome name={'filter'} size={24} color="brown" />
          </TouchableOpacity>
        )} */}
        <CircularBTN
          iconName="arrow-back-sharp"
          onPress={() => onPressSearch()}
        />
        {filterIcon ? (
          <View
            style={{
              flexDirection: 'row',
              width: '70%',
              justifyContent: 'space-between',
            }}>
            <View
              style={[Styles.searchbar, {width: '49%', paddingHorizontal: 5}]}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    width: '100%',
                    position: 'relative',
                  },
                ]}
                placeholder={ArabicText.To}
                placeholderTextColor="#000000"
                onChangeText={text => {
                  onChangeTo(text);
                }}
              />
            </View>
            <View
              style={[Styles.searchbar, {width: '49%', paddingHorizontal: 5}]}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    width: '100%',
                    position: 'relative',
                  },
                ]}
                placeholder={ArabicText.From}
                placeholderTextColor="#000000"
                onChangeText={text => {
                  onChangeFrom(text);
                  console.log(text, 'textttt123');
                }}
              />
            </View>
          </View>
        ) : (
          <View style={[Styles.searchbar, {width: filterIcon ? '60%' : '70%'}]}>
            <TextInput
              placeholder="البحث"
              value={props.onChangeText}
              style={styles.searchInput}
              placeholderTextColor={'#919191'}
              onChangeText={onChangeText}
            />
          </View>
        )}

        <CircularBTN
          iconName="md-arrow-redo"
          onPress={navRoute === 'Home' ? whatsApp : goBack}
        />
      </View>
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
