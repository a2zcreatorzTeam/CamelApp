import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {firebase} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    alert: true,
    providesAppNotificationSettings: true,
    badge: true,
  });

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

export const getFCMToken = async () => {
  const token = await AsyncStorage.getItem('fcmToken');
  await firebase.messaging().deleteToken();

  // if (!fcmToken) {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.log('token error===>>', error);
    alert('ERROR', error.message);
    return;
    // return 'null';
  }
  // }
  //  else {
  //   console.log('Old FCM Token===>>', fcmToken);
  //   return fcmToken;
  // // }
};

export const notificationListener = async () => {
  // Background
  handleOnClick = item => {
    console.log('Background Notification===>>', item);
  };
  messaging().onNotificationOpenedApp(remoteMessage => {
    Toast.show({
      text1: remoteMessage?.notification?.body,
      type: 'success',
      visibilityTime: 5000,
      onPress: () => handleOnClick(remoteMessage?.notification),
    });
  });

  // Forground
  messaging().onMessage(async remoteMessage => {
    Toast.show({
      text1: remoteMessage?.notification?.body,
      type: 'success',
      visibilityTime: 5000,
      onPress: () => handleOnClick(remoteMessage?.notification),
    });
  });

  // Quit
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      console.log(remoteMessage, 'remoteMessageee');
      if (remoteMessage) {
        Toast.show({
          text1: remoteMessage?.notification?.body,
          type: 'success',
          visibilityTime: 5000,
          // onPress: () => handleOnClick(remoteMessage?.notification),
        });
        const notification = remoteMessage?.notification;
        handleOnClick(notification);
        console.log('Quit Notification:===>>', notification);
      }
    });
};
