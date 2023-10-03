import firebase from '@react-native-firebase/app';
import React, {Component} from 'react';
import Navigation from './src/components/Navigation';
import SplashScreen from 'react-native-splash-screen';
import {StatusBar, View, LogBox} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import camelapp from './src/api/camelapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from './src/redux/actions/user_actions';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
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
const firebaseConfig = {
  apiKey: 'AIzaSyAguTlA_7WF9OnOR1PUDYAdYb-o3DoHOnU',
  authDomain: 'camelapplication-6fcab.firebaseapp.com',
  projectId: 'camelapplication-6fcab',
  storageBucket: 'camelapplication-6fcab.appspot.com',
  messagingSenderId: '641063387947',
  appId: '1:641063387947:web:88d1a1585dd866a7c1bb6e',
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

  componentDidMount() {
    SplashScreen.hide();
    this.checkUser();
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
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
        <Toast config={toastConfig} />
        <Navigation />
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
