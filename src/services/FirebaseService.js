import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

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

const sendMessage = async (
  user_id,
  inputValue,
  chatRoomId,
  lat,
  long,
  image,
  video,
) => {
  let imageUrl;
  let videoUrl;
  // if (image) {
  //   const imageFileName = `${Date.now()}.png`; // You can generate a unique filename
  //   const imageRef = storage().ref(`chat_images/${imageFileName}`);
  //   await imageRef.putFile(image);
  //   imageUrl = await imageRef.getDownloadURL();
  // }
  if (video) {
    const videoFileName = `${Date.now()}.mp4`; // You can generate a unique filename
    const videoRef = firebase.storage().ref(`chat_videos/${videoFileName}`);
    await videoRef.putFile(video);
    videoUrl = await videoRef.getDownloadURL();
  }
  console.log(imageUrl, 'umageurlll');

  const newMessage = {
    sender: user_id,
    text: inputValue,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    date: new Date(),
  };
  const locationObj = {
    sender: user_id,
    latitude: lat,
    longitude: long,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    date: new Date(),
  };
  const ImageObj = {
    sender: user_id,
    imageUrl: image, // Add the image URL
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    date: new Date(),
  };
  const videoObj = {
    sender: user_id,
    videoUrl: videoUrl, // Add the image URL
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    date: new Date(),
  };
  console.log(
    image,
    lat && long ? locationObj : newMessage,
    'lat && long ? locationObj : newMessage',
  );
  const messagesRef = firebase
    .firestore()
    .collection(`chats/${chatRoomId}/messages`);
  return messagesRef
    .add(lat && long ? locationObj : image ? ImageObj : newMessage)
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
