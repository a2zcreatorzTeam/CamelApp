import firebase from '@react-native-firebase/app';
import React, {Component} from 'react';
import Navigation from './src/components/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {
  StatusBar,
  LogBox,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  View,
  Text
} from 'react-native';
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
import codePush from 'react-native-code-push';
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
  constructor() {
    super();
    this.state = {
      updateProcess: false,
    };
  }
  // CODE PUSH FUNCTIONS
  syncImmediate = () => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          appendReleaseDescription: false,
          optionalIgnoreButtonLabel: 'Close',
          optionalInstallButtonLabel: 'Install',
          optionalUpdateMessage: 'New update available. Install update',
          title: 'Update Required',
        },
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  };
  codePushDownloadDidProgress = progress => {
    this.setState({updateProcess: true});
    const downloaded = Math.round(
      (progress?.receivedBytes / progress?.totalBytes) * 100,
    );
    console.log('downloaded', downloaded);
    // this.setState({progress, downloading: true, downloaded: downloaded});
  };
  codePushStatusDidChange = syncStatus => {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('==================CHECKING_FOR_UPDATE==================');
        console.log(codePush.SyncStatus.CHECKING_FOR_UPDATE);
        console.log('====================================');
        // setTimeout(() => {
        //   this.setState({syncMessage: 'Checking For Update'});
        // }, 100);
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        // alert("Please wait few minutes while the update is installed")
        // setTimeout(() => {
        //   this.setState({
        //     update: true,
        //     syncMessage: 'Downloading updates',
        //     downloading: true,
        //   });
        // }, 100);
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        // setTimeout(() => {
        //   this.setState({
        //     syncMessage: 'Waiting for user action to accept',
        //     downloading: false,
        //   });
        // }, 100);
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('================INSTALLING_UPDATE====================');
        console.log(codePush.SyncStatus.INSTALLING_UPDATE);
        console.log('====================================');
        // setTimeout(() => {
        //   this.setState({
        //     syncMessage: 'Kindly wait, update is being install',
        //     downloading: true,
        //   });
        // }, 100);
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('=================UP_TO_DATE===================');
        console.log(codePush.SyncStatus.UP_TO_DATE);
        console.log('====================================');
        this.setState({updateProcess: false});

        // setTimeout(() => {
        //   this.setState({
        //     syncMessage: 'Your app is upto-date',
        //     updateProcess: false,
        //     downloading: false,
        //   });
        // }, 100);
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        this.setState({updateProcess: false});
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({updateProcess: false});
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({updateProcess: false});
        break;
    }
  };

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
    this.syncImmediate();
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
        {this.state.updateProcess ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              flex: 1,
            }}>
            <ActivityIndicator />
            <Text 
            
            style={{
              color:'black', fontSize:20
            }}
            >App is Updating, Please Wait ...</Text>
          </View>
        ) : (
          <Navigation />
        )}
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
