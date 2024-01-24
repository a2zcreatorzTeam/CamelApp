import React from "react";
import { Text, StyleSheet } from "react-native";
import { family } from "../constants/Family";

const CustomText = ({ text, style, ...props }) => {
    return (
        <Text style={[styles.customText, { fontFamily: family.Neo_Regular }, style]} {...props}>
            {text}
        </Text>
    );
};

const styles = StyleSheet.create({
    customText: {
        // Define your default text styles here
        // For example: fontSize, color, textAlign, etc.
    },
});

export default CustomText;
