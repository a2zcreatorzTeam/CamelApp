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
import Loader from './PleaseWait';
import Header from '../components/Header';
class CamelFemaleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      filterPosts: [],
      searchText: '',
      refreshing: false,
      searchedItem: '',
    };
    this.viewPosts();
  }

  searchFunction(searchtext) {
    console.log('searchtext', searchtext);
    if (searchtext != undefined && searchtext.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state.posts.filter(item => {
        return (
          item.user_name.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.name.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.user_phone.toLowerCase().indexOf(searchtext) > -1 ||
          item.id == this.searchtext ||
          item.title.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.location.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.camel_type.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.category_name.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.user_phone.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.description.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.camel_type.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.camel_type.toLowerCase().indexOf(searchtext.toLowerCase()) > -1
        );
      });
      console.log('tempPost.length--femaleList', tempPost.length);

      this.setState({filterPosts: tempPost});
    }
  }
  search(text) {
    //console.log("post[0]", this.state.posts[0])

    //console.log("text", text);
    this.setState({searchText: text});
  }
  async viewPosts() {
    const {key} = this.state;
    let {user} = this.props;
    user = user.user.user;
    try {
      return await camelapp
        .post('/get/camel_female', {
          user_id: user?.id,
        })
        .then(res => {
          console.log('res', res.data.Posts);
          this.setState({
            posts: res.data.Posts,
            loader: false,
            filterPosts: res.data.Posts,
            key: !key,
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
    const {filterPosts, posts, searchedItem, key} = this.state;
    console.log('=====================this.state.femaleListtt===============');
    console.log(this.state.filterPosts);
    console.log('====================================');
    const renderItem = ({item}) => {
      return (
        <Post
          date={item?.date}
          item={item}
          title={item.title}
          location={item.location}
          color={item.color}
          type={item.camel_type}
          image={item.img[0]}
          detailBUTTON={ArabicText.PLACEHOLDER_DETAIL}
          onDetailsClick={(viewCount, setViewCount) => {
            console.log('workingggg');
            onDetailsClick(item, viewCount, setViewCount);
          }}
        />
      );
    };
    const onDetailsClick = (item, viewCount, setViewCount) => {
      console.log('detaillssss');
      let {user} = this.props;
      user = user.user.user;
      let post_id = item?.id;
      console.log(user, 'usererer');
      if (user != undefined) {
        this.props.navigation.navigate('DetailsFemaleCamel', {
          itemFromDetails: item,
        });

        //   camelapp
        //     .post('/add/view', {
        //       post_id: post_id,
        //       user_id: user?.id,
        //     })
        //     .then(res => {
        //       //console.log("response", res.data);
        //       this.props.navigation.navigate('DetailsFemaleCamel', {
        //         itemFromDetails: item,
        //       });
        //     });
        // } else {
        //   this.props.navigation.navigate('DetailsFemaleCamel', {
        //     itemFromDetails: item,
        //   });
      }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate('CamelFemale');
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
              this.setState({searchedItem: '', searchText:""});
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
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelFemaleList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
