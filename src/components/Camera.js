import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class Camera extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Camera</Text>
      </View>
    );
  }
}
export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});