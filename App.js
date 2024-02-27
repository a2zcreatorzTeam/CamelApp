/* eslint-disable react-native/no-inline-styles */
// appcenter codepush release-react -a a2zcreatorzz-gmail.com/Camel -d Staging
// appcenter codepush release-react -a a2zcreatorzz-gmail.com/Camel_Ios -d Staging
import firebase from '@react-native-firebase/app';
import React, {Component} from 'react';
import Navigation from './src/routes/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {
  StatusBar,
  LogBox,
  Platform,
  PermissionsAndroid,
  View,
  Text,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from './src/redux/actions/user_actions';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import firebaseConfig from './src/components/firebase';
import {getStorage} from 'firebase/storage';
import {notificationListener, requestUserPermission} from './src/services/Helper';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';
import {ProgressBar} from 'react-native-paper';
import {family} from './src/constants/Family';
import * as ArabicText from './src/language/EnglishToArabic';

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Remote debugger']);
const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      text1NumberOfLines={1}
      contentContainerStyle
      style={{
        maxHeight: 120,
        height: '100%',
        paddingVertical: 20,
        borderRightColor: 'green',
        borderRightWidth: 5,
        borderLeftWidth: 0,
        flexDirection: 'row',
      }}
      text1Style={{
        fontSize: 14,
        color: 'black',
        textAlign: 'right',
        writingDirection: 'rtl',
        fontFamily: family.Neo_Regular,
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
        textAlign: 'right',
        writingDirection: 'rtl',
        fontFamily: family.Neo_Regular,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1NumberOfLines={5}
      style={{
        maxHeight: 120,
        height: '100%',
        paddingVertical: 20,
        borderRightColor: 'red',
        borderRightWidth: 5,
        borderLeftWidth: 0,
      }}
      text1Style={{
        fontSize: 14,
        color: 'black',
        textAlign: 'right',
        fontFamily: family.Neo_Regular,
      }}
    />
  ),
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      updateProcess: false,
      downloaded: 0,
    };
  }
  componentDidMount() {
    requestUserPermission()
    this.syncImmediate();
    this.takePermission();
    notificationListener();
    SplashScreen.hide();
    let app;
    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig);
      console.log(app, 'apppppppp');
      const storage = getStorage(app);
    } else {
      app = firebase.app();
      console.log(app, 'apppp');
    }
  }
  // CODE PUSH FUNCTIONS
  syncImmediate = async () => {
    const update = await codePush.checkForUpdate();
    if (update) {
      codePush.sync(
        {
          installMode: codePush.InstallMode.IMMEDIATE,
          updateDialog: {
            appendReleaseDescription: false,
            optionalIgnoreButtonLabel: 'Cancel',
            optionalInstallButtonLabel: 'Install',
            optionalUpdateMessage: 'New update available. Install update',
            title: 'Update Required',
            modal: false,
          },
        },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this),
      );
    } else {
      console.log('elseee');
    }
  };
  codePushDownloadDidProgress = progress => {
    this.setState({updateProcess: true});
    const downloaded = Math.round(
      (progress?.receivedBytes / progress?.totalBytes) * 100,
    );
    this.setState({downloaded: downloaded});
    console.log('downloaded', downloaded);
    // this.setState({progress, downloading: true, downloaded: downloaded});
  };
  codePushStatusDidChange = syncStatus => {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('==================CHECKING_FOR_UPDATE==================');
        console.log(codePush.SyncStatus);
        console.log('====================================');
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

  render() {
    return (
      <SafeAreaProvider>
        {/* <StatusBar barStyle="default" backgroundColor="#d2691e" /> */}
        <StatusBar
          hidden={false}
          backgroundColor="#d2691e"
          // translucent={true}
        />
        {this.state.updateProcess ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              flex: 1,
            }}>
            {/* <ActivityIndicator /> */}
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: family.Neo_Regular,
              }}>
              {ArabicText.AppisUpdatingPleaseWait}
            </Text>

            <View
              style={{
                width: '100%',
                marginBottom: 40,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  alignSelf: 'center',
                  marginVertical: 10,
                  fontFamily: family.Neo_Regular,
                }}>
                {this.state.downloaded}%
              </Text>
              <ProgressBar
                progress={0.01 * this.state.downloaded}
                color="#61CE70"
                style={{
                  height: 30,
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  backgroundColor: '#EBECED',
                }}
              />
            </View>
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
