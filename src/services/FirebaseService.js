import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
// import {COLLECTIONS} from '../constants';
import {COLLECTIONS} from '../constants/index';
import {getDatabase, ref, set} from 'firebase/database';
import firebaseConfig from '../components/firebase';

const checkOrCreateChatRoom = (chatRoomId, user1, user2) => {
  const chatRoomRef = firestore().collection('chats').doc(chatRoomId);

  // Check if the chat room exists
  chatRoomRef.get().then(docSnapshot => {
    if (!docSnapshot.exists) {
      // If it doesn't exist, create a new chat room document
      chatRoomRef
        .set({
          members: {
            [user1]: true,
            [user2]: true,
          },
        })
        .then(() => {
          console.log('Chat room created successfully!');
        })
        .catch(error => {
          console.error('Error creating chat room: ', error);
        });
    } else {
      console.log('Chat room already exists.');
    }
  });
};

const sendMessage = (user_id, inputValue, chatRoomId) => {
  console.log(
    user_id,
    new Date(),
    chatRoomId,
    'user_id, inputValue, chatRoomId',
  );
  const newMessage = {
    sender: user_id,
    text: inputValue,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    date: new Date(),
  };

  const messagesRef = firebase
    .firestore()
    .collection(`chats/${chatRoomId}/messages`);
  return messagesRef
    .add(newMessage)
    .then(() => {
      console.log('Message sent successfully');
      return true;
    })
    .catch(error => {
      console.error('Error sending message:', error);
      return false;
    });
};

export {checkOrCreateChatRoom, sendMessage};
