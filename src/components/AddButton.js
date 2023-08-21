import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from "react-native";
import * as ArabicText from "../language/EnglishToArabic";
import { Styles } from '../styles/globlestyle'
const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height


const AddButton = ({ onPress }) => (
    <TouchableOpacity
        style={{
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 20,
            backgroundColor: '#D2691Eff',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center'
        }}
        onPress={onPress}>
        <Text style={[Styles.textbtn, {
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 20,
            paddingRight: 20,
        }]}>{ArabicText.add}</Text>
    </TouchableOpacity>
)
export default AddButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});