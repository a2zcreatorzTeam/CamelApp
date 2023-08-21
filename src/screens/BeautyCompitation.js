import React from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Styles } from '../styles/globlestyle'
import  Feather  from 'react-native-vector-icons/Feather';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';

import { useNavigation } from '@react-navigation/native';
const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height
export default function App() {
    const navigation = useNavigation()

    return (
        <View style={Styles.container}>

            <View style={Styles.top}>
                <TouchableOpacity>
                    <View style={Styles.topbtn}>
                        <Text style={{ color: '#fff', fontWeight: '400' }}>الجوالز</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={Styles.topbtnn}>
                        <Text style={{ color: '#cd853f', fontWeight: '400' }}>طريقة الاشتراك</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={Styles.topbtnn}>
                        <Text style={{ color: '#cd853f', fontWeight: '400' }}>شروط عامة</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={Styles.underTop}>
                <Text style={{ color: '#cd853f', fontWeight: 'bold', fontSize: 18 }}>الراعي الرسمي للمسابقة</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Winner')}>
                        <View style={Styles.underTopview}></View>
                    </TouchableOpacity>

                    <View style={Styles.underTopview}></View>
                </View>
            </View>
            <View style={Styles.bottombtnn}>
                <Text style={{ color: '#cd853f', fontWeight: '400' }}>
                    للمشاركة اضغط هنا
                </Text>
            </View>
            <SafeAreaView>
                <View style={{ flexDirection: 'row' }}>

                    <View style={Styles.Beautycard}>
                        <Image source={require('../../assets/camel.png')} style={{ width: width / 2, height: hight / 4.5, borderRadius: 15, margin: 10 }}></Image>
                        <View style={Styles.likeicon}>
                            <TouchableOpacity style={{ left: 10, position: 'absolute' }}>
                                <FontAwesome name="comments-o" size={18} color="#cd853f" />
                            </TouchableOpacity>
                            <Text style={{ left: 30, position: 'absolute' }}>0</Text>
                            <TouchableOpacity style={{ left: 45, position: 'absolute' }}>
                                <AntDesign name="hearto" size={18} color="#cd853f" />
                            </TouchableOpacity>
                            <Text style={{ left: 70, position: 'absolute' }}>0</Text>
                        </View>
                    </View>
                    <View style={Styles.Beautycard}>
                        <Image source={require('../../assets/camel.png')} style={{ width: width / 2, height: hight / 4.5, borderRadius: 15, margin: 10 }}></Image>
                        <View style={Styles.likeicon}>
                            <TouchableOpacity style={{ left: 10, position: 'absolute' }}>
                                <FontAwesome name="comments-o" size={18} color="#cd853f" />
                            </TouchableOpacity>
                            <Text style={{ left: 30, position: 'absolute' }}>0</Text>
                            <TouchableOpacity style={{ left: 45, position: 'absolute' }}>
                                <AntDesign name="hearto" size={18} color="#cd853f" />
                            </TouchableOpacity>
                            <Text style={{ left: 70, position: 'absolute' }}>0</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}
