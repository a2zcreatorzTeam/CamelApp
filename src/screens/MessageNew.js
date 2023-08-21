import React, { Component, useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Styles } from '../styles/globlestyle'
import { Card } from 'react-native-paper';
import Footer from '../components/Footer.js'
import  Feather  from 'react-native-vector-icons/Feather';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';

import { DataContext, getChatMessages } from "../context/DataContext"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, } from 'react-native-paper';
// import * as ImagePicker from 'expo-image-picker';
class MessageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reciever_id: props.route.params.messageData.id,

            isLoading: true,
            inputValue: "",
            image: null,
        }

        //console.log("props", props.route.params.messageData)
    }


    componentDidMount() {
        AsyncStorage.getItem("user").then((response) => {

            if (response != null) {


                // props.navigation.navigate("Home");
            }
            else {

                this.props.navigation.navigate("Login");
            }

        });
    }


    sendMessage(sendMessage, user_id) {

        if (this.state.inputValue != "") {

            sendMessage(user_id, this.state.reciever_id, this.state.inputValue);
            this.setState({inputValue: ""})
        }
    }


    render() {

        return (


            <DataContext.Consumer>
                {(context) => (
                    <View style={Styles.container}>


                        <View style={Styles.msgbar}>
                            <Feather
                                name="send"
                                size={28}
                                color="#D2691E"
                                style={{ 
                                    transform: [{ rotate: '-125deg'}],
                                    left: 10,
                                    position: 'absolute',

                                }}


                                onPress={() => this.sendMessage(context.sendMessage, context.data.profile.user.id)}
                            />


                            <TextInput
                                style={Styles.msginput}
                                placeholder=" Type Message"
                                onChangeText={(text) => this.setState({ inputValue: text })}
                                value={this.state.inputValue}
                            // left={<TextInput.Icon name={'attachment'} size={28} color={'#D2691E'} onPress={this._pickImage} />}
                            ></TextInput>
                        </View>
                    </View>

                )
                }
            </DataContext.Consumer >

        )
    }
}
export default MessageView
