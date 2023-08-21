import React, { Component } from "react";
import {
    StyleSheet, FlatList, ActivityIndicator, View, TouchableOpacity, Image, Text, Dimensions, RefreshControl
} from "react-native";
import camelapp from "../api/camelapp";
// import Item from '../components/CompetitonListItem'
import { Styles } from '../styles/globlestyle'

import * as ArabicText from "../language/EnglishToArabic"

import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import { bindActionCreators } from 'redux';
import Ads from "../components/Ads";
const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
class CamelClubList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: {},
            loader: true,
            refreshing: false

        };

        this.viewPosts();
    }

    ScrollToRefresh() {
        this.viewPosts()
        this.setState({ refreshing: false });

    }

    async viewPosts() {

        try {

            return await camelapp
                .get(
                    "/get/competition"
                )
                .then((res) => {

                    //console.log("res", res.data.status)
                    this.setState({
                        posts: res.data.status,
                        loader: false
                    });

                });
        } catch (error) {
            //console.log("Error Message get competition List", error);
        }
    }

    render() {

        const onItemClick = async (item) => {
            //console.log("item.id", item.id);

            try {
                await camelapp.post(
                    "get/competition_details",
                    {
                        competition_id: item.id
                    }
                )
                    .then((res) => {

                        if (res) {
                            // //console.log("response at competitionItem", res.data)


                            let temp = res.data;
                            this.props.navigation.navigate('BeautyOfCompetition', { competition_item: temp })
                        }


                    });
            } catch (error) {
                //console.log("Error Message get competition List", error);
            }

        }


        const Item = ({ name,
            start_date,
            end_date,
            onItemClick,
            image
        }) => (
            <View style={{
                backgroundColor: "#fff",
                alignSelf:'center',
                justifyContent:'space-evenly',
                flex:1,
                marginHorizontal:this.state.loader==false? 3 :0, 
                marginVertical:this.state.loader==false? 3 :0,
                elevation:0.5
            }}>
                <TouchableOpacity
                    onPress={onItemClick}
                    style={{ padding: 10, justifyContent: "center", alignItems: "center",alignSelf:"center" }}
                >

                    <Image
                        source={{
                            uri: "https:www.tasdeertech.com/images/competition/" + image
                        }}
                        style={Styles.BeautyImages}
                        resizeMode='cover'></Image>

                    <View
                        style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text
                        numberOfLines={2}
                        style={{
                            height:40,
                            alignSelf:'center',
                            color: "black", textAlign: 'right', fontWeight: '600', fontSize: 14, 
                        }}>{name}</Text>
                        {/* <Text style={{ textAlign: 'right', fontWeight: '600', fontSize: 14 }}> {ArabicText.Title} </Text> */}
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={{ color: "black", textAlign: 'right', fontWeight: '600', fontSize: 12 }}>{start_date} : </Text>
                        <Text style={{ textAlign: 'right', color: "black", fontWeight: 'bold', fontSize: 12 }}>{ArabicText.Start_Date}</Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={{ color: "black", textAlign: 'right', fontWeight: '600', fontSize: 12 }}>{end_date} : </Text>
                        <Text style={{ textAlign: 'right', color: "black", fontWeight: 'bold', fontSize: 12 }}>{ArabicText.End_Date}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );

        const renderItem = ({ item }) => {
            // console.log(item, 'competition item')
            return (
                <Item
                    item={item}
                    name={item.name}
                    start_date={item.start_date}
                    end_date={item.end_date}
                    onItemClick={() => onItemClick(item)}
                    image={item.image}
                />
            );
        }

        return (
            <View style={styles.container}>

                {this.state.loader && <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} style={{ marginTop: 20 , marginHorizontal:0, marginVertical:0 }} />}

                {this.state.loader == false &&

                    <FlatList
                        data={this.state.posts}
                        renderItem={renderItem}
                        contentContainerStyle={{alignSelf:'center', justifyContent:'center'}}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        initialNumToRender={5}
                        maxToRenderPerBatch={5}
                        ListHeaderComponentStyle={{alignSelf:'center'}}
                        ListHeaderComponent={() => <Ads />}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.ScrollToRefresh()}
                            />
                        }

                    />

                }
            </View>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelClubList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#eee'
    }
});