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
import EmptyComponent from './EmptyComponent';
import AddButton from './AddButton';
import * as ArabicText from '../language/EnglishToArabic';
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
          item?.user_name?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.name?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.title?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.user_location
            ?.toLowerCase()
            ?.includes(searchtext.toLowerCase()) ||
          item?.price?.toLowerCase()?.includes(searchtext.toLowerCase()) ||
          item?.type?.toLowerCase()?.includes(searchtext.toLowerCase())
        );
      });
      this.setState({filterPosts: tempPost, key: !key});
    }
  }
  async viewPosts() {
    const {key} = this.state;
    const user = this.props?.user;
    userData = user?.user?.user;
    try {
      return await camelapp
        .post('/get/camelmove', {
          user_id: userData?.id,
        })
        .then(res => {
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
  componentWillUnmount() {
    this.focusListener();
  }
  render() {
    const {key, filterPosts, searchedItem} = this.state;
    const renderItem = ({item}) => {
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
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
        />
      );
    };
    const onDetailsClick = (item, viewCount, setViewCount) => {
      let {user} = this.props;
      user = user.user.user;
      let post_id = item?.id;
      if (user != undefined) {
        this.props.navigation.navigate('DetailsMovingCamel', {
          itemFromDetails: item,
        });
        //   camelapp
        //     .post('/add/view', {
        //       post_id: post_id,
        //       user_id: user?.id,
        //     })
        //     .then(res => {
        //       //console.log("response", res.data);
        //       this.props.navigation.navigate('DetailsMovingCamel', {
        //         itemFromDetails: item,
        //       });
        //     });
        // } else {
        //   this.props.navigation.navigate('DetailsMovingCamel', {
        //     itemFromDetails: item,
        //   });
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
            console.log(text, 'texttttt');
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: '', searchText: ''});
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
              ListEmptyComponent={() => <EmptyComponent />}
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
