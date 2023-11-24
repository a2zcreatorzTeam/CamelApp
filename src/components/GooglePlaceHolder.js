import React, {useRef, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as ArabicText from '../language/EnglishToArabic';

const {width} = Dimensions.get('screen');

const GooglePlaceAutocomplete = ({
  callback = () => {},
  wrapperStyles,
  placeholder,
  label,
  address,
}) => {
  return (
    <View style={[styles.geoLocationView, wrapperStyles]}>
      {/* <GooglePlacesAutocomplete
        ref={ref}
        formatted_address={address}
        enableHighAccuracyLocation
        fetchDetails
        enablePoweredByContainer={false}
        keepResultsAfterBlur={true}
        listViewDisplayed={false}
        placeholder={placeholder ? placeholder : ArabicText?.AddLocation}
        placeholderTextColor={'#b0b0b0'}
        onPress={(data, details = null) => {
          const {formatted_address, geometry} = details;
          callback(formatted_address, geometry, label);
        }}
        styles={{
          textInput: {
            borderRadius: 10,
            color: 'black',
            width: '100%',
            textAlign: 'right',
          },
          description: {color: 'black'},
        }}
        textInputProps={{
          placeholderTextColor: '#b0b0b0',
          fontSize: 12,
        }}
        query={{
          key: 'AIzaSyBoQGDEoED5cH7xcsMoUWSWA64WrtSyu2U',
          language: 'ar',
        }}
      /> */}
      <GooglePlacesAutocomplete
        enableHighAccuracyLocation
        currentLocation
        fetchDetails
        disableScroll
        enablePoweredByContainer={false}
        listViewDisplayed={false}
        placeholder={placeholder ? placeholder : ArabicText?.AddLocation}
        placeholderTextColor="black"
        onPress={(data, details = null) => {
          const {formatted_address, geometry} = details;
          callback(formatted_address, geometry);
        }}
        styles={{
          textInput: {
            borderRadius: 10,
            color: 'black',
            width: '100%',
            textAlign: 'right',
          },
          description: {color: 'black'},
        }}
        textInputProps={{
          placeholderTextColor: '#b0b0b0',
          fontSize: 12,
        }}
        query={{
          key: 'AIzaSyBoQGDEoED5cH7xcsMoUWSWA64WrtSyu2U',
          language: 'en',
          //   types: 'premise',
        }}
        // {...props}
      />
    </View>
  );
};

export default GooglePlaceAutocomplete;

const styles = StyleSheet.create({
  geoLocationView: {
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: '#d2691e',
    borderBottomWidth: 1,
    textAlign: 'right',
  },
  textInput: {
    // flex: 1,
    // height: 55,
    // color: colors?.black,
    // borderRadius: 10,
    // backgroundColor: colors.card,
    // width: width,
  },
});
