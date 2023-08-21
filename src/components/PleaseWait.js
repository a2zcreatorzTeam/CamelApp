import React from "react";
import {
    View,

    StyleSheet,
    ActivityIndicator, Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { Styles } from "../styles/globlestyle";

const Loader = ({ loading }) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={loading}

    >
        <TouchableWithoutFeedback>

            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <ActivityIndicator size="large" color='#D2691Eff' animating={loading} style={{ marginTop: 20 }} />
                </View>
            </View>

        </TouchableWithoutFeedback>
    </Modal>
)
export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});