import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Post from './MovingPost';
import camelapp from '../api/camelapp';

import AddButton from './AddButton';
import * as ArabicText from '../language/EnglishToArabic';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';

import Header from './Header';

class CamelMovingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      filterPosts: [],
      searchText: '',
      playVideo: false,
      refreshing: false,
      searchedItem: '',
      key: false,
    };

    this.viewPosts();
  }

  search(text) {
    //console.log("post[0]", this.state.posts[0])

    //console.log("text", text);
    this.setState({searchText: text});
  }

  searchFunction(searchtext) {
    const {key} = this.state;
    if (searchtext != undefined && searchtext.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state?.posts.filter(item => {
        return (
          item?.id == this.searchtext ||
          item?.title?.toLowerCase()?.indexOf(searchtext?.toLowerCase()) > -1 ||
          item?.user_location
            ?.toLowerCase()
            .indexOf(searchtext?.toLowerCase()) > -1 ||
          item?.price?.toLowerCase()?.indexOf(searchtext?.toLowerCase()) > -1 ||
          item?.type?.toLowerCase()?.indexOf(searchtext?.toLowerCase()) > -1
        );
      });
      console.log('tempPost.length--camelmoving', tempPost.length);

      this.setState({filterPosts: tempPost, key: !key});
    }
  }

  async viewPosts() {
    try {
      return await camelapp.get('/get/camelmove').then(res => {
        console.log('RESPONSE API_____', res.data.Posts);
        this.setState({
          posts: res.data.Posts,
          loader: false,
          filterPosts: res.data.Posts,
        });
      });
    } catch (error) {
      //console.log("Error Message camel Moving List", error.response);
    }
  }

  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.viewPosts();
    });
  };
  render() {
    const {key, filterPosts, searchedItem} = this.state;
    const renderItem = ({item}) => {
      console.log('item Camel Moving ==>', item);

      return (
        <Post
          date={item?.date}
          item={item}
          title={item?.title}
          type={item?.car_type}
          price={item?.price}
          location={item.user_location}
          color={item?.color}
          image={item?.img[0]}
          detailBUTTON={ArabicText.PLACEHOLDER_DETAIL}
          OnDetailsClick={() => onDetailsClick(item)}
        />
      );
    };

    const onDetailsClick = item => {
      let {user} = this.props;
      user = user.user.user;
      let post_id = item?.id;
      if (user != undefined) {
        camelapp
          .post('/add/view', {
            post_id: post_id,
            user_id: user?.id,
          })
          .then(res => {
            //console.log("response", res.data);
            this.props.navigation.navigate('DetailsMovingCamel', {
              itemFromDetails: item,
            });
          });
      } else {
        this.props.navigation.navigate('DetailsMovingCamel', {
          itemFromDetails: item,
        });
      }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate('MovingCamelForm');
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    return (
      <View style={styles.container}>
        <Header
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: ''});
            }
          }}
          onPressSearch={() => this.searchFunction(this.state.searchText)}
        />

        {this.state.loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={this.state.loader}
            style={{marginTop: 20}}
          />
        )}

        {this.state.loader == false && (
          <View>
            <AddButton onPress={() => onAddButtonClick()} />
            <FlatList
              key={key}
              contentContainerStyle={{paddingBottom: '20%'}}
              data={searchedItem ? filterPosts : this.state?.posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
              initialNumToRender={5}
              maxToRenderPerBatch={5}
            />
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
});

const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CamelMovingList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
