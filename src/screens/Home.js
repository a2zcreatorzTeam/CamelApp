import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  LogBox,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Share,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import camelapp from '../api/camelapp';
import {I18nManager} from 'react-native';
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
import {Styles} from '../styles/globlestyle';
import Post from '../components/Post';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Header from '../components/Header';
import Loader from '../components/PleaseWait';
import Ads from '../components/Ads';
import NotFound from '../components/NotFound';

const {width, height} = Dimensions.get('screen');
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      filterPosts: [],
      dataNotFound: false,
      loading: false,
      pauseFlag: true,
      refreshing: false,
      searchText: '',
      counta: 5,
      key: false,
      searchedItem: '',
      viewed: false,
    };
    this.scrollRef = React.createRef();
    this.flatlistRef = React.createRef();
    LogBox.ignoreLogs([
      'Got a component with the name',
      'Please report: Excessive number of pending callbacks: ',
      'Warning: Cannot update during an existing state transition',
      'VirtualizedLists should never be nested inside plain ScrollViews',
    ]);
    this.debouncedSearchHandler = debounce(this.searchHandler, 300);
  }
  componentDidMount() {
    this.viewPosts();
    this.checkUser();
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  // =============NEW Updated Search Handler==============
  searchHandler = value => {
    if (!value?.length) {
      this.setState({filterPosts: this.state.posts});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = this.state.posts.filter(item => {
        const {
          user_name,
          title,
          description,
          user_location,
          user_phone,
          camel_type,
          category_name,
        } = item;
        return (
          user_name?.toLowerCase().includes(value.toLowerCase()) ||
          title?.toLowerCase().includes(value.toLowerCase()) ||
          description?.toLowerCase().includes(value.toLowerCase()) ||
          user_location?.toLowerCase()?.includes(value.toLowerCase()) ||
          camel_type?.toLowerCase()?.includes(value.toLowerCase()) ||
          category_name?.toLowerCase()?.includes(value.toLowerCase()) ||
          user_phone?.includes(value)
        );
      });

      if (filteredData.length > 0) {
        this.setState({filterPosts: filteredData, dataNotFound: false});
      } else {
        this.setState({filterPosts: [], dataNotFound: true});
      }
    }
  };
  // =============NEW Search Handler==============
  search(text) {
    this.setState({searchText: text});
  }
  async viewPosts() {
    const {key} = this.state;
    let {user} = this.props;
    user = user.user.user;
    try {
      return await camelapp
        .post('/view/post', {
          user_id: user?.id,
        })
        .then(res => {
          var arrayPosts = res?.data?.Posts;
          arrayPosts?.map((item, index) => {
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
            loader: false,
            key: !key,
          });
        });
    } catch (error) {
      this.setState({
        posts: [],
        filterPosts: [],
        loader: false,
      });
      console.log('Error Message--- view post', error?.response);
    }
  }
  postViewed = async (item, viewCount, setViewCount) => {
    this.setState({loading: false});
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
          this.setState({loading: false});
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  async checkUser() {
    const userPhone = await AsyncStorage.getItem('@UserPhone');
    const userPass = await AsyncStorage.getItem('@UserPassword');
    try {
      camelapp
        .post('/login', {
          phone: userPhone,
          password: userPass,
        })
        .then(res => {
          let response = res.data;
          if (response.status == true) {
            let {actions} = this.props;
            actions.userData(response);
          } else {
            let {user, actions} = this.props;
            actions.userData({});
            AsyncStorage.removeItem('@UserPhone');
            AsyncStorage.removeItem('@UserPassword');
          }
        })
        .catch(error => {
          console.log('Error Message--- signin', error);
        });
    } catch (error) {
      console.log('Error Message--- signin', error);
    }
  }
  scrollToEnd = () => {
    this.scrollRef.current.scrollToEnd({animated: false});
  };
  playVideo(item) {
    // let {filterPosts} = this.state;
    //   // let index = filterPosts.indexOf(item);
    //   // filterPosts[index].flagForVideo = !filterPosts[index].flagForVideo;
    // this.setState({filterPosts: filterPosts});
  }
  onCategoryClick = async item => {
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
      try {
        await camelapp
          .post('get/competition_details', {
            competition_id: item?.competition_id,
          })
          .then(res => {
            if (res) {
              let temp = res?.data;
              this.props.navigation.navigate('BeautyOfCompetition', {
                competition_item: [temp],
              });
            }
          });
      } catch (error) {
        console.log('Error Message get competition List', error?.response);
      }
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
  onDetailsClick = async (item, viewCount, setViewCount) => {
    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      if (item.category_id == '1') {
        this.props.navigation.navigate('CamelClubDetailsComponent', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '4') {
        this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '3') {
        this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '2') {
        this.props.navigation.navigate('DetailsSellingCamel', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '6') {
        console.log('iddd66666');
        this.props.navigation.navigate('DetailsComponentWithPrice', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '8') {
        console.log('iddd888888');
        this.props.navigation.navigate('DetailsComponentWithPrice', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '5') {
        this.props.navigation.navigate('DetailsMovingCamel', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '9') {
        this.props.navigation.navigate('DetailsMarketingCamel', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '11') {
        this.props.navigation.navigate('DetailsFemaleCamel', {
          itemFromDetails: item,
        });
      } else if (item.category_id == '7') {
        this.props.navigation.navigate('DetailsComponent', {
          itemFromDetails: item,
        });
      }
      this.postViewed(item, viewCount, setViewCount);
    } else {
      if (item.category_id == '1') {
        this.props.navigation.navigate('CamelClubDetailsComponent', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '4') {
        this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '3') {
        this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '2') {
        this.props.navigation.navigate('DetailsSellingCamel', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '6') {
        console.log('id6666');
        this.props.navigation.navigate('DetailsComponentWithPrice', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '8') {
        console.log('id88888');
        this.props.navigation.navigate('DetailsComponentWithPrice', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '5') {
        this.props.navigation.navigate('DetailsMovingCamel', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '9') {
        this.props.navigation.navigate('DetailsMarketingCamel', {
          itemFromDetails: item,
        });
      }

      if (item.category_id == '11') {
        this.props.navigation.navigate('DetailsFemaleCamel', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '7') {
        this.props.navigation.navigate('DetailsComponent', {
          itemFromDetails: item,
        });
      }
    }

    // this.props.navigation.navigate("DetailsComponent", { itemFromDetails: item })
  };
  sharePosts = async item => {
    this.setState({loading: true});

    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      await camelapp
        .post('/add/sharess', {
          user_id: user.id,
          post_id: post_id,
        })
        .then(response => {
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
          console.log('error', error.response);
          this.setState({loading: false});
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  onCommentsClick = async item => {
    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      await camelapp
        .post('/get/comment', {
          post_id: post_id,
        })
        .then(res => {
          this.props.navigation.navigate('Comments', {
            commentsForPost: res,
            user: user,
            post: item,
          });
          this.viewPosts();
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  onLikesClick = async (item, setIsLiked, setLikeCount) => {
    this.setState({loading: false});
    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      await camelapp
        .post('/add/like', {
          user_id: user.id,
          post_id: post_id,
        })
        .then(response => {
          if (response.data.message == 'Successfully liked') {
            setIsLiked(true);
            setLikeCount(response?.data?.total_likes);
            // let filterPosts = this.state.filterPosts;
            // let tempIndex = filterPosts.indexOf(item);
            // let like_count = item?.like_count + 1;
            // let tempItem = item;
            // tempItem['like_count'] = like_count;
            // tempItem['flagForLike'] = true;
            // filterPosts[tempIndex] = tempItem;
            // this.setState({
            //   loading: false,
            //   filterPosts: filterPosts,
            //   key: !key,
            // });
          }
          if (response.data.message == 'Successfully Unliked') {
            setIsLiked(false);
            setLikeCount(response?.data?.total_likes);
            // let filterPosts = this.state.filterPosts;
            // let tempIndex = filterPosts.indexOf(item);
            // let like_count = item.like_count - 1;
            // let tempItem = item;
            // tempItem['like_count'] = like_count;
            // tempItem['flagForLike'] = false;
            // filterPosts[tempIndex] = tempItem;
            // this.setState({
            //   loading: false,
            //   filterPosts: filterPosts,
            //   key: !key,
            // });
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
  onUserProfileClick = async item => {
    this.setState({loading: true});
    let {user} = this.props;

    user = user.user.user;

    if (user != undefined) {
      if (item.user_id === user.id) {
        this.props.navigation.navigate('Profile');
      } else {
        await camelapp
          .post('/userprofile', {
            user_id: item.user_id,
          })
          .then(response => {
            if (response.data) {
              this.props.navigation.navigate('UserProfile', {
                postData: item,
                userProfile: response.data,
              });
              this.setState({loading: false});
            }
          })
          .catch(error => {
            console.log('error', error);
            this.setState({loading: false});
          });
      }
    } else {
      await camelapp
        .post('/userprofile', {
          user_id: item.user_id,
        })
        .then(response => {
          if (response.data) {
            this.props.navigation.navigate('UserProfile', {
              postData: item,
              userProfile: response.data,
            });
            this.setState({loading: false});
          }
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    }
  };
  componentDidMount = () => {
    this.viewPosts();
    // this.focusListener = this.props.navigation.addListener('focus', () => {
    // });
  };
  readMore = n => {
    const {posts} = this.state;
    if (posts?.length) {
      this.setState({
        counta: this.state.counta + n,
      });
    } else {
      this.viewPosts();
    }
  };
  render() {
    const {
      onUserProfileClick,
      onCategoryClick,
      onCommentsClick,
      onDetailsClick,
      onLikesClick,
      playVideo,
      sharePosts,
      postViewed,
    } = this;
    const {key, filterPosts, searchedItem} = this.state;
    const renderItem = ({item}) => {
      return (
        <Post
          item={item}
          onUserProfileClick={onUserProfileClick}
          onCategoryClick={() => onCategoryClick(item)}
          onCommentsClick={onCommentsClick}
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
          onLikesClick={(item, setIsLiked, setLikeCount) =>
            onLikesClick(item, setIsLiked, setLikeCount)
          }
          onTouchStart={playVideo}
          // sharePost={sharePosts}
          sharePost={onShare}
          flagForVideo={false}
          createdDate={item?.created_at?.slice(0, 10)}
          postViewed={(viewCount, setViewCount) =>
            postViewed(item, viewCount, setViewCount)
          }
        />
      );
    };
    const onCamelClubListClick = () => {
      this.props.navigation.navigate('CamelClubList');
    };
    const onCamelTreatingListClick = () => {
      this.props.navigation.navigate('CamelTreatmentList');
    };
    const onCamelFoodListClick = () => {
      this.props.navigation.navigate('CamelFoodList');
    };
    const onCamelSellingListClick = () => {
      this.props.navigation.navigate('CamelSellingList');
    };
    const onCamelMovingListClick = () => {
      this.props.navigation.navigate('CamelMovingList');
    };
    const onCamelEquipmentListClick = () => {
      this.props.navigation.navigate('CamelEquipmentList');
    };
    const onCamelMissingListClick = () => {
      this.props.navigation.navigate('CamelMissingList');
    };
    const onCamelCompetitionListClick = () => {
      this.props.navigation.navigate('CompetitionList');
    };
    const onCamelMarketingListClick = () => {
      this.props.navigation.navigate('CamelMarketingList');
    };
    const onCamelFemaleListClick = () => {
      this.props.navigation.navigate('FemaleList');
    };
    const onNews = () => {
      this.props.navigation.navigate('News');
    };
    const onGroupSurvey = () => {
      this.props.navigation.navigate('SurveyList');
    };
    const onShare = async () => {
      try {
        const result = await Share.share({
          title: 'SHARE POST',
          message: `URL`,
          url: `www.google.com`,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <View style={styles.container}>
        {this.state.loader == true && (
          <>
            <Header
              navRoute="Home"
              onChangeText={text => {
                this.search(text);
              }}
              onPressSearch={() => this.searchHandler(this.state?.searchText)}
            />
            <ActivityIndicator
              size="large"
              color="#D2691Eff"
              animating={this.state.loader}
              style={styles.activityIndicator}
            />
          </>
        )}
        {this.state.loader == false && (
          <>
            <Header
              navRoute="Home"
              onChangeText={text => {
                if (text) {
                  this.search(text);
                } else {
                  this.setState({searchedItem: ''});
                }
              }}
              onPressSearch={() => this.searchHandler(this.state?.searchText)}
            />
            <View
              style={{
                paddingTop: 3,
                height: 90,
                paddingBottom: -15,
                backgroundColor: '#fff',
              }}>
              <ScrollView
                snapToAlignment="end"
                horizontal={true}
                snapToEnd={true}
                ref={this.scrollRef}
                onContentSizeChange={this.scrollToEnd}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  transform: [
                    {
                      rotate: '180deg',
                    },
                  ],
                  // flexDirection: 'row-reverse'
                }}>
                <View
                  style={{
                    width: width,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => onCamelClubListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_839_480.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelTreatingListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/ilaj.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelMissingListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_840_480.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelSellingListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_838.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: width,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => onCamelFoodListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_844_480.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelEquipmentListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_843_480.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelCompetitionListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_845_480.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelMovingListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group_842_480.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: width,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => onCamelMarketingListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/LiveMarketingLogo.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCamelFemaleListClick()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/femaleCamel.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onNews()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/news.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onGroupSurvey()}
                    style={{
                      transform: [
                        {
                          rotate: '180deg',
                        },
                      ],
                      padding: 10,
                    }}>
                    <Image
                      source={require('../../assets/group-survey.png')}
                      style={Styles.HomeTopIcons}></Image>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            {/* POST FLATLIST */}
            <Loader loading={this.state.loading} />
            <FlatList
              scrollsToTop={false}
              key={key}
              data={
                searchedItem
                  ? filterPosts?.slice(0, this.state.counta)
                  : this?.state?.posts?.slice(0, this.state.counta)
              }
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              onEndReachedThreshold={0.5}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              ListFooterComponent={() => {
                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'lightgrey',
                      alignSelf: 'center',
                      padding: 10,
                      marginVertical: 20,
                      borderRadius: 100,
                    }}
                    onPress={() => this.readMore(4)}>
                    <SimpleLineIcons name="reload" size={30} color="white" />
                  </TouchableOpacity>
                );
              }}
              ListHeaderComponent={() => <Ads />}
              contentContainerStyle={{paddingBottom: 80}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
              getItemLayout={(data, index) => ({
                length: height / 2,
                offset: (height / 2) * index,
                index,
              })}
            />
          </>
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: '#eee',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
