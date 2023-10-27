import firebase from '@react-native-firebase/app';
import React, {Component} from 'react';
import Navigation from './src/components/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {StatusBar, LogBox, Platform, PermissionsAndroid} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import camelapp from './src/api/camelapp';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from './src/redux/actions/user_actions';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import firebaseConfig from './src/components/firebase';
import {getStorage} from 'firebase/storage';
import {notificationListener} from './src/services/Helper';
import DeviceInfo from 'react-native-device-info';
LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Remote debugger']);
const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      text1NumberOfLines={5}
      style={{
        borderLeftColor: 'green',
        maxHeight: 120,
        height: '100%',
        paddingVertical: 20,
      }}
      text1Style={{
        fontSize: 14,
        color: 'black',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1NumberOfLines={5}
      style={{
        borderLeftColor: 'red',
        maxHeight: 120,
        height: '100%',
        paddingVertical: 20,
      }}
      text1Style={{
        fontSize: 14,
        color: 'black',
      }}
    />
  ),
};
class App extends Component {
  takePermission = async () => {
    // NO NEED TO ASK PERMISSION FOR LESS THAN 33 APILEVEL
    if (Platform.OS == 'android' && DeviceInfo.getApiLevelSync() >= 33) {
      if (Platform.OS == 'android') {
        try {
          const granted = await PermissionsAndroid?.request(
            PermissionsAndroid?.PERMISSIONS?.POST_NOTIFICATION,
          );
          console.log(granted, 'grantedd');
          if (granted === PermissionsAndroid?.RESULTS?.GRANTED) {
          } else {
          }
        } catch (err) {}
      }
    }
  };
  componentDidMount() {
    this.takePermission();
    notificationListener();
    SplashScreen.hide();
    let app;
    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig);
      const storage = getStorage(app);
    } else {
      app = firebase.app();
    }
  }
  render() {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="default" backgroundColor="#d2691e" />
        <Navigation />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
