import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class ChatList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>ChatList</Text>
      </View>
    );
  }
}
export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});