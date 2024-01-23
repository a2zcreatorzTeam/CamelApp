import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const PaginationDots = ({ totalItems, activeIndex, onPressDot }) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalItems }, (_, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onPressDot(index)}
                    style={[
                        styles.dot,
                        { backgroundColor: index === activeIndex ? '#D2691Eff' : 'gray', width: index === activeIndex ? 7 : 5, height: index === activeIndex ? 7 : 5 },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        marginTop: 5,
        alignItems: 'center'
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        marginHorizontal: 3,
    },
});

export default PaginationDots;
