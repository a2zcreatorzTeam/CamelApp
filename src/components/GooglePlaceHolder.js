// import React from 'react';
// import {StyleSheet, View, Dimensions, Image, Text} from 'react-native';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import {GEOCODE_API_KEY} from '../config/WebService';
// import {colors, WP} from '../utils';

// const {width} = Dimensions.get('screen');

// const GooglePlaceAutocomplete = ({
//   callback,
//   wrapperStyles,
//   placeholder,
//   label,
//   address,

//   backgroundColor,
// }) => {
//   return (
//     <View style={[styles.geoLocationView, wrapperStyles]}>
//       {/* {title && (
//           <View style={[{}, titleViewstyle]}>
//             <Text style={{color:'black'}}>
//               {'titleText'}
//             </Text>
//         //   </View>
//         )} */}
//       <GooglePlacesAutocomplete
//         formatted_address={address}
//         enableHighAccuracyLocation
//         fetchDetails
//         disableScroll
//         backgroundColor
//         enablePoweredByContainer={false}
//         keepResultsAfterBlur={true}
//         listViewDisplayed={false}
//         placeholder={placeholder ? placeholder : 'Add Location'}
//         placeholderTextColor={'white'}
//         onPress={(data, details = null) => {
//           const {formatted_address, geometry} = details;
//           callback(formatted_address, geometry, label);
//         }}
//         // renderRightButton={() => (
//         //   <Image
//         //     source={appIcons.relocator}
//         //     style={{
//         //       width: 20,
//         //       height: 20,
//         //       resizeMode: 'contain',
//         //       tintColor: iconColor ? iconColor : colors.primary,
//         //       alignSelf: 'center',
//         //       marginBottom: 5,
//         //       marginLeft: 15,
//         //       marginRight: 5,
//         //     }}
//         //   />
//         // )}
//         styles={{
//           textInput: {
//             borderRadius: 10,
//             height: 54,
//             backgroundColor: backgroundColor,
//             borderRadius: 10,
//             color: colors.primary,
//             width: WP('100%'),
//             right: 6,
//           },
//           description: {color: colors.black},
//         }}
//         textInputProps={{
//           placeholderTextColor: colors.black,
//           fontSize: 12,
//         }}
//         query={{
//           key: GEOCODE_API_KEY,
//           language: 'en',
//         }}
//       />
//     </View>
//   );
// };

// export default GooglePlaceAutocomplete;

// const styles = StyleSheet.create({
//   geoLocationView: {
//     flexDirection: 'row',
//     paddingHorizontal: 14,
//     width: WP('90%'),
//     marginTop: 20,
//     backgroundColor: colors.card,
//     borderRadius: 10,
//   },
//   textInput: {
//     // flex: 1,
//     // height: 55,
//     // color: colors?.black,
//     // borderRadius: 10,
//     // backgroundColor: colors.card,
//     // width: width,
//   },
// });
