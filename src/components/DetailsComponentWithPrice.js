import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    Text,
    TouchableOpacity, Modal,
    Pressable
} from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Styles } from '../styles/globlestyle'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import * as ArabicText from "../language/EnglishToArabic"
const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height
class DetailsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {

            itemFromDetails: props.route.params.itemFromDetails,
            user: {
                "id": this.props.route.params.itemFromDetails.user_id,
                "name": this.props.route.params.itemFromDetails.user_name,
                "image": this.props.route.params.itemFromDetails.user_images,
                "whatsapp_status": this.props.route.params.itemFromDetails.user_whatsapp_status,
                "whatsapp_no": this.props.route.params.itemFromDetails.user_chat_status,
            },
            flagForBid: false,
            modalOffer: false,
            pauseVideo: true,

            price: 0
        }

        //console.log("itemFromDetails", this.state.itemFromDetails);
    }


    componentDidMount() {
        if (this.props.route.params.itemFromDetails.price_type != "FIX") {

            this.setState({ flagForBid: true })
        }
    }

    sendMessage() {
        let { user } = this.props;
        if (user.user.user != undefined) {
            if (user?.user?.user?.id != this.state?.itemFromDetails?.user_id) {
                if (this.state.itemFromDetails.user_chat_status == true || this.state.itemFromDetails.user_chat_status == "1") {
                    this.props.navigation.navigate("MessageViewScreen",
                        { messageData: this.state.user });
                } else {
                    alert("This user has disabled chat")
                }
            }
            else {
                alert("This is your post")
            }
        } else {
            this.props.navigation.navigate('Login');
        }
    }

    placeBid(placeBid, checkBid, user_id,) {

        //console.log("user_id", user_id)
        //console.log("post _data", parseInt(this.props.route.params.itemFromDetails.id))
        if (parseInt(this.state.price) > parseInt(this.props.route.params.itemFromDetails.price)) {

            if (user_id != this.props.route.params.itemFromDetails.user_id) {

                //console.log("this.state.itemFromDetails.id", this.state.itemFromDetails.id)
                checkBid(user_id, this.state.itemFromDetails.id).then((response) => {

                    //console.log("response check bid", response)

                    if (response.status == "Not Exists") {

                        placeBid(user_id,
                            this.props.route.params.itemFromDetails.id,
                            parseInt(this.state.price)).then((response) => {

                                if (response.status == true) {
                                    alert(response.message);
                                    this.setState({ modalOffer: false })
                                } else {
                                    alert("Error in adding bid!")
                                }
                            })

                    } else {

                        alert("Bid already exists")
                    }

                    //console.log("price", this.state.price)
                })


            } else {

                alert(ArabicText.You_can_not_Place_bid_on_your_price + "")
            }

        } else {
            alert(ArabicText.Offer_can_not_be_less_than_base_price + "")
        }
    }
    render() {



        return (

            <ScrollView style={{ backgroundColor: "#ffff" }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingHorizontal: 20, marginTop: 15 }}>

                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ color: "#000", fontSize: 20, fontWeight: "700", marginRight: 20 }}>
                            {this.state.itemFromDetails.name}</Text>
                        <Text style={{ color: "#000", fontSize: 14, marginRight: 20 }}>
                            {this.state.itemFromDetails.user_location}</Text>
                    </View>


                    <View style={{ height: 63, width: 63, borderRadius: 50, backgroundColor: "#f3f3f3", justifyContent: "center", alignItems: "center" }}>
                        <Image source={{ uri: "http://www.tasdeertech.com/images/profiles/" + this.state.itemFromDetails.user_images }}
                            style={{ height: 55, width: 55, resizeMode: "center", borderRadius: 50 }} />
                    </View>
                </View>
                <View style={Styles.containerDetails}>
                    <Image
                        source={{
                            uri: "http://www.tasdeertech.com/images/posts/" + this.state.itemFromDetails.img[0]
                        }}
                        style={Styles.image}
                    >
                    </Image>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={Styles.textHeadingg}>{ArabicText.Title}</Text>
                        <TextInput
                            value={this.state.itemFromDetails.title}
                            style={Styles.forminputsDetails}
                            placeholder={this.state.itemFromDetails.title}
                            editable={false}
                        >
                        </TextInput>

                        <Text style={Styles.textHeadingg}>{ArabicText.Color}</Text>
                        <TextInput
                            value={this.state.itemFromDetails.color}
                            style={Styles.forminputsDetails}
                            placeholder={this.state.itemFromDetails.color}
                            editable={false}
                        >
                        </TextInput>

                        <Text style={Styles.textHeadingg}>{ArabicText.camel}</Text>
                        <TextInput
                            value={this.state.itemFromDetails.camel_type}
                            style={Styles.forminputsDetails}
                            placeholder={this.state.itemFromDetails.camel_type}
                            editable={false}
                        >
                        </TextInput>
                        <Text style={Styles.textHeadingg}>{ArabicText.Location}</Text>
                        <TextInput
                            value={this.state.itemFromDetails.location}
                            style={Styles.forminputsDetails}
                            placeholder={this.state.itemFromDetails.location}
                            editable={false}
                        >
                        </TextInput>



                        <Text style={Styles.textHeadingg}>{ArabicText.Payment_Types}</Text>
                        <TextInput
                            value={this.state.itemFromDetails.price_type}
                            style={Styles.forminputsDetails}
                            placeholder={this.state.itemFromDetails.price_type}
                            editable={false}
                        >
                        </TextInput>

                        <Text style={Styles.textHeadingg}>{ArabicText.Description}</Text>
                        <TextInput
                            value={this.state.itemFromDetails.description}
                            style={Styles.inputdecrp}
                            placeholder={this.state.itemFromDetails.description}
                            editable={false}
                        >
                        </TextInput>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalOffer}

                    >
                        <View style={Styles.centeredView}>
                            <View style={Styles.modalView}>
                                <Pressable onPress={(modalOffer) => this.setState({ modalOffer: !modalOffer })}>
                                    <Ionicons name="close" size={30}
                                        color="brown"
                                    // style={{ marginLeft: width - 140 }}
                                    />
                                </Pressable>
                                <Text style={{ margin: 5 }}>{ArabicText.offer_Up}</Text>


                                <TextInput
                                    value={this.state.price}
                                    style={Styles.forminputsPrice}
                                    placeholder="0.0"
                                    onChangeText={(text) => this.setState({ price: text })}
                                    placeholderTextColor="#b0b0b0"


                                ></TextInput>

                                <TouchableOpacity onPress={() => this.placeBid(context.placeBid, context.checkBid, context.data.profile.user.id)}>

                                    <View style={Styles.btnform}><Text style={Styles.textbtn}>{ArabicText.offer_Up}</Text></View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>

                    {this.state.flagForBid &&
                        <TouchableOpacity
                            style={{ marginBottom: 20, marginTop: 20 }}

                            onPress={() => this.setState({ modalOffer: true })}
                        >
                            <View style={Styles.btnform}><Text style={Styles.textbtn}>{ArabicText.MyBids}</Text></View>
                        </TouchableOpacity>
                    }
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity onPress={() => this.sendMessage()} style={{ justifyContent: "center", alignItems: "center", margin: 8 }}>
                            <Feather name="send" size={30} color="#CD853F" />
                            <Text style={Styles.fontDetails}>{ArabicText.message}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", margin: 8 }}>
                            <Feather name="message-square" size={30} color="#CD853F" />
                            <Text style={Styles.fontDetails}>{ArabicText.comments}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", margin: 8 }} >
                            <FontAwesome name="whatsapp" size={30} color="#CD853F" />
                            <Text style={Styles.fontDetails}>واتساب</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", margin: 8 }}>
                            <AntDesign name="mobile1" size={30} color="#CD853F" />
                            <Text style={Styles.fontDetails}>{ArabicText.phone}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView >


        );
    }
}
export default DetailsComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});