import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class ImagePick extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>ImagePick</Text>
            </View>
        );
    }
}
export default ImagePick;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});