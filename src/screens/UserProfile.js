import React, {Component} from 'react';
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

const width = Dimensions.get('screen').width;

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
    };
  }
  sendWhatsAppMessage() {
    let {user} = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      if (this.state.user.whatsapp_status == true) {
        let msg = 'Hello';
        let mobile = this.state.user.whatsapp_no;
        if (mobile.length != 0) {
          if (msg) {
            let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
            Linking.openURL(url)
              .then(data => {
                //console.log("WhatsApp Opened successfully " + data);
              })
              .catch(() => {
                // alert('Make sure WhatsApp installed on your device');
                Toast.show({
                  type: 'error',
                  text1: 'Make sure WhatsApp installed on your device',
                });
              });
          } else {
            // alert('Please enter message to send');
            Toast.show({
              type: 'error',
              text1: 'Please enter message to send',
            });
          }
        } else {
          // alert('This user has disabled chat');
          Toast.show({
            type: 'error',
            text1: 'This is some something',
          });
        }
      } else {
        // alert('This user has disabled chat');
        Toast.show({
          type: 'error',
          text1: 'This user has disabled chat',
        });
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
        console.log('86', this.props.route.params.userProfile?.user);
        let phone = this.props.route.params.userProfile?.user_phone;
        console.log(this.props.route.params.userProfile, phone, 'phoneee');
        if (Platform.OS !== 'android') {
          phoneNumber = `telprompt:${phone}`;
        } else {
          phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
          .then(supported => {
            if (!supported) {
              Toast.show({
                type: 'error',
                text1: 'Phone number is not available',
              });
              // Alert.alert('Phone number is not available');
            } else {
              return Linking.openURL(phoneNumber);
            }
          })
          .catch(err => console.log(err));
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
        console.log('jkkj');
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
    const item = this.props.route?.params;
    this.setState({loading: true});
    let {user} = this.props;
    console.log(user, 'userererer');
    user = user?.user?.user ? user?.user?.user : user?.user;
    await camelapp
      .post('/userprofile', {
        user_id: item?.user_id,
      })
      .then(response => {
        const data = response.data;
        if (data) {
          let tempObjOfUserProfile = data;
          let tempArrayOfUserPosts = [];
          for (let i = 0; i < tempObjOfUserProfile.posts.length; i++) {
            tempArrayOfUserPosts.push(tempObjOfUserProfile.posts[i].post);
          }
          this.setState({
            following: data?.following,
            followers: data?.follwers,
            postData: tempArrayOfUserPosts,
            user: data.user,
            noOfPosts: data?.posts.length,
          });
        }
        if (user !== undefined) {
          this.checkFriendshipStatus();
        }
        this.setState({loading: false});
      })
      .catch(error => {
        console.log('error', error);
        this.setState({loading: false});
      });
  };
  componentDidMount() {
    this?.userProfile();
  }
  followRequest(followRequest) {
    let follower_id = this.state.user.id;
    let {user} = this.props;
    user = user.user.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      console.log('user_id', user.id);
      console.log('follower_id', follower_id);
      camelapp
        .post('/follow', {
          user_id: user.id,
          follower_id: follower_id,
        })
        .then(response => {
          console.log(response, 'followUnfollow');
          let res = response.data;
          if (res.status == true) {
            console.log('res184', res);
            Toast.show({
              type: 'success',
              text1: `${ArabicText.Following} + ''`,
            });
            // alert(ArabicText.Following + '');
          } else {
            Toast.show({
              type: 'success',
              text1: `${ArabicText.Error} + ''`,
            });
            // alert(ArabicText.Error + '');
          }
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  // // check Friendship Status
  checkFriendshipStatus() {
    let user_id = this.props?.user?.user?.user?.id;
    console.log(this.props?.user?.user?.user?.id);
    let friend_id = this.props.route?.params?.user_id;
    camelapp
      .get('/friendshipstatus/' + user_id + '/' + friend_id)
      .then(res => {
        this.setState({friendshipStatus: res?.data?.user_status});
        console.log(res?.data?.user_status, 'Friend Ship Status');
      })
      .catch(error => {
        console.log(error, '<<=====ERROR friendshipstatus');
      });
  }
  friendRequestHandler(status) {
    let friend_id = this.state.user.id;
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
          Toast.show({
            type: 'success',
            text1: 'Friend request has been sent.',
          });
          // Alert.alert('Friend request has been sent.');
          console.log(res.data, '<<<<<=======FRIEND Request ');
        })
        .catch(error => {
          console.log(error, '<<<<====Add friend Request error');
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  ScrollToRefresh() {
    this.state.postData;
    this.setState({refreshing: false});
  }
  postViewed = async item => {
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
          console.log('response.data', response.data);
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
    const Item = ({
      userName,
      userCity,
      image,
      likes,
      comments,
      shares,
      views,
      userImage,
      category,
      date,
    }) => (
      <Card
        style={{
          marginBottom: 5,
          marginTop: 5,
          elevation: 2,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: width,
            height: 60,
            flexDirection: 'row',
          }}>
          <TouchableOpacity style={{marginLeft: 10}}>
            <View style={Styles.btnHome2}>
              <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
                {category}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 10,
            }}>
            <View
              style={{
                justifyContent: 'center',
                marginHorizontal: 10,
                width: 100,
                height: 50,
              }}>
              <Text
                style={{color: 'black', textAlign: 'right'}}
                numberOfLines={1}>
                {userName + 'hello'}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  paddingRight: 5,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {date}
              </Text>
              <Text
                style={{color: 'black', textAlign: 'right'}}
                numberOfLines={1}>
                {userCity}
              </Text>
            </View>

            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/public/images/profiles/' +
                  userImage,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
              }}></Image>
          </View>
        </View>
        <TouchableOpacity
        //  onPress={() => navigation.navigate({navigation})}
        >
          <Card.Cover
            source={{uri: 'http://www.tasdeertech.com/images/posts/' + image}}
            resizeMode="cover"
            style={Styles.image}
          />
        </TouchableOpacity>

        {/* Post social icons */}
        <View
          style={{
            backgroundColor: '#fff',
            height: 50,
            width: width,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              right: 160,
              position: 'absolute',
            }}>
            {views}
          </Text>
          <View style={{right: 138, position: 'absolute', color: 'black'}}>
            <Ionicons name="ios-eye-sharp" size={18} color="#cd853f" />
          </View>
          <Text style={{right: 120, position: 'absolute', color: 'black'}}>
            {shares}
          </Text>
          <TouchableOpacity style={{right: 98, position: 'absolute'}}>
            <Ionicons name="share-social-sharp" size={18} color="#cd853f" />
          </TouchableOpacity>
          <Text style={{right: 77, position: 'absolute', color: 'black'}}>
            {comments}
          </Text>
          <TouchableOpacity style={{right: 55, position: 'absolute'}}>
            <Feather name="message-square" size={18} color="#cd853f" />
          </TouchableOpacity>
          <Text style={{right: 33, position: 'absolute', color: 'black'}}>
            {likes}
          </Text>
          <TouchableOpacity style={{right: 10, position: 'absolute'}}>
            <AntDesign name="hearto" size={18} color="#cd853f" />
          </TouchableOpacity>
          <TouchableOpacity style={{left: 5, position: 'absolute'}}>
            <View style={Styles.btnHome}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                {ArabicText.Details}
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={{right: 120, position: 'absolute'}}>{}</Text>
        </View>
      </Card>
    );
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          image={item.image}
          likes={item.like_count}
          comments={item.comment_count}
          shares={item.share_count}
          views={item.view_count}
          userName={item.user.name}
          userCity={item.location}
          userImage={item.user.image}
          category={item.category.name}
          date={item?.date}
          postViewed={item => postViewed(item)}
        />
      );
    };
    const FriendshipStatusBTN = () => {
      const user = this.props.user.user.user;
      if (
        this.state.friendshipStatus === null ||
        this.state.friendshipStatus === 'C' ||
        user === undefined ||
        this.state.friendshipStatus === 'R'
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
      }
      if (this.state.friendshipStatus == 'P') {
        return (
          <TouchableOpacity onPress={() => this.friendRequestHandler('C')}>
            <FontAwesome5
              name="user-minus"
              size={30}
              color="#D2691Eff"
              style={{margin: 5}}
            />
          </TouchableOpacity>
        );
      }
      if (this.state.friendshipStatus == 'A') {
        return (
          <TouchableOpacity onPress={() => this.friendRequestHandler('R')}>
            <FontAwesome5
              name="user-check"
              size={30}
              color="#D2691Eff"
              style={{margin: 5}}
            />
          </TouchableOpacity>
        );
      }
    };

    return (
      <View style={styles.container}>
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

        <FlatList
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
          data={this.state.postData}
          renderItem={renderItem}
          keyExtractor={item_2 => item_2.id}
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
});
