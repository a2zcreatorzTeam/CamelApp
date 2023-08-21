import React from "react";
import { Text, View, Image, TouchableOpacity } from 'react-native';

import * as ArabicText from "../language/EnglishToArabic";

export const Item = ({ name,
    start_date,
    end_date,
    onItemClick,
    image
}) => (
    <View>
        <TouchableOpacity
            onPress={onItemClick}
            style={{ padding: 10 }}
        >
            <View>
                <Image
                    source={{
                        uri: "https:www.tasdeertech.com/images/competition/" + image
                    }}
                    style={Styles.BeautyImages}
                    resizeMode='cover'></Image>
            </View>
            <View
                style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <Text 
                style={{
                    textAlign: 'right', fontWeight: 'bold', fontSize: 14
                }}> {name}</Text>
            </View>
            <View
                style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 12 }}> {end_date}</Text>
            </View>
            <View
                style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 12 }}> {start_date}</Text>
            </View>
        </TouchableOpacity>
    </View>
);
