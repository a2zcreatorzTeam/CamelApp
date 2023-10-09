import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  Modal,
  Platform,
  RefreshControl,
} from 'react-native';
import {Card} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Styles} from '../styles/globlestyle';

import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import * as ArabicText from '../language/EnglishToArabic';
import Toast from 'react-native-toast-message';
import Carousel from 'react-native-snap-carousel';
import Video from 'react-native-video';
import {ActivityIndicator} from 'react-native';
import Loader from '../components/PleaseWait';
import Header from '../components/Header';
import FastImage from 'react-native-fast-image';
import {Share} from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: 0,
      followers: 0,
      postData: [],
      user: {},
      noOfPosts: 0,
      friendshipStatus: null,
      modal: false,
      profImgWidth: 0,
      profImgHeight: 0,
      refreshing: false,
      loading: false,
      key: false,
      searchText: '',
      searchedItem: '',
      filterPosts: [],
      OtherUserDetail: '',
      loader: false,
    };
  }
  ScrollToRefresh() {
    this.userProfile();
    this.setState({refreshing: false});
  }
  sendWhatsAppMessage() {
    const {userProfile} = this.props.route?.params;
    let {user} = this.props;
    console.log(userProfile?.whatsapp_status);
    user = user?.user?.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      if (
        userProfile?.whatsapp_status == 1 ||
        userProfile?.whatsapp_status == true
      ) {
        let msg = 'Hello';
        let mobile = userProfile?.whatsapp_no;
        if (mobile?.length != 0) {
          if (msg) {
            let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
            Linking.openURL(url)
              .then(data => {
                //console.log("WhatsApp Opened successfully " + data);
              })
              .catch(() => {
                alert('Make sure WhatsApp installed on your device');
                // Toast.show({
                //   type: 'error',
                //   text1: 'Make sure WhatsApp installed on your device',
                // });
              });
          } else {
            alert('Please enter message to send');
            // Toast.show({
            //   type: 'error',
            //   text1: 'Please enter message to send',
            // });
          }
        } else {
          alert('This user has disabled chat');
          // Toast.show({
          //   type: 'error',
          //   text1: 'This is some something',
          // });
        }
      } else {
        alert('This user has disabled chat');
        // Toast.show({
        //   type: 'error',
        //   text1: 'This user has disabled chat',
        // });
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  audioCall() {
    let {user} = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;

    if (user != undefined) {
      if (user?.id != this.props.route.params.userProfile.user_id) {
        let phone = this.props.route.params.userProfile?.user_phone;

        if (
          this?.state?.OtherUserDetail?.phone_status == true ||
          this?.state?.OtherUserDetail?.phone_status == 'True' ||
          this?.state?.OtherUserDetail?.phone_status == 1
        ) {
          if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${this?.state?.OtherUserDetail?.phone}`;
          } else {
            phoneNumber = `tel:${this?.state?.OtherUserDetail?.phone}`;
          }
          Linking.canOpenURL(phoneNumber)
            .then(supported => {
              if (!supported) {
                // Toast.show({
                //   type: 'error',
                //   text1: 'Phone number is not available',
                // });
                Alert.alert('Phone number is not available');
              } else {
                return Linking.openURL(phoneNumber);
              }
            })
            .catch(err => console.log(err));
        } else {
          alert('This user has disabled mobile number');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'This is your post',
        });
        // alert('This is your post');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  sendMessage() {
    let {user} = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      if (user?.id != this.props.route.params.userProfile.user?.id) {
        if (
          this.props.route.params.userProfile.user?.chat_status == true ||
          this.props.route.params.userProfile.user?.chat_status == '1'
        ) {
          this.props.navigation.navigate('MessageViewScreen', {
            messageData: this.state.user,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'This user has disabled chat',
          });
          // alert('This user has disabled chat');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'This is your post',
        });
        // alert('This is your post');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  userProfile = async () => {
    const {key} = this.state;
    const item = this.props.route?.params;
    console.log(item?.user_id);
    this.setState({loading: true});
    let {user} = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;
    await camelapp
      .post('/userprofile', {
        user_id: item?.user_id,
      })
      .then(response => {
        const data = response.data;
        console.log('dsdsd', data, 'hyjhjjhghgjjj');
        if (data) {
          // let tempObjOfUserProfile = data;
          // let tempArrayOfUserPosts = [];
          // for (let i = 0; i < tempObjOfUserProfile.posts.length; i++) {
          //   tempArrayOfUserPosts.push(tempObjOfUserProfile.posts[i].post);
          // }
          var arrayPosts = response?.data?.posts;
          arrayPosts?.map((item, index) => {
            let array = item?.img;
            console.log('arrayPosts', arrayPosts?.length);
            let imagesArray = [];
            array?.forEach(element => {
              imagesArray?.push({type: 'image', source: element});
            });
            imagesArray?.push({type: 'video', source: item?.video});
            console.log('206666', imagesArray);
            item['imagesArray'] = imagesArray;
            arrayPosts[index] = item;
          });
          this.setState({
            postData: arrayPosts,

            following: data?.following,
            followers: data?.follwers,
            user: data.user,
            noOfPosts: data?.posts?.length,
            key: !key,
            OtherUserDetail: data?.user,
          });
        }
        this.setState({loading: false});
        if (user !== undefined) {
          this.checkFriendshipStatus();
        }
      })
      .catch(error => {
        console.log('error1', error?.response);
        this.setState({loading: false});
      });
  };
  componentDidMount() {
    this?.userProfile();
  }
  followRequest(followRequest) {
    const follower_id = this.props.route?.params?.user_id;
    let {user} = this.props;
    user = user.user.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      camelapp
        .post('/follow', {
          user_id: user?.id,
          follower_id: follower_id,
        })
        .then(response => {
          let res = response?.data;
          if (res?.status == true) {
            Toast.show({
              type: 'success',
              text1: `${ArabicText?.Following} + ''`,
            });
            alert(ArabicText.Following + '');
          } else {
            Toast.show({
              type: 'success',
              text1: `${ArabicText.Error} + ''`,
            });
            alert(ArabicText.Error + '');
          }
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  // // check Friendship Status
  checkFriendshipStatus() {
    const user_friend = this.props.route?.params;
    let {user} = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;
    camelapp
      .get('/friendshipstatus/' + user?.id + '/' + user_friend?.user_id)
      .then(res => {
        this.setState({friendshipStatus: res?.data?.status, loading: false});
      })
      .catch(error => {
        this.setState({loading: false});
        console.log(error, '<<=====ERROR friendshipstatus');
      });
  }
  friendRequestHandler(status) {
    this.setState({loading: true});
    const friend_id = this.props.route?.params?.user_id;
    let {user} = this.props;
    user = user.user.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      camelapp
        .post('/manage/friendrequest', {
          user_id: user.id,
          friend_id: friend_id,
          status: status,
        })
        .then(res => {
          this.checkFriendshipStatus();
          // Alert.alert('Friend request has been sent.');
        })
        .catch(error => {
          console.log(error, '<<<<====Add friend Request error');
        });
    } else {
      this.props.navigation.navigate('Login');
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
          console.log(response, 'responsesese');
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
  //  SEARCH
  searchHandler = value => {
    const {key, postData} = this.state;
    if (!value) {
      this.setState({filterPosts: this.state.commentsList, searchedItem: ''});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = postData?.filter(item => {
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
      console.log(filteredData, 'foilteredDdataa');
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
      alert(error.message);
    }
  };
  render() {
    const {filterPosts, postData, searchedItem, key, searchText} = this.state;
    const sharePosts = item => {
      const user = this.props.route?.params;
      this.setState({loading: true});
      let post_id = item?.id;
      if (user != undefined) {
        camelapp
          .post('/add/sharess', {
            user_id: user.user_id,
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
      const user = this.props;
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
      let user = this.props;
      user = user?.user?.user?.user?.id;
      this.setState({loading: false});
      let post_id = item?.id;
      if (user != undefined) {
        camelapp
          .post('/add/like', {
            user_id: user,
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
            console.log('error like', error?.response);
            this.setState({loading: false});
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    const renderItem = ({item}) => {
      let array = item?.img;
      let imagesArray = [];
      array?.forEach(element => {
        if (element) {
          imagesArray.push({type: 'image', source: element});
        }
      });
      if (item?.video !== null) {
        imagesArray.push({type: 'video', source: item.video});
      }
      return (
        <Item
          date={item?.date}
          item={item}
          imagesArray={imagesArray}
          likes={item?.like_count}
          title={item?.title}
          comments={item?.comment_count}
          shares={item?.share_count}
          views={item?.view_count}
          user_name={item?.user_name}
          user_location={item?.location}
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
          onLikesClick={(item, setIsLiked, setLikeCount) =>
            onLikesClick(item, setIsLiked, setLikeCount)
          }
          onCommentsClick={() => onCommentsClick(item)}
          // sharePost={() => sharePosts(item)}
          sharePost={() => this.onShare()}
          onVideoPlay={item => this.VideoPlay(item)}
          pausedCheck={this.state.pausedCheck}
          pauseCheckHandler={txt => this.setState({pausedCheck: txt})}
          flagForLike={item?.flagForLike}
          postViewed={(viewCount, setViewCount) =>
            this.postViewed(item, viewCount, setViewCount)
          }
          user_images={item?.user_images}
          category={item?.category_name}
        />
      );
    };
    // const Item = ({
    //   userName,
    //   userCity,
    //   image,
    //   likes,
    //   comments,
    //   shares,
    //   views,
    //   userImage,
    //   category,
    //   date,
    // }) => (
    //   <Card
    //     style={{
    //       marginBottom: 5,
    //       marginTop: 5,
    //       elevation: 2,
    //     }}>
    //     <View
    //       style={{
    //         backgroundColor: '#fff',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //         width: width,
    //         height: 60,
    //         flexDirection: 'row',
    //       }}>
    //       <TouchableOpacity style={{marginLeft: 10}}>
    //         <View style={Styles.btnHome2}>
    //           <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
    //             {category}
    //           </Text>
    //         </View>
    //       </TouchableOpacity>

    //       <View
    //         style={{
    //           alignItems: 'center',
    //           flexDirection: 'row',
    //           justifyContent: 'space-between',
    //           marginRight: 10,
    //         }}>
    //         <View
    //           style={{
    //             justifyContent: 'center',
    //             marginHorizontal: 10,
    //             width: 100,
    //             height: 50,
    //           }}>
    //           <Text
    //             style={{color: 'black', textAlign: 'right'}}
    //             numberOfLines={1}>
    //             {userName + 'hello'}
    //           </Text>
    //           <Text
    //             style={{
    //               fontSize: 9,
    //               paddingRight: 5,
    //               color: 'black',
    //               textAlign: 'right',
    //             }}>
    //             {date}
    //           </Text>
    //           <Text
    //             style={{color: 'black', textAlign: 'right'}}
    //             numberOfLines={1}>
    //             {userCity}
    //           </Text>
    //         </View>

    //         <Image
    //           source={{
    //             uri:
    //               'http://www.tasdeertech.com/public/images/profiles/' +
    //               userImage,
    //           }}
    //           style={{
    //             width: 50,
    //             height: 50,
    //             borderRadius: 50 / 2,
    //           }}></Image>
    //       </View>
    //     </View>
    //     <TouchableOpacity
    //     //  onPress={() => navigation.navigate({navigation})}
    //     >
    //       <Card.Cover
    //         source={{uri: 'http://www.tasdeertech.com/images/posts/' + image}}
    //         resizeMode="cover"
    //         style={Styles.image}
    //       />
    //     </TouchableOpacity>

    //     {/* Post social icons */}
    //     <View
    //       style={{
    //         backgroundColor: '#fff',
    //         height: 50,
    //         width: width,
    //         justifyContent: 'center',
    //       }}>
    //       <Text
    //         style={{
    //           right: 160,
    //           position: 'absolute',
    //         }}>
    //         {views}
    //       </Text>
    //       <View style={{right: 138, position: 'absolute', color: 'black'}}>
    //         <Ionicons name="ios-eye-sharp" size={18} color="#cd853f" />
    //       </View>
    //       <Text style={{right: 120, position: 'absolute', color: 'black'}}>
    //         {shares}
    //       </Text>
    //       <TouchableOpacity style={{right: 98, position: 'absolute'}}>
    //         <Ionicons name="share-social-sharp" size={18} color="#cd853f" />
    //       </TouchableOpacity>
    //       <Text style={{right: 77, position: 'absolute', color: 'black'}}>
    //         {comments}
    //       </Text>
    //       <TouchableOpacity style={{right: 55, position: 'absolute'}}>
    //         <Feather name="message-square" size={18} color="#cd853f" />
    //       </TouchableOpacity>
    //       <Text style={{right: 33, position: 'absolute', color: 'black'}}>
    //         {likes}
    //       </Text>
    //       <TouchableOpacity style={{right: 10, position: 'absolute'}}>
    //         <AntDesign name="hearto" size={18} color="#cd853f" />
    //       </TouchableOpacity>
    //       <TouchableOpacity style={{left: 5, position: 'absolute'}}>
    //         <View style={Styles.btnHome}>
    //           <Text style={{color: '#fff', fontWeight: 'bold'}}>
    //             {ArabicText.Details}
    //           </Text>
    //         </View>
    //       </TouchableOpacity>
    //       <Text style={{right: 120, position: 'absolute'}}>{}</Text>
    //     </View>
    //   </Card>
    // );
    // const renderItem = ({item}) => {
    //   return (
    //     <Item
    //       item={item}
    //       image={item.image}
    //       likes={item.like_count}
    //       comments={item.comment_count}
    //       shares={item.share_count}
    //       views={item.view_count}
    //       userName={item.user.name}
    //       userCity={item.location}
    //       userImage={item.user.image}
    //       category={item.category.name}
    //       date={item?.date}
    //       postViewed={item => postViewed(item)}
    //     />
    //   );
    // };
    const FriendshipStatusBTN = () => {
      const user = this.props.user.user.user;
      if (
        this.state.friendshipStatus == null
        // this.state.friendshipStatus == 'C' ||
        // this.state.friendshipStatus == 'R'
      ) {
        return (
          <TouchableOpacity onPress={() => this.friendRequestHandler('P')}>
            <FontAwesome5
              name="user-plus"
              size={30}
              color="#D2691Eff"
              style={{margin: 5}}
            />
          </TouchableOpacity>
        );
      } else if (this.state.friendshipStatus == 'P') {
        return (
          <TouchableOpacity onPress={() => this.friendRequestHandler('C')}>
            <FontAwesome5
              name="user-times"
              size={30}
              color="#D2691Eff"
              style={{margin: 5}}
            />
          </TouchableOpacity>
        );
      } else if (this.state.friendshipStatus == 'A') {
        return (
          <TouchableOpacity onPress={() => this.friendRequestHandler('R')}>
            <FontAwesome5
              name="user-friends"
              size={30}
              color="#D2691Eff"
              style={{margin: 5}}
            />
          </TouchableOpacity>
        );
      } else if (this.state.friendshipStatus == 'AR') {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => this.friendRequestHandler('R')}>
              <FontAwesome5
                name="user-times"
                size={30}
                color="#D2691Eff"
                style={{margin: 5}}
              />
            </TouchableOpacity>
            <View
              style={{width: 2, height: 20, backgroundColor: '#D3D3D3'}}></View>
            <TouchableOpacity onPress={() => this.friendRequestHandler('A')}>
              <FontAwesome5
                name="user-check"
                size={30}
                color="#D2691Eff"
                style={{margin: 5}}
              />
            </TouchableOpacity>
          </View>
        );
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
          onPressSearch={() => this.searchHandler(searchText)}
        />
        {this.state.loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={this.state.loader}
            style={{marginTop: 20}}
          />
        )}
        <View style={Styles.headerProfile}>
          {/* FOLLOW VIEW */}
          <View style={{position: 'absolute', top: 40, right: 20}}>
            <TouchableOpacity onPress={() => this.followRequest()}>
              <Entypo
                name="link"
                size={30}
                color="#D2691Eff"
                style={{margin: 5}}
              />
            </TouchableOpacity>
          </View>

          <View style={{position: 'absolute', top: 40, left: 20}}>
            <FriendshipStatusBTN />
          </View>

          <View>
            <TouchableOpacity onPress={() => this.setState({modal: true})}>
              <Image
                source={{
                  uri:
                    'http://www.tasdeertech.com/public/images/profiles/' +
                    this.state.user.image,
                }}
                style={styles.userImageStyle}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                margin: 3,
                color: '#D2691Eff',
                fontWeight: '500',
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              {this.state.user.name}
            </Text>
            <View style={styles.icons}>
              <TouchableOpacity
                onPress={() => this.sendWhatsAppMessage()}
                style={Styles.detailsIcons}>
                <FontAwesome name="whatsapp" size={20} color="#CD853F" />
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.detailsIcons}
                onPress={() => this.audioCall()}>
                <AntDesign name="mobile1" size={20} color="#CD853F" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.sendMessage()}
                style={Styles.detailsIcons}>
                <Feather name="message-square" size={20} color="#CD853F" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={Styles.textinfo}>
          <View
            style={{
              left: 50,
              top: 0,
              bottom: 0,
              position: 'absolute',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff'}}>{this.state.followers}</Text>
            <Text style={{color: '#fff'}}>{ArabicText.Followers}</Text>
          </View>

          <Text
            style={{
              left: 130,
              top: 0,
              bottom: 0,
              position: 'absolute',
              fontSize: 30,
              fontWeight: '400',
              color: '#fff',
            }}>
            |
          </Text>

          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#fff'}}>{this.state.noOfPosts}</Text>
            <Text style={{color: '#fff'}}>{ArabicText.posts}</Text>
          </View>

          <Text
            style={{
              right: 130,
              top: 0,
              bottom: 0,
              position: 'absolute',
              fontSize: 30,
              fontWeight: '400',
              color: '#fff',
            }}>
            |
          </Text>

          <View
            style={{
              right: 50,
              top: 0,
              bottom: 0,
              position: 'absolute',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff'}}>{this.state.following}</Text>
            <Text style={{color: '#fff'}}>{ArabicText.Following}</Text>
          </View>
        </View>
        <Loader loading={this.state.loading} />

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
              No Post Found
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.ScrollToRefresh()}
            />
          }
          data={searchedItem ? filterPosts : postData}
          renderItem={renderItem}
          keyExtractor={item_2 => item_2?.id}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />

        {/* Profile Image Full Screen View */}
        <Modal
          visible={this.state.modal}
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => this.setState({modal: false})}>
          <View
            style={{
              height: '100%',
              width: width,
              backgroundColor: '#000000db',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.setState({modal: false})}
              style={{top: 10, right: 15, position: 'absolute'}}>
              <AntDesign name="closecircle" size={35} color="#fff" />
            </TouchableOpacity>

            <View
              style={{
                width: width,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri:
                    'http://www.tasdeertech.com/public/images/profiles/' +
                    this?.state?.user?.image,
                }}
                style={{width: width, aspectRatio: 1}}
              />
            </View>
          </View>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImageStyle: {
    width: 70,
    height: 70,
    marginTop: 5,
    borderRadius: 140 / 2,
    borderWidth: 1,
    borderColor: '#D2691Eff',
    alignSelf: 'center',
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
});

const Item = ({
  title,
  user_name,
  user_location,
  image,
  comments,
  shares,
  views,
  userImage,
  category,
  onPostDelete,
  onDetailsClick,
  onCommentsClick,
  onCategoryClick,
  onLikesClick = () => {},
  imagesArray,
  pauseCheckHandler,
  onVideoPlay,
  sharePost,
  user_images,
  flagForLike,
  likes,
  item,
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
        <View style={{flexDirection: 'row', textAlign: 'right'}}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width / 3,
              height: 60,
              flexDirection: 'row',
              marginTop: 5,
            }}>
            <TouchableOpacity
              activeOpacity={0.99}
              onPress={onCategoryClick}
              style={Styles.btnHome2}>
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
              height: 60,
              // flexDirection: 'row',
              marginTop: 10,
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
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              width: width / 5,
              height: 60,
              flexDirection: 'row',
              marginTop: 5,
            }}>
            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/images/profiles/' + user_images,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
              }}></Image>
          </View>
        </View>
      </View>
      <Carousel
        data={imagesArray}
        layout={'default'}
        scrollEnabled={true}
        renderItem={({item, index}) => {
          const mediaSource =
            item?.type == 'image'
              ? {uri: 'http://www.tasdeertech.com/images/posts/' + item.source}
              : item?.type == 'video'
              ? {uri: 'http://www.tasdeertech.com/videos/' + item.source}
              : null;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
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
                    uri:
                      'http://www.tasdeertech.com/images/posts/' + item?.source,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage?.resizeMode.cover}
                />
              )}
              {item?.type == 'video' && (
                <View style={{flex: 1, backgroundColor: '#ededed'}}>
                  {pausedCheck && (
                    <Image
                      activeOpacity={0.4}
                      source={require('../../assets/camel.png')}
                      resizeMode={'cover'}
                      style={[
                        Styles.image,
                        {backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0.3},
                      ]}
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
          onPress={onDetailsClick}>
          <View style={Styles.btnHome}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              {ArabicText.Details}
            </Text>
          </View>
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
                // <Image
                //   source={modalItem}
                //   resizeMode="contain"
                //   style={Styles.image}
                // />
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
                  uri:
                    'http://www.tasdeertech.com/images/profiles/' + user_images,
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
