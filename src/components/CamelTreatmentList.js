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
import * as ArabicText from '../language/EnglishToArabic';
import AddButton from './AddButton';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Loader from './PleaseWait';
import Header from '../components/Header';
import EmptyComponent from './EmptyComponent';

class CamelTreatmentList extends Component {
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
    // console.log('searchtext366', searchtext);

    if (searchtext != undefined && searchtext?.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state.posts.filter(item => {
        // console.log(item, "itemmm");
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
      // console.log('tempPost8989', tempPost);

      this.setState({filterPosts: tempPost});
    }
  }
  search(text) {
    //console.log("post[0]", this.state.posts[0])

    //console.log("text", text);
    this.setState({searchText: text});
  }
  playVideo(item) {
    // let {filterPosts} = this.state;
    // let index = filterPosts.indexOf(item);
    // console.log('index', index);
    // filterPosts[index].flagForVideo = !filterPosts[index].flagForVideo;
    // this.setState({filterPosts: filterPosts});
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  async viewPosts() {
    const {key} = this.state;
    let {user} = this.props;
    user = user.user.user;
    try {
      return await camelapp
        .post('/get/camel_teatment', {
          user_id: user?.id,
        })
        .then(res => {
          var arrayPosts = res?.data?.Posts;
          arrayPosts.map((item, index) => {
            // console.log('index', index);
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
    console.log("CamelTreatment");
    const {key, searchedItem, posts, filterPosts} = this.state;
    const renderItem = ({item}) => {
      return (
        <Post
          // onUserProfileClick={this.onUserProfileClick}
          item={item}
          image={item.img}
          date={item?.date}
          likes={item?.like_count}
          likeStatus={item?.flagForLike}
          comments={item?.comment_count}
          shares={item?.share_count}
          views={item?.view_count}
          userName={item?.name}
          userCity={item?.user_location}
          title={item?.title}
          userImage={item?.user_images}
          onCommentsClick={() => onCommentsClick(item)}
          category={item?.category_name}
          price={item?.price}
          onLikesClick={(item, setIsLiked, setLikeCount) =>
            onLikesClick(item, setIsLiked, setLikeCount)
          }
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
          imagesArray={item?.imagesArray}
          sharePost={() => sharePosts(item)}
          postViewed={(viewCount, setViewCount) =>
            this.postViewed(item, viewCount, setViewCount)
          }
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
            // console.log('response.data', response.data);
            if (response.data) {
              let filterPosts = this.state.filterPosts;

              let tempIndex = filterPosts.indexOf(item);

              let share_count = item.share_count + 1;
              let tempItem = item;
              tempItem['share_count'] = share_count;
              filterPosts[tempIndex] = tempItem;

              this.setState({loading: false, filterPosts: filterPosts});
              this.viewPosts();
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
    const onCategoryClick = async item => {
      // console.log('====================================');
      // console.log("onCategoryClick");
      // console.log('====================================');
      if (item.category_id == '1') {
        this.props.navigation.navigate('CamelClubList');
      }
      if (item.category_id == '4') {
        this.props.navigation.navigate('CamelTreatmentList');
      }
      if (item.category_id == '3') {
        this.props.navigation.navigate('CamelMissingList');
      }
      if (item.category_id == '2') {
        this.props.navigation.navigate('CamelSellingList');
      }
      if (item.category_id == '6') {
        this.props.navigation.navigate('CamelFoodList');
      }
      if (item.category_id == '8') {
        this.props.navigation.navigate('CamelEquipmentList');
      }
      if (item.category_id == '7') {
        this.props.navigation.navigate('CamelEquipmentList');
      }
      if (item.category_id == '5') {
        this.props.navigation.navigate('CamelMovingList');
      }
      if (item.category_id == '9') {
        this.props.navigation.navigate('CamelMarketingList');
      }

      if (item.category_id == '11') {
        this.props.navigation.navigate('FemaleList');
      }
    };
    const onLikesClick = (item, setIsLiked, setLikeCount) => {
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
            if (response.data.message == 'Successfully liked') {
              setIsLiked(true);
              setLikeCount(response?.data?.total_likes);
            }
            if (response.data.message == 'Successfully Unliked') {
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
      let {user} = this.props;
      user = user.user.user;
      let post_id = item?.id;
      if (user != undefined) {
        this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
          itemFromDetails: item,
        });
        this.postViewed(item, viewCount, setViewCount);
        //   camelapp
        //     .post('/add/view', {
        //       post_id: post_id,
        //       user_id: user?.id,
        //     })
        //     .then(res => {
        //       //console.log("response", res.data);
        //       this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
        //         itemFromDetails: item,
        //       });
        //     });
        // } else {
        //   this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
        //     itemFromDetails: item,
        //   });
      }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate('TreatingCamel');
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
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelTreatmentList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
