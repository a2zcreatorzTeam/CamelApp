import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import ChatScreen from './ChatScreen';

const ChatPersonComp = ({navigation}) => {

  return (
    <Pressable
      android_ripple={{color: 'grey'}}
      onPress={() => navigation.navigate(ChatScreen)}
      style={{
        backgroundColor: '#fff',
        // borderRadius: 10,
        elevation: 8,
        marginBottom: 10,
        height: 60,
        width: '96%',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 17, marginLeft: 10, color: '#000'}}>
       Hello
      </Text>
    </Pressable>
  );
};

export default ChatPersonComp;

const styles = StyleSheet.create({});
