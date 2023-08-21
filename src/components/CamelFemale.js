import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class CamelFemale extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>CamelFemale</Text>
      </View>
    );
  }
}
export default CamelFemale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});