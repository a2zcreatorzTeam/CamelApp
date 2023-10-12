import firebase from '@react-native-firebase/app';
import React, {Component} from 'react';
import Navigation from './src/components/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {StatusBar, View, LogBox, Text, Dimensions, Modal} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import camelapp from './src/api/camelapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from './src/redux/actions/user_actions';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import firebaseConfig from './src/components/firebase';
import {getStorage} from 'firebase/storage';
import {notificationListener} from './src/services/Helper';
// import codePush from "react-native-code-push";
const width = Dimensions.get('window');

// import codePush from 'react-native-code-push';

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
  async checkUser() {
    const userPhone = await AsyncStorage.getItem('@UserPhone');
    const userPass = await AsyncStorage.getItem('@UserPassword');
    try {
      camelapp
        .post('/login', {
          phone: userPhone,
          password: userPass,
        })
        .then(res => {
          let response = res?.data;
          if (response.status == true) {
            let {actions} = this.props;
            actions.userData(response);
          } else {
            let {user, actions} = this.props;
            actions.userData({});

            AsyncStorage.removeItem('@UserPhone');
            AsyncStorage.removeItem('@UserPassword');
          }
        })
        .catch(error => {
          console.log('Error Message--- signin', error);
        });
    } catch (error) {
      console.log('Error Message--- signin', error);
    }
  }
  // syncImmediate() {
  //   this.setState({ updateProcess: true });
  //   codePush?.sync(
  //     {
  //       installMode: codePush?.InstallMode.IMMEDIATE,
  //       updateDialog: {
  //         appendReleaseDescription: false,
  //         optionalIgnoreButtonLabel: "Close",
  //         optionalInstallButtonLabel: "Install",
  //         optionalUpdateMessage: "New update available. Install update",
  //         title: "Update Required",
  //       },
  //     },
  //     this.codePushStatusDidChange.bind(this),
  //     this.codePushDownloadDidProgress.bind(this)
  //   );
  // }
  // codePushDownloadDidProgress(progress) {
  //   console.log(progress);
  //   const downloaded = Math.round(
  //     (progress?.receivedBytes / progress?.totalBytes) * 100
  //   );
  //   console.log("downloaded", downloaded);
  //   this.setState({ progress, downloading: true, downloaded: downloaded });
  // }
  // codePushStatusDidChange(syncStatus) {
  //   switch (syncStatus) {
  //     case codePush.SyncStatus.CHECKING_FOR_UPDATE:
  //       setTimeout(() => {
  //         this.setState({ syncMessage: "Checking For Update" });
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.DOWNLOADING_PACKAGE:
  //       // alert("Please wait few minutes while the update is installed")
  //       setTimeout(() => {
  //         this.setState({
  //           update: true,
  //           syncMessage: "Downloading updates",
  //           downloading: true,
  //         });
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.AWAITING_USER_ACTION:
  //       setTimeout(() => {
  //         this.setState({
  //           syncMessage: "Waiting for user action to accept",
  //           downloading: true,
  //         });
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.INSTALLING_UPDATE:
  //       setTimeout(() => {
  //         this.setState({
  //           syncMessage: "Kindly wait, update is being install",
  //           downloading: true,
  //         });
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.UP_TO_DATE:
  //       setTimeout(() => {
  //         this.setState({
  //           syncMessage: "Your app is upto-date",
  //           updateProcess: false,
  //           downloading: false,
  //         });
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.UPDATE_IGNORED:
  //       setTimeout(() => {
  //         this.setState({ syncMessage: "User ignored the update" }, () => {
  //           BackHandler.exitApp();
  //         });
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.UPDATE_INSTALLED:
  //       setTimeout(() => {
  //         this.setState(
  //           {
  //             syncMessage: "Your application is updated now",
  //             updateProcess: false,
  //             update: false,
  //           },
  //           () => {
  //             codePush.restartApp();
  //           }
  //         );
  //       }, 100);
  //       break;
  //     case codePush.SyncStatus.UNKNOWN_ERROR:
  //       // setTimeout(() => {
  //       //   this.setState({ syncMessage: "There is an unknown error" });
  //       // }, 100);
  //       break;
  //   }
  // }
  componentDidMount() {
    notificationListener();
    // this.syncImmediate();

    SplashScreen.hide();
    this.checkUser();
    let app;
    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig);
      const storage = getStorage(app);
    } else {
      app = firebase.app();
    }
  }
  render() {
    const backgroundStyle = {
      backgroundColor: Colors.darker,
      flex: 1,
    };

    return (
      // <View style={[backgroundStyle, {backgroundColor: '#fff'}]}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="default"
          backgroundColor="#d2691e"
          // backgroundColor={backgroundStyle.backgroundColor}
        />
        <Navigation />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
      // </View>
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
