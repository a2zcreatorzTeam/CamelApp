import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Tooltip} from 'react-native-elements';
import {useRef} from 'react';
const BackBtnHeader = props => {
  let {style} = props;
  const tooltipRef = useRef(null);
  const navigation = useNavigation(0);
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={[
        Styles.header,
        Styles?.subHeaderView,
        style,
        {paddingBottom: 10},
      ]}>
      {props?.reciever_data && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '90%',
            marginLeft: 'auto',
          }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              marginHorizontal: 5,
            }}>
            {props?.reciever_data?.user_name?.length > 25
              ? props?.reciever_data?.user_name?.slice(0, 25)
              : props?.reciever_data?.user_name}
          </Text>
          <FastImage
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
              marginRight: 5,
              marginHorizontal: 5,
            }}
            source={{
              uri:
                'http://www.tasdeertech.com/images/profiles/' +
                props?.reciever_data?.user_image,
            }}
            resizeMode={FastImage?.resizeMode.cover}
          />
        </View>
      )}
      {props?.title && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            marginLeft: 'auto',
          }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            {props?.title?.length > 25
              ? props?.title?.slice(0, 25)
              : props?.title}
          </Text>
        </View>
      )}
      {props?.showToolTip && (
        <>
          <Tooltip
            ref={tooltipRef}
            height={50}
            containerStyle={styles.toolTip}
            popover={
              <View
                style={{
                  width: '90%',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.tooltipItems}
                  onPress={() => {
                    tooltipRef.current.toggleTooltip();
                    navigation.navigate('ChangePassword');
                  }}>
                  <Text style={styles.tooltipTitle}>Change Password</Text>
                </TouchableOpacity>
              </View>
            }
            withPointer={false}
            backgroundColor={'#fff'}></Tooltip>
          <TouchableOpacity
            style={{width: 40, marginLeft: 5}}
            onPress={() => {
              tooltipRef.current.toggleTooltip();
            }}>
            <Entypo name={'dots-three-vertical'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </>
      )}
      <CircularBTN
        recieverData={props?.reciever_data}
        iconName="md-arrow-redo"
        onPress={props.Nav ? () => props.customNav() : goBack}
      />
    </View>
  );
};

export default BackBtnHeader;

const CircularBTN = ({onPress, iconName, recieverData}) => (
  <TouchableOpacity
    onPress={onPress}
    style={
      recieverData
        ? [styles.btnContainer, {backgroundColor: '#d2691e'}]
        : styles?.btnContainer
    }>
    <Ionicons
      name={iconName}
      size={24}
      color={recieverData ? 'white' : 'brown'}
    />
  </TouchableOpacity>
);
// const Dots = ({onPress, iconName}) => (

// );
const styles = StyleSheet.create({
  btnContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginLeft: 'auto',
    marginRight: 10,
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
  toolTip: {
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: 'center',
  },

  tooltipItems: {
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },

  tooltipTitle: {
    color: 'black',
  },
});
