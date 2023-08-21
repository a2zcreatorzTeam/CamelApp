import React, {Component} from 'react';
import {
  View,
  Image,
  LogBox,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import camelapp from '../api/camelapp';
import {I18nManager} from 'react-native';
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
import {Styles} from '../styles/globlestyle';
import Item from '../components/Post';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
const width = Dimensions.get('screen').width;
import Header from '../components/Header';
import Loader from '../components/PleaseWait';
import Ads from '../components/Ads';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      filterPosts: [],
      loading: false,
      pauseFlag: true,
      refreshing: false,
      searchText: '',
    };
    this.scrollRef = React.createRef();
    LogBox.ignoreLogs([
      'Got a component with the name',
      'Please report: Excessive number of pending callbacks: ',
      'Warning: Cannot update during an existing state transition',
      'VirtualizedLists should never be nested inside plain ScrollViews',
    ]);
  }

  componentDidMount() {
    this.viewPosts();
    this.checkUser();
  }

  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  searchFunction(searchtext) {
    if (searchtext != undefined && searchtext.length != 0) {
      let tempPost = this.state.posts?.filter(item => {
        return (
          item.user_name.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
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

      this.setState({filterPosts: tempPost});
    }
  }

  search(text) {
    this.setState({searchText: text});
  }

  async viewPosts() {
    try {
      return await camelapp.get('/view/post').then(res => {
        var arrayPosts = res?.data?.Posts;

        arrayPosts.map((item, index) => {
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
    let {filterPosts} = this.state;

    let index = filterPosts.indexOf(item);

    console.log('index', index);

    filterPosts[index].flagForVideo = !filterPosts[index].flagForVideo;

    this.setState({filterPosts: filterPosts});
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
  onDetailsClick = async item => {
    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      await camelapp
        .post('/add/view', {
          user_id: user.id,
          post_id: post_id
        })
        .then(response => {
          console.log('response.data', response.data);
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
            this.props.navigation.navigate('DetailsComponentWithPrice', {
              itemFromDetails: item,
            });
          }
          if (item.category_id == '8') {
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
        })
        .catch(error => {
          console.log('error', error);
        });
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
        this.props.navigation.navigate('DetailsComponentWithPrice', {
          itemFromDetails: item,
        });
      }
      if (item.category_id == '8') {
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
          console.log('response.data', response.data);
          if (response.data) {
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
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  onLikesClick = async item => {
    this.setState({loading: false});

    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      await camelapp
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

            this.setState({loading: false, filterPosts: filterPosts});
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

            this.setState({loading: false, filterPosts: filterPosts});
            // alert(ArabicText.Successfully_Unliked);
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
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.viewPosts();
    });
  };
  render() {
    const renderItem = ({item}) => {
      return (
        <Item
          price={item?.price}
          item={item}
          title={item?.title}
          date={item?.date}
          image={item?.image}
          likes={item?.like_count}
          likeStatus={item?.flagForLike}
          description={item?.description}
          comments={item?.comment_count}
          shares={item?.share_count}
          views={item?.view_count}
          userName={item?.name}
          userCity={item?.user_location}
          userImage={item?.user_images}
          imagesArray={item?.imagesArray}
          category={item?.category_name}
          onCommentsClick={() => this.onCommentsClick(item)}
          onDetailsClick={() => this.onDetailsClick(item)}
          onLikesClick={() => this.onLikesClick(item)}
          onUserProfileClick={() => this.onUserProfileClick(item)}
          onCategoryClick={() => this.onCategoryClick(item)}
          sharePost={() => this.sharePosts(item)}
          onTouchStart={() => this.playVideo(item)}
          playVideo={false}
          pauseFlag={item?.flagForVideo}
          lastBidPrice={item?.lastBidPrice}
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

    return (
      <View style={styles.container}>
        {this.state.loader == true && (
          <>
            <Header
              navRoute="Home"
              onChangeText={text => {
                this.search(text);
              }}
              onPressSearch={() => this.searchFunction(this.state.searchText)}
            />
            <ActivityIndicator
              size="large"
              color="#D2691Eff"
              animating={this.state.loader}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
              }}
            />
          </>
        )}

        {this.state.loader == false && (
          <>
            <Header
              navRoute="Home"
              onChangeText={text => {
                this.search(text);
              }}
              onPressSearch={() => this.searchFunction(this.state.searchText)}
            />

            <View style={{paddingTop: 3, height: 90, paddingBottom: -15}}>
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
              data={this?.state?.filterPosts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{paddingBottom: 160}}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              ListHeaderComponent={() => <Ads />}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
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
    // height: height,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
