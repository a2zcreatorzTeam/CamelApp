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

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Remote debugger']);

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
          console.log('===============home=================');
          console.log(res?.data);
          console.log('====================================');
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
