// import firebase from 'react-native-firebase';
import firestore from '@react-native-firebase/firestore';
// import {COLLECTIONS} from '../constants';
import {COLLECTIONS} from '../constants/index';

export default class FirebaseService {
  firestore = firestore();

  messageRef = this.firestore.collection(COLLECTIONS.MESSAGES);

  async fetchMessages() {
    const messages = await this.messageRef
      .orderBy('created_at', 'desc')
      .limit(10)
      .get();

    return messages.docs;
  }

  async createMessage({message, uid}) {
    console.log(message, uid, 'messagesssss');
    // await this.messageRef.add({
    //   message,
    //   user_id: uid,
    //   created_at: new Date(),
    // });
  }
}
