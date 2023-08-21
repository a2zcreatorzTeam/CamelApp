import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class MarketingForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>MarketingForm</Text>
      </View>
    );
  }
}
export default MarketingForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});