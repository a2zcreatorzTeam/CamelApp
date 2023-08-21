import React, { Component, useState } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Styles } from '../styles/globlestyle'
import { Card } from 'react-native-paper';
import Footer from '../components/Footer.js'
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ArabicText from '../language/EnglishToArabic';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import camelapp from "../api/camelapp";
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import { bindActionCreators } from 'redux';
import { DataContext, getChatMessages } from "../context/DataContext"

class MessageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isLoading: true,
            inputValue: "",
            reciever_id: props.route.params.messageData.id,
        }
        // setInterval(() => {


        //     this.getChatMessages();
        //     //console.log("---");

        // }, 5000)

    }

    componentDidMount() {
        // this.interval =
        //     setInterval(() => {


        //         this.getChatMessages();

        //     }, 5000)
        //console.log("props.route.params.messageData.sender_id", this.props.route.params.messageData.id);
        this.getChatMessages();
    }
    componentWillUnmount() {
        clearInterval(this.interval);

    }

    getChatMessages = async () => {
        let { user } = this.props;

        //console.log("user", user.user.user);

        let sender_id = user.user.user.id;

        let reciever_id = this.props.route.params.messageData.id;

        await camelapp.get("/getmsgchat/" + sender_id + '/' + reciever_id).then((response) => {
            //console.log("response getChatMessages", response.data);

            this.setState({ dataSource: response.data })

        })

    }



    _renderItem = ({ item, index }) => {
        let { user } = this.props;

        let sender_id = user.user.user.id;

        //console.log("item", item)
        return (


            item.sender_id == sender_id ?

                <Card style={Styles.text_send}>
                    <Text style={{ color: '#fff', textAlign: 'right', fontSize: 14 }}>{item.message}</Text>
                    <Text style={{ color: 'black', fontSize: 10 }}>{item.created_at}</Text>
                </Card>
                :
                <Card style={Styles.text_send_right}>
                    <Text style={{ color: '#d2691e', fontSize: 14 }}>{item.message}</Text>
                    <Text style={{ color: 'gray', textAlign: 'right', fontSize: 10 }}>{item.created_at}</Text>
                </Card>


        )
    }

    sendMessage = () => {
        let { user } = this.props;

        //console.log("user", user.user.user);

        let sender_id = user.user.user.id;

        let reciever_id = this.props.route.params.messageData.id;


        if (this.state.inputValue != "") {

            camelapp.post("/sendmsg",
                {
                    sender_id: sender_id,
                    reciever_id: reciever_id,
                    message: this.state.inputValue
                }
            ).then((response) => {
                //console.log('send message response', response);

                this.setState({ inputValue: "" });
                this.getChatMessages();
            })


        }

    }

    render() {



        return (



            <View
                //style={Styles.containerMessageView}
                style={{ flex: 1,width:width,height:hight }}
            >
                
                <FlatList
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    
                />


                <View style={Styles.msgbar}>


                    <TouchableOpacity style={{ left: 5, position: 'absolute', bottom: 0, marginRight: 10 }}>
                        <Feather name="send" size={30} color="#D2691E" style={{
                            left: 5,
                            position: 'absolute', bottom: 7, marginTop: 40,
                            transform: [{ rotate: '225deg', }]
                        }}
                            onPress={() => this.sendMessage()}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={Styles.msginput}
                        placeholder={ArabicText.message}
                        placeholderTextColor="#b0b0b0"
                        onChangeText={(text) => this.setState({ inputValue: text })}
                        value={this.state.inputValue}
                    ></TextInput>



                </View>

            </View>


        )
    }
}


const mapStateToProps = state => ({

    user: state.user

});

const ActionCreators = Object.assign(
    {},
    userActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageView);






