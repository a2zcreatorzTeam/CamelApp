import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, FlatList, ActivityIndicator, RefreshControl
} from "react-native";
import camelapp from "../api/camelapp";
import Ads from "../components/Ads";
import NewsPost from "../components/NewsPost";


class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: {},
            loader: true,
            refreshing: false,
        };

        this.viewPosts();
    }


    async viewPosts() {

        try {

            return await camelapp
                .get(
                    "/get/news"
                )
                .then((res) => {


                    this.setState({
                        posts: res.data.news,
                        loader: false
                    });

                });
        } catch (error) {
            //console.log("Error Message News List", error);
        }
    }

    ScrollToRefresh() {
        this.viewPosts()
        this.setState({ refreshing: false });
    }

    render() {
console.log('=============NEWS POSTS=======================');
console.log(this.state.posts);
console.log('====================================');
        const onItemClick = (item) => {

            try {

                this.props.navigation.navigate("ViewNews", { newsItem: item })
            } catch (error) {
                //console.log("news item", error)
            }
        }
        const renderItem = ({ item }) => {
            return (

                <NewsPost
                    item={item}
                    titleOfArticle={item?.title}
                    date={item?.date}
                    userName={item?.user?.name}
                    userProfile={item?.user?.image}

                    image={item?.image}
                    rating={item?.rating_count}
                    onItemClick={() => onItemClick(item)}
                />
            );
        }
        return (
            <View style={styles.container}>

                <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} />

                {this.state.loader == false &&
                    <View>
                        <Ads />
                        <FlatList
                        // inverted
                            data={this.state.posts}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this.ScrollToRefresh()}
                                />}

                            initialNumToRender={5}
                            maxToRenderPerBatch={5}
                        />
                    </View>
                }
            </View>
        );
    }
}
export default News;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});