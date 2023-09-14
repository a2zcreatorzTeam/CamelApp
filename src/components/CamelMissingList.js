import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Post from './Post';
import camelapp from '../api/camelapp';
import Loader from './PleaseWait';
import AddButton from './AddButton';
import Header from '../components/Header';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
class CamelFoodList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      loading: false,
      filterPosts: [],
      searchText: '',
      refreshing: false,
      key: false,
      searchedItem: '',
    };

    this.viewPosts();
  }
  searchFunction(searchtext) {
    if (searchtext != undefined && searchtext.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state.posts.filter(item => {
        return (
          item?.user_name?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.name?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.title?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.description?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.user_location
            ?.toLowerCase()
            ?.includes(searchtext.toLowerCase()) ||
          item?.camel_type?.toLowerCase()?.includes(searchtext.toLowerCase()) ||
          item?.category_name
            ?.toLowerCase()
            ?.includes(searchtext.toLowerCase()) ||
          item?.user_phone?.includes(searchtext)
        );
      });
      if (tempPost?.length > 0) {
        this.setState({filterPosts: tempPost});
      } else {
        this.setState({filterPosts: []});
      }
    }
  }
  search(text) {
    //console.log("post[0]", this.state.posts[0])

    //console.log("text", text);
    this.setState({searchText: text});
  }
  playVideo(item) {
    let {filterPosts} = this.state;

    let index = filterPosts.indexOf(item);

    console.log('index', index);

    filterPosts[index].flagForVideo = !filterPosts[index].flagForVideo;

    this.setState({filterPosts: filterPosts});
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  async viewPosts() {
    try {
      return await camelapp.get('/get/camel_missing').then(res => {
        var arrayPosts = res?.data?.Posts;

        arrayPosts.map((item, index) => {
          console.log('index', index);
          let array = item?.img;
          let imagesArray = [];
          array?.forEach(element => {
            imagesArray?.push({type: 'image', source: element});
          });
          imagesArray?.push({type: 'video', source: item?.video});
          item['imagesArray'] = imagesArray;

          arrayPosts[index] = item;
        });

        this.setState({
          posts: arrayPosts,
          // filterPosts: arrayPosts,
          loader: false,
        });
      });
    } catch (error) {
      this.setState({
        posts: [],
        filterPosts: [],
        loader: false,
      });
      console.log('Error Message--- view post', error);
    }
  }
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.viewPosts();
    });
  };
  render() {
    const {key, searchedItem, posts, filterPosts} = this.state;
    const renderItem = ({item}) => {
      return (
        <Post
          item={item}
          image={item.img}
          likes={item.like_count}
          likeStatus={item?.flagForLike}
          comments={item.comment_count}
          shares={item.share_count}
          views={item.view_count}
          userName={item.name}
          userCity={item.user_location}
          title={item.title}
          userImage={item.user_images}
          onCommentsClick={() => onCommentsClick(item)}
          category={item.category_name}
          price={item.price}
          onLikesClick={() => onLikesClick(item)}
          onDetailsClick={() => onDetailsClick(item)}
          imagesArray={item?.imagesArray}
          date={item?.date}
          sharePost={() => sharePosts(item)}
          onTouchStart={() => this.playVideo(item)}
          playVideo={true}
          pauseFlag={item?.flagForVideo}
          onCategoryClick={() => console.log('first')}
        />
      );
    };
    const onCommentsClick = item => {
      let {user} = this.props;
      user = user.user.user;
      let post_id = item.id;
      if (user != undefined) {
        camelapp
          .post('/get/comment', {
            post_id: post_id,
          })
          .then(res => {
            //console.log("response", res.data);
            this.props.navigation.navigate('Comments', {
              commentsForPost: res,
              user: user,
              post: item,
            });
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    const sharePosts = item => {
      console.log('working');

      this.setState({loading: true});

      let {user} = this.props;
      user = user.user.user;
      let post_id = item.id;
      if (user != undefined) {
        camelapp
          .post('/add/sharess', {
            user_id: user.id,
            post_id: post_id,
          })
          .then(response => {
            console.log('response.data', response.data);
            if (response.data) {
              this.viewPosts();

              let filterPosts = this.state.filterPosts;

              let tempIndex = filterPosts.indexOf(item);

              let share_count = item.share_count + 1;
              let tempItem = item;
              tempItem['share_count'] = share_count;
              filterPosts[tempIndex] = tempItem;

              this.setState({loading: false, filterPosts: filterPosts});
            }
          })
          .catch(error => {
            console.log('error', error);
            this.setState({loading: false});
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    const onLikesClick = item => {
      const {key} = this.state;
      this.setState({loading: false});
      let {user} = this.props;
      user = user.user.user;
      let post_id = item.id;
      if (user != undefined) {
        camelapp
          .post('/add/like', {
            user_id: user.id,
            post_id: post_id,
            type: 'abc',
          })
          .then(response => {
            console.log('response.data', response.data);
            if (response.data.status == true) {
              let filterPosts = this.state.filterPosts;
              let tempIndex = filterPosts.indexOf(item);
              let like_count = item.like_count + 1;
              let tempItem = item;
              tempItem['like_count'] = like_count;
              tempItem['flagForLike'] = true;
              filterPosts[tempIndex] = tempItem;
              this.setState({
                loading: false,
                filterPosts: filterPosts,
                key: !key,
              });
              // alert(ArabicText.Succesfully_liked);
            }
            if (response.data.status == false) {
              let filterPosts = this.state.filterPosts;
              let tempIndex = filterPosts.indexOf(item);
              let like_count = item.like_count - 1;
              let tempItem = item;
              tempItem['like_count'] = like_count;
              tempItem['flagForLike'] = false;
              filterPosts[tempIndex] = tempItem;
              this.setState({
                loading: false,
                filterPosts: filterPosts,
                key: !key,
              });
              // alert(ArabicText.Successfully_Unliked);
            }
            // this.viewPosts();
          })
          .catch(error => {
            console.log('error', error);
            this.setState({loading: false});
          });
      } else {
        this.props.navigation.navigate('Login');
      }
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
            this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
              itemFromDetails: item,
            });
          });
      } else {
        this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
          itemFromDetails: item,
        });
      }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate('MissingCamelForm');
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
            <Loader loading={this.state.loading} />
            <FlatList
              key={key}
              data={searchedItem ? filterPosts : posts}
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
            <View style={{marginBottom: 70}}></View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelFoodList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
