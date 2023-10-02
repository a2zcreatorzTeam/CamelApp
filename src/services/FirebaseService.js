// import firebase from 'react-native-firebase';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
// import {COLLECTIONS} from '../constants';
import {COLLECTIONS} from '../constants/index';

export default class FirebaseService {
  firestore = firestore();

  messageRef = this.firestore.collection(COLLECTIONS.MESSAGES);
  database = database();
  chatRoomsRef = this.database.ref('chatRooms');

  // async fetchMessages() {
  //   const messages = await this.messageRef
  //     .orderBy('created_at', 'desc')
  //     .limit(10)
  //     .get();

  //   return messages.docs;
  // }

  // Check for an existing chat room or create a new one
  async checkOrCreateChatRoom(user1Id, user2Id) {
    console.log(user1Id, user2Id, 'iddd');
    // Query the chat rooms to find a matching room
    this.chatRoomsRef.once('value', snapshot => {
      let existingRoomId = null;
      // Loop through chat rooms
      snapshot.forEach(roomSnapshot => {
        const roomData = roomSnapshot.val();
        const roomUsers = roomData.users;
        // Check if the room has the same users
        if (roomUsers.includes(user1Id) && roomUsers.includes(user2Id)) {
          existingRoomId = roomSnapshot.key;
          return true; // Stop iterating once a match is found
        }
      });
      if (existingRoomId) {
        console.log('433333');
        // An existing chat room was found, use it
        enterExistingChatRoom(existingRoomId);
      } else {
        console.log('ccreate');
        // No existing chat room, create a new one
        this.createChatRoom(user1Id, user2Id);
      }
    });
    // this.chatRoomsRef
    //   .orderByChild('users')
    //   .equalTo([user1Id, user2Id])
    //   .once('value', snapshot => {
    //     console.log(snapshot, "smapshotttt");
    //     if (snapshot.exists()) {
    //       console.log('existtts');
    //       const roomId = Object.keys(snapshot.val())[0];
    //       enterExistingChatRoom(roomId);
    //     } else {
    //       console.log('notExisttt');
    //       // No existing chat room, create a new one
    //       createNewChatRoom(user1Id, user2Id);
    //     }
    //   });
  }

  // Send a message in a chat room
  createMessage = (roomId, senderId, messageText) => {
    const messageRef = database().ref(`/chatRooms/${roomId}/messages`);
    const newMessageRef = messageRef.push();
    newMessageRef.set({
      text: messageText,
      sender: senderId,
      timestamp: database.ServerValue.TIMESTAMP,
    });
  };

  // Create a chat room for two users
  createChatRoom = (user1Id, user2Id) => {
    console.log("7999");
    const roomId = generateChatRoomId(user1Id, user2Id);
    console.log(roomId, "roomIddddd");
    const chatRoomRef = database().ref(`/chatRooms/${roomId}`);
    // Add the users to the chat room
    chatRoomRef.child('users').set([user1Id, user2Id]);
    console.log("successs");
  };

  // async createMessage({message, uid}) {
  //   console.log(message, uid, 'messagesssss');
  //   await this.messageRef.add({
  //     message,
  //     user_id: uid,
  //     created_at: new Date(),
  //   });
  // }
  // Create a room for a user
  //   async createRoomForUser(userId, roomName) {
  //     const database = database();
  //     const userRef = database.ref(`/users/${userId}`);
  //     // Check if the room already exists
  //     userRef.child(roomName).once('value', snapshot => {
  //       if (!snapshot.exists()) {
  //         // Room doesn't exist, create it
  //         userRef.child(roomName).set({
  //           // Initialize room data here
  //         });
  //       }
  //     });
  //   }
}
