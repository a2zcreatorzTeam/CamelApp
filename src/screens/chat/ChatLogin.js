import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class ChatLogin extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>ChatLogin</Text>
      </View>
    );
  }
}
export default ChatLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});