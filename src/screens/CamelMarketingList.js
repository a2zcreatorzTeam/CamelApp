import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Post from '../components/Post';
import camelapp from '../api/camelapp';
import Loader from '../components/PleaseWait';
import AddButton from '../components/AddButton';
import * as userActions from '../redux/actions/user_actions';
import Header from '../components/Header';
import EmptyComponent from '../components/EmptyComponent';

class CamelMarketingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
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
    if (searchtext != undefined && searchtext?.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state?.posts.filter(item => {
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
    this.setState({searchText: text});
  }
  async viewPosts() {
    const {key} = this.state;
    let {user} = this.props;
    user = user?.user?.user;
    try {
      return await camelapp
        .post('/get/marketing', {
          user_id: user?.id,
        })
        .then(res => {
          var arrayPosts = res?.data?.Posts;
          arrayPosts.map((item, index) => {
            console.log('index', index);
            let array = item?.img;
            let imagesArray = [];
            array[0] !== '' &&
              array?.forEach(element => {
                imagesArray?.push({type: 'image', source: element});
              });
            item?.video !== null &&
              imagesArray?.push({type: 'video', source: item?.video});
            item['imagesArray'] = imagesArray;
            arrayPosts[index] = item;
          });

          this.setState({
            posts: arrayPosts,
            filterPosts: arrayPosts,
            key: !key,
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
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.viewPosts();
    });
  };
  postViewed = async (item, viewCount, setViewCount) => {
    let {user} = this.props;
    user = user?.user?.user;
    let post_id = item?.id;
    if (user != undefined) {
      await camelapp
        .post('/add/view', {
          user_id: user?.id,
          post_id: post_id,
        })
        .then(response => {
          if (response?.data?.message !== 'Already Viewed') {
            setViewCount(viewCount + 1);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    let {user} = this.props;
    user = user.user.user;
    const {
      key,
      searchedItem,
      posts,
      filterPosts,
      loader,
      loading,
      searchText,
      refreshing,
    } = this.state;
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
          onLikesClick={(item, setIsLiked, setLikeCount) =>
            onLikesClick(item, setIsLiked, setLikeCount)
          }
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
          imagesArray={item?.imagesArray}
          createdDate={item?.created_at?.slice(0, 10)}
          sharePost={() => sharePosts(item)}
          postViewed={(viewCount, setViewCount) =>
            this.postViewed(item, viewCount, setViewCount)
          }
        />
      );
    };
    const onCommentsClick = item => {
      let post_id = item.id;
      if (user != undefined) {
        camelapp
          .post('/get/comment', {
            post_id: post_id,
          })
          .then(res => {
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
      this.setState({loading: true});
      let post_id = item.id;
      if (user != undefined) {
        camelapp
          .post('/add/sharess', {
            user_id: user?.id,
            post_id: post_id,
          })
          .then(response => {
            if (response.data) {
              let filterPosts = this.state.filterPosts;
              this.viewPosts();
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
    const onLikesClick = (item, setIsLiked, setLikeCount) => {
      this.setState({loading: false});
      let post_id = item.id;
      if (user != undefined) {
        camelapp
          .post('/add/like', {
            user_id: user.id,
            post_id: post_id,
            type: 'abc',
          })
          .then(response => {
            if (response?.data?.message == 'Successfully liked') {
              setIsLiked(true);
              setLikeCount(response?.data?.total_likes);
            }
            if (response?.data?.message == 'Successfully Unliked') {
              setIsLiked(false);
              setLikeCount(response?.data?.total_likes);
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
    const onDetailsClick = (item, viewCount, setViewCount) => {
      if (user != undefined) {
        this.props.navigation.navigate('DetailsMarketingCamel', {
          itemFromDetails: item,
        });
        this.postViewed(item, viewCount, setViewCount);
      } else {
        this.props.navigation.navigate('DetailsMarketingCamel', {
          itemFromDetails: item,
        });
      }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate('LiveMarketingForm');
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
              this.setState({searchedItem: '', searchText: ''});
            }
          }}
          onPressSearch={() => this.searchFunction(searchText)}
        />
        {loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={loader}
            style={{marginTop: 20}}
          />
        )}
        {loader == false && (
          <View>
            <AddButton onPress={() => onAddButtonClick()} />
            <Loader loading={loading} />
            <FlatList
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelMarketingList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
