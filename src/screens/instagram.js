import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import InstagramLogin from 'react-native-instagram-login';
// import CookieManager from 'react-native-cookies';

export default class InstagramScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  setIgToken = data => {
    this.setState({token: data.access_token});
    this.props.navigation?.navigate('CreateProfile', {screen: 'socialLogin'});
  };
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={{}} onPress={() => this.instagramLogin.show()}>
          <Text style={{color: 'white', textAlign: 'center'}}>Login now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{marginTop: 10, backgroundColor: 'green'}]}
          onPress={() => {
            this.onClear();
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>Logout</Text>
        </TouchableOpacity>
        <Text style={{margin: 10}}>Token: {this.state.token}</Text>
        {this.state.failure && (
          <View>
            <Text style={{margin: 10}}>
              failure: {JSON.stringify(this.state.failure)}
            </Text>
          </View>
        )}
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          appId="1337858990436785"
          appSecret="7515c4a451f66cc42943205054700db2"
          redirectUrl="https://com.alsyahd.camel/redirect"
          incognito={false}
          // scopes={['user_profile', 'user_media']}
          scopes={['user_profile', 'user_email']}
          onLoginSuccess={this.setIgToken}
          onLoginFailure={data => console.log(data)}
          language="en" //default is 'en' for english
        />
      </View>
    );
  }
}
