import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {firebase} from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    alert: true,
    providesAppNotificationSettings: true,
  });

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

const getFCMToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      console.log('New FCM Token===>>', fcmToken);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('token error===>>', error);
      alert('ERROR', error.message);
      // return 'null';
    }
  } else {
    console.log('Old FCM Token===>>', fcmToken);
    return fcmToken;
  }
};

export const notificationListener = async () => {
  // Background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Background Notification===>>', remoteMessage.notification);
    alert(remoteMessage?.notification?.body)

  });

  // Forground
  messaging().onMessage(async remoteMessage => {
    console.log('Forground Notification===>>', remoteMessage);
    alert(remoteMessage?.notification?.body)
  });

  // Quit
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Quit Notification:===>>', remoteMessage.notification);
      }
    });
};
