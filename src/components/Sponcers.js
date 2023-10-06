import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Item from './SponserItem';
import camelapp from '../api/camelapp';
import Header from './Header';
import EmptyComponent from './EmptyComponent';

const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

class Sponser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      filterPosts: [],
      searchedItem: '',
      searchText: '',
      key: false,
    };
    this.viewPosts();
  }
  async viewPosts() {
    const {key} = this.state;
    try {
      return await camelapp.get('/getSponsars').then(response => {
        this.setState({
          posts: response.data.data,
          loader: false,
          key: !key,
        });
      });
    } catch (error) {
      //console.log("Error Message camel club List", error.response);
    }
  }
  // =============NEW Updated Search Handler==============
  searchHandler = value => {
    const {posts, key} = this.state;
    if (!value?.length) {
      this.setState({filterPosts: this.state.posts});
    } else {
      this.setState({searchedItem: value});
      const filteredData = posts.filter(item => {
        const {name, address, phone} = item;
        return (
          name?.toLowerCase().includes(value.toLowerCase()) ||
          address?.toLowerCase().includes(value.toLowerCase()) ||
          phone?.toLowerCase().includes(value.toLowerCase())
        );
      });
      if (filteredData?.length > 0) {
        this.setState({filterPosts: filteredData, key: !key});
      } else {
        this.setState({filterPosts: [], key: !key});
      }
    }
  };
  // =============NEW Search Handler==============
  search(text) {
    this.setState({searchText: text});
  }

  render() {
    const {posts, filterPosts, key, searchedItem} = this.state;
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          name={item.name}
          address={item.address}
          userImage={item.image}
          phone={item.phone}
        />
      );
    };
    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Header
          navRoute="Sponcers"
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchText: '', searchedItem: ''});
            }
          }}
          onPressSearch={() => this.searchHandler(this.state.searchText)}
        />
        <ActivityIndicator
          size="large"
          color="#D2691Eff"
          animating={this.state.loader}
        />
        {this.state.loader == false && (
          <FlatList
            ListEmptyComponent={() => <EmptyComponent />}
            key={key}
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1, paddingBottom: width * 0.09}}
            data={searchedItem ? filterPosts : posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
          />
        )}
      </View>
    );
  }
}
export default Sponser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    // height: hight,
    // backgroundColor: 'red'
  },
});
