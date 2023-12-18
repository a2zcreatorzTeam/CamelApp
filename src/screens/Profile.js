import React, {Component, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  TextInput,
  Switch,
  RefreshControl,
  Share,
  Platform,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ArabicText from '../language/EnglishToArabic';
import {Dimensions} from 'react-native';
import {Card} from 'react-native-paper';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import {Rating} from 'react-native-ratings';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import Loader from '../components/PleaseWait';
import OTPTextInput from 'react-native-otp-textinput';
import Header from '../components/Header';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  VideoBaseUrl,
  imageBaseUrl,
  profileBaseUrl,
  thumbnailBaseUrl,
} from '../constants/urls';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalFollowing: false,
      rating: 0,
      loader: false,
      whatsappNumber: '',
      phoneNumber: '',
      otpValue: '',
      registerSwitch: false,
      phoneStatusSwitch: false,
      updateLoader: false,
      chatFlag: props?.user?.user?.user?.chat_status == 0 ? false : true,
      modalChat: false,
      loading: false,
      modalPhone: false,
      modalOtp: false,
      refreshing: false,
      posts: [],
      pausedCheck: false,
      key: false,
      searchText: '',
      searchedItem: '',
      filterPosts: [],
    };
  }
  // ==========NEW============
  checkUserLogedIn() {
    const {user} = this.props;
    if (user?.user?.user) {
      this.fetchUser();
    } else {
      // console.log("helooo");
      // this.props.navigation?.navigate('OtpForgetPassword');
    }
  }
  saveChat() {
    let {user, actions} = this.props;
    user = user?.user?.user;
    try {
      camelapp
        .post('/add/chat/' + user?.id, {
          chat_status: this?.state?.chatFlag == true ? 1 : 0,
        })
        .then(res => {
          this.setState({modalChat: false});
        });
    } catch (error) {
      //console.log("error at fetch user", error.response)
    }
  }
  saveWhatsApp() {
    let {user, actions} = this.props;
    user = user?.user?.user;
    //console.log("this.state.registerSwitch", this.state.registerSwitch)
    if (this.state?.whatsappNumber?.length == 10) {
      try {
        camelapp
          .post('/add/whatsapp/' + user.id, {
            whatsapp_no: this.state.whatsappNumber,
            whatsapp_status: this.state.registerSwitch,
          })
          .then(res => {
            this.setState({modal: false});
            //console.log("response at fetch", res.data);
          });
      } catch (error) {
        //console.log("error at fetch user", error.response)
      }
    } else {
      Toast.show({
        text1: ArabicText?.InvalidNumber,
        type: 'error',
        visibilityTime: 3000,
      });
      // alert('Invalid Number');
    }
  }
  updateNumber = async () => {
    const deviceToken = await AsyncStorage?.getItem('fcmToken');
    this.setState({updateLoader: true});
    if (this.props.user?.user?.user?.phone !== this.state.phoneNumber) {
      let {user, actions} = this.props;
      user = user?.user?.user;
      camelapp
        .post('/reset/otp', {
          phone: this.props.user?.user?.user?.phone,
        })
        .then(res => {
          if (res) {
            this.setState({updateLoader: false});
            let tempSignUpObj = {
              newphone: this.state.phoneNumber,
              phone: this.props.user?.user?.user?.phone,
              screenType: 'update',
              id: this.props.user?.user?.user?.id,
            };
            Toast.show({
              text1: ArabicText?.otphasbeensenttoyourphonenumber,
              type: 'success',
              visibilityTime: 3000,
            });
            this.props.navigation.navigate('OtpSignUp', {
              sign_up: tempSignUpObj,
            });
            this.setState({loader: false, btnPressed: false});
          }
        })
        .catch(error => {
          this.setState({updateLoader: false});
          console.log(error, 'errroro');
          this.setState({loader: false, btnPressed: false});
        });
    } else {
      console.log('helllloooooo');
      let {user, actions} = this.props;
      user = user?.user?.user;
      camelapp
        .post('/update', {
          user_id: this.props?.user?.user?.user.id,
          phone_status:
            this.state?.phoneStatusSwitch == true ? 'True' : 'False',
        })
        .then(res => {
          // console.log('res number3232', res.data);
          this.setState({updateLoader: false});

          if (res?.data?.status == true) {
            actions.userData(res.data);
            this.setState({modalOtp: false, modalPhone: false});
            Toast.show({
              text1: ArabicText?.PhoneUpdatedSuccessfully,
              type: 'success',
              visibilityTime: 3000,
            });
            // alert('Phone Updated Successfully');
          } else {
            Toast.show({
              text1: ArabicText?.PhoneNumberAlreadyExist,
              type: 'error',
              visibilityTime: 3000,
            });
            // alert('Phone Number Already Exist');
          }
        });
    }
  };
  verifiedSms() {
    let {actions} = this.props;

    camelapp
      .post('/update', {
        user_id: this.props?.user?.user?.user.id,
        phone: this.state.phoneNumber,
      })
      .then(res => {
        // console.log('res number', res.data);

        if (res?.data?.status == true) {
          actions.userData(res.data);
          this.setState({modalOtp: false, modalPhone: false});
          Toast.show({
            text1: ArabicText?.PhoneUpdatedSuccessfully,
            type: 'success',
            visibilityTime: 3000,
          });
          // alert('Phone Updated Successfully');
        } else {
          Toast.show({
            text1: ArabicText?.PhoneNumberAlreadyExist,
            type: 'error',
            visibilityTime: 3000,
          });
          // alert('Phone Number Already Exist');
        }
      });
  }
  chatflag(value) {
    //console.log("value", value)
    this.setState({chatFlag: value});
  }
  onRegisterSwitchChanged(value) {
    //console.log("value", value)
    this.setState({registerSwitch: value});
  }
  phoneStatusSwitch(value) {
    this.setState({phoneStatusSwitch: value});
  }
  // onCategoryClick = async item => {
  //   if (item.category_id == '1') {
  //     this.props.navigation.navigate('CamelClubList');
  //   }
  //   if (item.category_id == '4') {
  //     this.props.navigation.navigate('CamelTreatmentList');
  //   }
  //   if (item.category_id == '3') {
  //     this.props.navigation.navigate('CamelMissingList');
  //   }
  //   if (item.category_id == '2') {
  //     this.props.navigation.navigate('CamelSellingList');
  //   }
  //   if (item.category_id == '6') {
  //     this.props.navigation.navigate('CamelFoodList');
  //   }
  //   if (item.category_id == '8') {
  //     this.props.navigation.navigate('CamelEquipmentList');
  //   }
  //   if (item.category_id == '7') {
  //     this.props.navigation.navigate('CamelEquipmentList');
  //   }
  //   if (item.category_id == '5') {
  //     this.props.navigation.navigate('CamelMovingList');
  //   }
  //   if (item.category_id == '9') {
  //     this.props.navigation.navigate('CamelMarketingList');
  //   }

  //   if (item.category_id == '11') {
  //     this.props.navigation.navigate('FemaleList');
  //   }
  // };

  // ============NEW=============
  onCategoryClick = async item => {
    const categoryMap = {
      1: 'CamelClubList',
      2: 'CamelSellingList',
      3: 'CamelMissingList',
      4: 'CamelTreatmentList',
      5: 'CamelMovingList',
      6: 'CamelFoodList',
      7: 'CamelEquipmentList',
      8: 'CamelEquipmentList',
      9: 'CamelMarketingList',
      11: 'FemaleList',
    };

    const navigationKey = categoryMap[item?.category_id];
    if (navigationKey) {
      this.props.navigation.navigate(navigationKey);
    }
  };
  fetchUser() {
    const {key} = this.state;
    this.setState({loader: true, posts: []});
    let {user, actions} = this.props;
    user = user?.user?.user;
    try {
      camelapp.get('/get/fetchUser/' + user.id).then(res => {
        // actions.userData(res?.data);
        const data = res.data;
        if (data) {
          var arrayPosts = res?.data?.posts;
          arrayPosts?.map((item, index) => {
            let array = item?.img;
            let imagesArray = [];
            array[0] !== '' &&
              array?.forEach(element => {
                imagesArray?.push({type: 'image', source: element});
              });
            item?.video !== null &&
              imagesArray?.push({
                type: 'video',
                source: item?.video,
                thumbnail: item?.thumbnail?.thumbnail,
              });
            item['imagesArray'] = imagesArray;
            arrayPosts[index] = item;
          });
          this.setState({
            posts: arrayPosts,
          });
          // RATING
          const length = parseInt(res?.data?.posts?.length);
          let rating = 0;
          if (length > 30 && length < 100) {
            console.log('ratigggg');
            rating = 1;
          } else if (length >= 100 && length < 150) {
            rating = 2;
          } else if (length >= 150 && length < 200) {
            rating = 3;
          } else if (length >= 200 && length < 250) {
            rating = 4;
          } else if (length > 250) {
            rating = 5;
          }
          this.setState({rating: rating});
          this.setState({
            phoneStatusSwitch: this.props?.user?.user?.user?.phone_status,
            loader: false,
            whatsappNumber: this.props?.user?.user?.user?.whatsapp_no,
            phoneNumber: this.props.user?.user?.user?.phone,
            chatFlag:
              this?.props?.user?.user?.user?.chat_status == 0 ? false : true,
            registerSwitch:
              this.props.user?.user?.user?.whatsapp_status == 0 ? false : true,
            key: !key,
          });
        }
      });
    } catch (error) {
      //console.log("error at fetch user", error.response)
    }
  }
  VideoPlay = item => {
    if (item?.source == 'UOmNlxYosf.mp4') {
      this.setState({pausedCheck: true});
    }
  };
  filterPostOnDelete = item => {
    const {posts} = this.state;
    const filteredPosts = posts?.filter(val => {
      return val?.id !== item?.id;
    });
    this.setState({posts: filteredPosts});
  };
  onPostDelete(item) {
    this.setState({loader: true});
    camelapp
      .post('delete/post', {
        post_id: item.id,
      })
      .then(response => {
        if (response.data) {
          this.filterPostOnDelete(item);
          // this.fetchUser();
          this.checkUserLogedIn();
          this.setState({loader: false});
        }
      });
  }
  openFollowersModal() {
    this.setState({modal: true});
  }
  openFollowingModal() {
    this.setState({modalFollowing: true});
  }
  ScrollToRefresh() {
    this.fetchUser();
    this.setState({refreshing: false});
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
  // =============NEW Updated Search Handler==============
  searchHandler = value => {
    const {key, posts} = this.state;
    if (!value) {
      this.setState({filterPosts: this.state.commentsList, searchedItem: ''});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = posts?.filter(item => {
        const {
          title,
          description,
          user_location,
          user_phone,
          camel_type,
          category_name,
        } = item;
        return (
          title?.toLowerCase().includes(value.toLowerCase()) ||
          description?.toLowerCase().includes(value.toLowerCase()) ||
          user_location?.toLowerCase()?.includes(value.toLowerCase()) ||
          camel_type?.toLowerCase()?.includes(value.toLowerCase()) ||
          category_name?.toLowerCase()?.includes(value.toLowerCase()) ||
          user_phone?.includes(value)
        );
      });
      if (filteredData?.length > 0) {
        this.setState({filterPosts: filteredData, key: !key});
      } else {
        this.setState({filterPosts: [], key: !key});
      }
    }
  };
  search(text) {
    this.setState({searchText: text});
  }
  onShare = async () => {
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
      Toast.show({
        text1: error?.message,
        type: 'error',
        visibilityTime: 3000,
      });
      // alert(error.message);
    }
  };
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({rating: 0});
      this.fetchUser();
    });
  };
  componentWillUnmount() {
    this.focusListener();
  }
  render() {
    let {user} = this.props;
    user = user?.user?.user;
    const {key, filterPosts, posts, searchedItem, searchText} = this.state;
    const sharePosts = item => {
      this.setState({loading: true});
      let {user} = this.props;
      user = user?.user?.user;
      let post_id = item?.id;
      if (user != undefined) {
        camelapp
          .post('/add/sharess', {
            user_id: user.id,
            post_id: post_id,
          })
          .then(response => {
            if (response.data) {
              let filterPosts = this.state.filterPosts;
              let tempIndex = filterPosts?.indexOf(item);
              let share_count = item?.share_count + 1;
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
    const onCommentsClick = item => {
      let {user} = this.props;
      user = user?.user?.user;
      let post_id = item?.id;
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
    const onLikesClick = (item, setIsLiked, setLikeCount) => {
      this.setState({loading: false});
      let {user} = this.props;
      user = user?.user?.user;
      let post_id = item?.id;
      if (user != undefined) {
        camelapp
          .post('/add/like', {
            user_id: user?.id,
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
    onDetailsClick = async (item, viewCount, setViewCount) => {
      const {user} = this.props;
      const post_id = item?.id;
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
          this.props.navigation.navigate('DetailsComponentWithPrice', {
            itemFromDetails: item,
          });
        } else if (item.category_id == '8') {
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
          this.props.navigation.navigate('CompetitionPostDetail', {
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
          this.props.navigation.navigate('CompetitionPostDetail', {
            itemFromDetails: item,
          });
        }
      }
    };
    const renderItem = ({item}) => {
      // let array = item?.img;
      // let imagesArray = [];
      // console.log(array?.length);
      //     array?.forEach(element => {
      //       if (element) {
      //         imagesArray.push({type: 'image', source: element});
      //       }
      //     });
      //   // if (item?.video && item?.video !== null) {
      //     imagesArray.push({type: 'video', source: item.video});
      //   // }
      return (
        <Item
          item={item}
          imagesArray={item?.imagesArray}
          likes={item?.like_count}
          title={item?.title}
          comments={item?.comment_count}
          shares={item?.share_count}
          views={item?.view_count}
          user_name={item?.user_name}
          user_location={item?.user_location}
          user_images={item?.user_images}
          category={item?.category_name}
          onPostDelete={() => this.onPostDelete(item)}
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
          onLikesClick={(item, setIsLiked, setLikeCount) =>
            onLikesClick(item, setIsLiked, setLikeCount)
          }
          onCategoryClick={() => this.onCategoryClick(item)}
          onCommentsClick={() => onCommentsClick(item)}
          sharePost={() => this.onShare()}
          onVideoPlay={item => this.VideoPlay(item)}
          pausedCheck={this.state.pausedCheck}
          pauseCheckHandler={txt => this.setState({pausedCheck: txt})}
          flagForLike={item?.flagForLike}
          postViewed={(viewCount, setViewCount) =>
            this.postViewed(item, viewCount, setViewCount)
          }
          date={item?.created_at?.slice(0, 10)}
          price={item?.price}
          bid_price={item?.bid_price}
        />
      );
    };
    return (
      <View style={Styles.containerProfile}>
        {this.props.user?.user?.user === undefined ? (
          this.props.navigation.navigate('Login')
        ) : (
          <>
            <Header
              onChangeText={text => {
                if (text) {
                  this.search(text);
                } else {
                  this.setState({searchedItem: '', searchText: ''});
                }
              }}
              onPressSearch={() => this.searchHandler(searchText)}
            />
            <View>
              {/* {this.state.loader == false && ( */}
              {/* <> */}
              <View style={Styles.headerProfile}>
                {/* Edit & Cart Icons Profile */}
                <View style={styles.head}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('EditProfile')
                    }>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={35}
                      color="#D2691Eff"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('BidTab');
                    }}>
                    <Foundation
                      name="shopping-cart"
                      size={35}
                      color="#D2691Eff"
                    />
                  </TouchableOpacity>
                </View>
                {/* Edit & Cart Icons Profile */}

                <View style={{position: 'absolute', right: 15, bottom: 5}}>
                  {/* Rating */}
                  <Rating
                    ratingCount={5}
                    jumpValue={4}
                    imageSize={16}
                    readonly={true}
                    startingValue={this.state.rating}
                    ratingBackgroundColor={'#aaa'}
                    style={{paddingVertical: 10}}
                    ratingColor={'crimson'}
                    tintColor="white"
                    type="custom"
                  />
                  {/* Rating */}
                </View>

                <View
                  style={{
                    width: 140,
                    padding: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FastImage
                    style={styles.img}
                    source={{
                      uri:
                        'http://www.tasdeertech.com/public/images/profiles/' +
                        user.image,
                    }}
                    resizeMode={FastImage?.resizeMode.cover}
                  />
                  <Text style={styles.name}>{user?.name}</Text>
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="checkcircle"
                      size={14}
                      color={
                        user?.subscription
                          ? user?.subscription == 'normal'
                            ? 'blue'
                            : user?.subscription == 'famous'
                            ? 'orange'
                            : '#e50000'
                          : this.state?.rating <= 1
                          ? 'blue'
                          : this.state?.rating <= 3
                          ? 'orange'
                          : '#e50000'
                      }
                    />
                    <Text
                      style={{
                        color: user?.subscription
                          ? user?.subscription == 'normal'
                            ? 'blue'
                            : user?.subscription == 'famous'
                            ? 'orange'
                            : '#e50000'
                          : this.state?.rating <= 1
                          ? 'blue'
                          : this.state?.rating <= 3
                          ? 'orange'
                          : '#e50000',
                        fontSize: 12,
                        textAlign: 'right',
                        marginRight: 4,
                      }}>
                      {user?.subscription?.length
                        ? user?.subscription
                        : this.state?.rating <= 1
                        ? 'Normal'
                        : this.state?.rating <= 3
                        ? 'Special'
                        : 'Famous'}
                    </Text>
                  </View>
                  {/* my contacts */}
                  <View style={styles.icons}>
                    <TouchableOpacity
                      onPress={() => this.setState({modal: true})}
                      style={Styles.detailsIcons}>
                      <FontAwesome name="whatsapp" size={20} color="#CD853F" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.setState({modalPhone: true})}
                      style={Styles.detailsIcons}>
                      <AntDesign name="mobile1" size={20} color="#CD853F" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.setState({modalChat: true})}
                      style={Styles.detailsIcons}>
                      <AntDesign name="message1" size={20} color="#CD853F" />
                    </TouchableOpacity>
                  </View>
                  {/* my contacts */}
                </View>
              </View>

              <View style={styles.headerContainer}>
                <View style={styles.row}>
                  {/* FOLLOWING LIST  */}
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('FollowingList', {
                        id: this.props?.user?.user?.user?.id,
                      });
                    }}
                    style={styles.video}>
                    <Text style={styles.textcolor}>
                      {this.props?.user?.user?.follwers}
                    </Text>
                    <Text style={styles.textcolor}>{ArabicText.Followers}</Text>
                  </TouchableOpacity>
                  {/* OR  */}
                  <Text
                    style={{fontSize: 30, fontWeight: '400', color: '#fff'}}>
                    |
                  </Text>
                  {/* NO OF POSTS  */}
                  <View style={styles.video}>
                    <Text style={styles.textcolor}>
                      {this.props?.user?.user?.posts?.length}
                    </Text>
                    <Text style={styles.textcolor}>{ArabicText.posts}</Text>
                  </View>
                  {/* OR  */}
                  <Text
                    style={{fontSize: 30, fontWeight: '400', color: '#fff'}}>
                    |
                  </Text>
                  {/* FOLLOWERS LIST  */}
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('FollowersList', {
                        id: this.props?.user?.user?.user?.id,
                      });
                    }}
                    style={styles.video}>
                    <Text style={styles.textcolor}>
                      {this.props?.user?.user?.following}
                    </Text>
                    <Text style={styles.textcolor}>
                      {ArabicText?.Following}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* </> */}
              {/* )} */}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modal}>
                <TouchableWithoutFeedback
                // onPress={() => this.setState({ modalOffer: false })}
                >
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <Pressable
                        onPress={modalOffer => this.setState({modal: false})}>
                        <Ionicons name="close" size={30} color="brown" />
                      </Pressable>
                      <Text style={{margin: 5, color: 'black'}}>
                        {ArabicText?.AddWhatsappnumber}
                      </Text>

                      <TextInput
                        maxLength={10}
                        value={this.state.whatsappNumber}
                        style={Styles.forminputsPrice}
                        placeholder={ArabicText?.WhatsAppNumber}
                        keyboardType="numeric"
                        onChangeText={text =>
                          this.setState({whatsappNumber: text})
                        }
                        placeholderTextColor="#b0b0b0"></TextInput>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'flex-end',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            margin: 3,
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {this.state.registerSwitch == true
                            ? 'Active'
                            : 'In Active'}
                        </Text>

                        <Switch
                          trackColor={{false: '#767577', true: '#D2691Eff'}}
                          thumbColor={
                            this.state.registerSwitch == true
                              ? '#f5dd4b'
                              : '#f4f3f4'
                          }
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={value =>
                            this.onRegisterSwitchChanged(value)
                          }
                          value={this.state.registerSwitch}
                        />
                      </View>

                      <TouchableOpacity onPress={() => this.saveWhatsApp()}>
                        <View style={Styles.btnform}>
                          <Text style={Styles.textbtn}>{ArabicText?.add}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalChat}>
                <TouchableWithoutFeedback
                // onPress={() => this.setState({ modalOffer: false })}
                >
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <Pressable
                        onPress={() => this.setState({modalChat: false})}>
                        <Ionicons name="close" size={30} color="brown" />
                      </Pressable>
                      <Text style={{margin: 5, color: 'black'}}>
                        {ArabicText?.Enable_dissableChat}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            margin: 3,
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {this.state.chatFlag == true ? 'Active' : 'In Active'}
                        </Text>

                        <Switch
                          trackColor={{false: '#767577', true: '#D2691Eff'}}
                          thumbColor={
                            this.state.chatFlag == true ? '#f5dd4b' : '#f4f3f4'
                          }
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={value => this.chatflag(value)}
                          value={this.state.chatFlag}
                        />
                      </View>

                      <TouchableOpacity onPress={() => this.saveChat()}>
                        <View style={Styles.btnform}>
                          <Text style={Styles.textbtn}>{ArabicText?.add}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalPhone}>
                <TouchableWithoutFeedback
                // onPress={() => this.setState({ modalOffer: false })}
                >
                  <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                      <Pressable
                        onPress={modalOffer =>
                          this.setState({modalPhone: false})
                        }>
                        <Ionicons name="close" size={30} color="brown" />
                      </Pressable>
                      <Text style={{margin: 5, color: 'black'}}>
                        {ArabicText?.UpdatePhone}
                      </Text>

                      <TextInput
                        maxLength={10}
                        value={this.state.phoneNumber}
                        style={Styles.forminputsPrice}
                        placeholder={ArabicText?.PhoneNumber}
                        keyboardType="numeric"
                        onChangeText={text =>
                          this.setState({phoneNumber: text})
                        }
                        placeholderTextColor="#b0b0b0"></TextInput>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'flex-end',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            margin: 3,
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {this.state.phoneStatusSwitch == true ||
                          this.state.phoneStatusSwitch == 'True'
                            ? 'Active'
                            : 'In Active'}
                        </Text>

                        <Switch
                          trackColor={{false: '#767577', true: '#D2691Eff'}}
                          thumbColor={
                            this.state.phoneStatusSwitch == true ||
                            this.state.phoneStatusSwitch == 'True'
                              ? '#f5dd4b'
                              : '#f4f3f4'
                          }
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={value => this.phoneStatusSwitch(value)}
                          value={
                            this.state.phoneStatusSwitch == true ||
                            this.state.phoneStatusSwitch == 'True'
                              ? true
                              : false
                          }
                        />
                      </View>
                      <TouchableOpacity onPress={() => this.updateNumber()}>
                        <View style={Styles.btnform}>
                          {this.state?.updateLoader == true ? (
                            <ActivityIndicator size={'large'} color={'white'} />
                          ) : (
                            <Text style={Styles.textbtn}>{ArabicText.add}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              <Modal
                animationType="slide"
                visible={this.state.modalOtp}
                transparent={true}
                onRequestClose={() => this.setState({modalOtp: false})}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{height: height}}
                  onPress={() => this.setState({modalOtp: false})}
                />
                <View
                  style={{
                    height: '20%',
                    width: width,
                    marginTop: 'auto',
                    backgroundColor: '#ffffff',
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20,
                    position: 'absolute',
                    bottom: 0,
                  }}>
                  <View
                    style={{
                      height: 30,
                      borderTopEndRadius: 25,
                      borderTopStartRadius: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#8b4513',
                        fontSize: 15,
                        fontWeight: '600',
                      }}>
                      {ArabicText?.EnterOTPHere}
                    </Text>
                  </View>

                  <OTPTextInput
                    tintColor="#8b4513"
                    ref={e => (this.otpInput = e)}
                    containerStyle={{
                      width: '90%',
                      alignSelf: 'center',
                      bottom: 10,
                    }}
                    handleTextChange={e => {
                      if (e === this.state.otpValue.toString()) {
                        this.verifiedSms();
                        console.log('eeeeeee', e);
                      }
                    }}
                  />
                </View>
              </Modal>

              <Loader loading={this.state.loading} />
              {this.state.loader && (
                <ActivityIndicator
                  size="large"
                  color="#D2691Eff"
                  animating={this.state.loader}
                  style={{marginTop: 20}}
                />
              )}

              {/* {this.state.loader == false && ( */}
              <FlatList
                key={key}
                ListEmptyComponent={
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 17,
                      alignContent: 'center',
                      textAlign: 'center',
                      marginVertical: 30,
                    }}>
                    {' '}
                    {ArabicText?.NoPostFound}
                  </Text>
                }
                data={searchedItem ? filterPosts : posts}
                renderItem={renderItem}
                keyExtractor={item_2 => item_2.id}
                contentContainerStyle={{paddingBottom: width * 0.1}}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.ScrollToRefresh()}
                  />
                }
                initialNumToRender={5}
                maxToRenderPerBatch={5}
              />
              {/* )} */}
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const Item = ({
  title,
  user_name,
  user_location,
  comments,
  shares,
  category,
  onPostDelete,
  onDetailsClick = () => {},
  onCommentsClick,
  onCategoryClick,
  onLikesClick = () => {},
  imagesArray,
  sharePost,
  user_images,
  flagForLike,
  likes,
  item,
  date,
  price,
  bid_price,
  postViewed = () => {},
}) => {
  const [pausedCheck, setpausedCheck] = useState(true);
  const [load, setLoad] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [modalItemType, setModalItemType] = useState('');
  const [isLiked, setIsLiked] = useState(flagForLike);
  const [likeCount, setLikeCount] = useState(likes ? likes : 0);
  const [viewCount, setViewCount] = useState(item?.view_count);
  return (
    <Card style={{elevation: 5, marginTop: 10}}>
      <View style={Styles.homesec}>
        <View
          style={{
            flexDirection: 'row',
            width: '98%',
            alignSelf: 'center',
            height: 60,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width / 3,
            }}>
            <TouchableOpacity onPress={onCategoryClick} style={Styles.btnHome2}>
              <Text
                style={{color: '#D2691Eff', fontWeight: 'bold', fontSize: 15}}>
                {category}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              width: width / 2,
              textAlign: 'right',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  paddingRight: 5,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {user_name}
              </Text>
              {user_location && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    paddingRight: 5,
                    color: 'black',
                    textAlign: 'right',
                  }}>
                  {user_location}
                </Text>
              )}
              {date && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    paddingRight: 5,
                    color: 'black',
                    textAlign: 'right',
                  }}>
                  {date}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              marginTop: 5,
              alignItems: 'flex-end',
            }}>
            <Image
              source={{
                uri: profileBaseUrl + user_images,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
              }}></Image>
          </View>
        </View>
      </View>
      {/* PRICE SECTION  */}
      {price?.length ? (
        <TouchableOpacity style={styles.priceContainer}>
          <Text style={styles.priceTxt}> {ArabicText?.Price}</Text>
          <Text numberOfLines={2} style={styles.bidPrice}>
            {bid_price > 0 ? bid_price : price}
          </Text>
        </TouchableOpacity>
      ) : null}
      <Carousel
        data={imagesArray}
        layout={'default'}
        scrollEnabled={true}
        // onScroll={() => this.setState({ pauseVideo: true})}
        renderItem={({item, index}) => {
          const mediaSource =
            item.type == 'image'
              ? {uri: imageBaseUrl + item.source}
              : item?.type == 'video'
              ? {uri: VideoBaseUrl + item.source}
              : null;
          return (
            <TouchableOpacity
              onPress={() => {
                postViewed(viewCount, setViewCount);
                setModal(true),
                  setModalItem(mediaSource),
                  setModalItemType(item?.type);
              }}
              style={Styles.imageCarousal}>
              {item.type == 'image' && (
                <FastImage
                  style={Styles.image}
                  source={{
                    uri: imageBaseUrl + item?.source,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage?.resizeMode.cover}
                />
              )}
              {item?.type == 'video' && (
                <View style={{flex: 1, backgroundColor: '#ededed'}}>
                  {pausedCheck && (
                    <FastImage
                      style={[
                        Styles.image,
                        {
                          opacity: item?.thumbnail ? 0.9 : 0.3,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                      ]}
                      source={
                        item?.thumbnail
                          ? {
                              uri: thumbnailBaseUrl + item?.thumbnail,
                              headers: {Authorization: 'someAuthToken'},
                              priority: FastImage.priority.high,
                            }
                          : require('../../assets/camel.png')
                      }
                      resizeMode={FastImage?.resizeMode.cover}
                    />
                  )}
                  <TouchableOpacity
                    style={{
                      height: 70,
                      width: 70,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      elevation: 2,
                      bottom: height / 6,
                      left: width / 2.3,
                    }}
                    onPress={() => {
                      setpausedCheck(false),
                        setModal(true),
                        setModalItem(mediaSource),
                        setModalItemType(item?.type);
                    }}>
                    <Image
                      activeOpacity={0.4}
                      source={
                        pausedCheck
                          ? require('../../assets/play.png')
                          : require('../../assets/pause.png')
                      }
                      resizeMode={'cover'}
                      style={{width: 70, height: 70}}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        sliderWidth={width}
        itemWidth={width}
      />

      {/* Post icons */}
      <View
        style={{
          width: '50%',
          height: 30,
          borderRadius: 15,
          alignSelf: 'flex-end',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'absolute',
          bottom: 57,
          right: 7,
          zIndex: 999,
          flexDirection: 'row',
          backgroundColor: '#fff',
          elevation: 2,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {' '}
            {viewCount}
          </Text>
          <Ionicons name="ios-eye-sharp" size={20} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={sharePost}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {shares}
          </Text>
          <Ionicons name="share-social-sharp" size={20} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCommentsClick}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {comments}
          </Text>
          <Feather name="message-square" size={18} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onLikesClick(item, setIsLiked, setLikeCount)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {likeCount}
          </Text>
          {isLiked == 'true' || isLiked == true ? (
            <AntDesign name="heart" size={18} color="#CD853F" />
          ) : (
            <AntDesign name="hearto" size={18} color="#CD853F" />
          )}
        </TouchableOpacity>
      </View>

      <View style={{width: width, height: 50}}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10, top: 5}}
          onPress={() => {
            onDetailsClick(viewCount, setViewCount);
          }}>
          <View style={Styles.btnHome}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              {ArabicText.Details}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{position: 'absolute', left: 100, top: 12, zIndex: 999}}
          onPress={onPostDelete}>
          <AntDesign name="delete" size={19} color="#cd853f" />
        </TouchableOpacity>

        <Text
          style={{
            position: 'absolute',
            right: 10,
            top: 12,
            color: '#000',
            fontWeight: '600',
          }}>
          {title}
        </Text>
      </View>

      <Modal
        visible={modal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModal(false), setpausedCheck(true);
        }}>
        <View style={styles.modalContainer}>
          {/* Modal Close Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setModal(false), setpausedCheck(true);
            }}
            style={styles.modalCloseBTN}>
            <AntDesign name="closecircle" size={35} color="#fff" />
          </TouchableOpacity>

          <View style={{height: 300, backgroundColor: 'red'}}>
            <View style={Styles.imageCarousal}>
              {modalItemType === 'image' && (
                <FastImage
                  style={Styles.image}
                  source={modalItem}
                  resizeMode={FastImage?.resizeMode.contain}
                />
              )}
              {modalItemType == 'video' && (
                <View style={{flex: 1, backgroundColor: '#ededed'}}>
                  <Video
                    onLoadStart={() => setLoad(true)}
                    onReadyForDisplay={() => setLoad(false)}
                    source={modalItem}
                    resizeMode="contain"
                    repeat={true}
                    controls={false}
                    paused={pausedCheck}
                    style={[
                      Styles.image,
                      {
                        width: width,
                        height: height / 2.5,
                      },
                    ]}
                  />
                  {/* } */}
                  <TouchableOpacity
                    style={{
                      height: 70,
                      width: 70,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      elevation: 2,
                      bottom: height / 6,
                      left: width / 2.3,
                    }}
                    onPress={() => {
                      setpausedCheck(true);
                      load ? null : setpausedCheck(!pausedCheck);
                    }}>
                    {load ? (
                      <ActivityIndicator size="large" />
                    ) : (
                      <Image
                        activeOpacity={0.4}
                        source={
                          pausedCheck
                            ? require('../../assets/play.png')
                            : require('../../assets/pause.png')
                        }
                        resizeMode={'cover'}
                        style={{width: 70, height: 70}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.modalMediaWrpr}>
            <TouchableOpacity
              activeOpacity={0.99}
              onPress={() => {}}
              style={styles.userProfileContainer}>
              <Image
                source={{
                  uri: profileBaseUrl + user_images,
                }}
                style={styles.userProfileImage}
              />
            </TouchableOpacity>
            <View style={styles.userInfoContainer}>
              <Text style={[styles.userName, {color: '#fff'}]}>
                {user_name}
              </Text>
              <Text style={[styles.userLocation, {color: '#fff'}]}>
                {user_location}
              </Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 140 / 2,
    borderWidth: 1,
    borderColor: '#D2691Eff',
  },
  video: {
    width: '33.33%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textcolor: {color: '#fff', fontWeight: '600'},

  headerContainer: {
    backgroundColor: '#d2691e',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    flexDirection: 'row',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    textAlign: 'center',
    height: 45,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  head: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 41,
    top: 35,
  },
  name: {
    margin: 3,
    color: '#D2691Eff',
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    height: '100%',
    width: width,
    backgroundColor: '#000000db',
    justifyContent: 'center',
  },
  modalCloseBTN: {top: 10, right: 15, position: 'absolute'},
  modalMediaWrpr: {
    width: width,
    height: 60,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 10,
  },
  userProfileContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  titleContainer: {position: 'absolute', right: 5, width: 220},
  titleText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  priceContainer: {
    position: 'absolute',
    // left: -350,
    top: 70,
    paddingTop: 5,
    alignItems: 'center',
    alignContent: 'center',
    width: 60,
    backgroundColor: '#D2691Eff',
    height: height * 0.065,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    zIndex: 111,
    left: 20,
  },
  priceTxt: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  bidPrice: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: 13,
  },
});
