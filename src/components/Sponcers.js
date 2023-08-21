import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet, FlatList, ActivityIndicator, Dimensions
} from "react-native";
import Item from "./SponserItem";
import camelapp from "../api/camelapp";

const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height

class Sponser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,

    };

    this.viewPosts();
  }


  async viewPosts() {

    try {

      return await camelapp
        .get(
          "/getSponsars"
        )
        .then((response) => {
          this.setState({
            posts: response.data.data,
            loader: false
          });

        });
    } catch (error) {
      //console.log("Error Message camel club List", error.response);
    }
  }

  render() {

    const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          name={item.name}
          address={item.address}
          userImage={item.image}
          phone={item.phone}
        />
      )
    }
    return (
      <View style={[styles.container, { backgroundColor: 'white' }]}>

        <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} />

        {this.state.loader == false &&
          <View>


            <FlatList
              data={this.state.posts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              initialNumToRender={5}
              maxToRenderPerBatch={5}

            />
          </View>
        }
      </View>
    );
  }
}
export default Sponser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: hight,
    // backgroundColor: 'red'
  }
});