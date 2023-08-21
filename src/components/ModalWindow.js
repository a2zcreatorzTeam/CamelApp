import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class ModalWindow extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>ModalWindow</Text>
      </View>
    );
  }
}
export default ModalWindow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});