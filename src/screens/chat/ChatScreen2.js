import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const ChatScreen2 = () => {
  const textID = Date.now();

  const [messageText, setMessageText] = useState('');
  const [person1Text, setPerson1Text] = useState([]);
  const [person2Text, setPerson2Text] = useState('Hello');

  const chatMessage = e => {
    setMessageText(e);
  };

  const chatData = [];


  const sendhandler = (e) => {
    // setPerson1Text({textID, messageText});
    chatData.push({textID, messageText});
    setMessageText('');
  };

  // //console.log(chatData, '<<<<<====chatData');
  return (
    <View
      style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#fff'}}>
      {/* Person-2 */}
      {person2Text ? (
        <View style={{}}>
          <View style={styles.person2}>
            <Text style={{color: '#000'}}>How are you?</Text>
          </View>
        </View>
      ) : null}

      {/* Person-1 */}
      {chatData.messageText ? (
        <View style={{}}>
          <View style={styles.person1}>
            <Text style={{color: '#fff'}}>{chatData.messageText}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.inputWrapper}>
        <View style={{flex: 1}}>
          <TextInput
            value={messageText}
            placeholder="Type here"
            onChangeText={chatMessage}
            style={{
              fontSize: 17,
            }}
          />
        </View>

        {messageText.length > 0 ? (
          <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={sendhandler}>
            <MaterialCommunityIcons name="send" size={25} color="#000" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default ChatScreen2;

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1.2,
    borderTopColor: 'grey',
  },
  person2: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgrey',
    padding: 11,
    borderRadius: 10,
    margin: 10,
    elevation: 5,
  },
  person1: {
    alignSelf: 'flex-end',
    backgroundColor: 'dodgerblue',
    padding: 11,
    borderRadius: 10,
    margin: 10,
    elevation: 5,
  },
});
