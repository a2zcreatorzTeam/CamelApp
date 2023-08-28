import React, {Component} from 'react';
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
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalFollowing: false,
      rating: 1,
      loader: false,
      posts: [],
      whatsappNumber: '',
      phoneNumber: '',
      otpValue: '',
      registerSwitch: true,
      chatFlag: true,
      modalChat: false,
      loading: false,
      modalPhone: false,
      modalOtp: false,
      refreshing: false,
      posts: [],
    };
  }

  // ==========NEW============
  checkUserLogedIn() {
    const {user} = this.props;
    if (user.user.user) {
      const length = parseInt(user.user.posts.length);
      let rating = 0;

      if (length > 30 && length < 100) {
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

      this.setState({rating});
      this.fetchUser();
      console.log(this.state.rating, 'RATING');
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  saveChat() {
    let {user, actions} = this.props;
    user = user.user.user;

    try {
      camelapp
        .post('/add/chat/' + user.id, {
          chat_status: this?.state?.chatFlag == true ? 1 : 0,
        })
        .then(res => {
          this.setState({modalChat: false});
          //console.log("response at fetch", res.data);
        });
    } catch (error) {
      //console.log("error at fetch user", error.response)
    }
  }
  saveWhatsApp() {
    let {user, actions} = this.props;
    user = user.user.user;

    //console.log("this.state.registerSwitch", this.state.registerSwitch)

    if (this.state.whatsappNumber.length == 11) {
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
      alert('Invalid Number');
    }
  }
  updateNumber() {
    let {user, actions} = this.props;
    user = user.user.user;

    var number = 0;

    do {
      number = Math.floor(Math.random() * 10000) + 1;
      console.log('number', number);
    } while (number < 1000 || number > 10000);

    camelapp
      .post('sendsms', {
        phone: this.state.phoneNumber,
        message: number,
      })
      .then(response => {
        if (response.data.status === true) {
          this.setState({modalOtp: true, modalPhone: false, otpValue: number});
        }
      })
      .catch(error => {
        console.log('error', error);
        this.setState({loader: false, btnPressed: false});
      });
  }
  verifiedSms() {
    let {actions} = this.props;

    camelapp
      .post('/update', {
        user_id: this.props.user.user.user.id,
        phone: this.state.phoneNumber,
      })
      .then(res => {
        console.log('res', res.data);

        if (res.data.status == true) {
          actions.userData(res.data);
          this.setState({modalOtp: false, modalPhone: false});
          alert('Phone Updated Successfully');
        } else {
          alert('Phone Number Already Exist');
        }
      });
  }
  chatflag(value) {
    console.log('================++VALUE++===========');
    console.log(value);
    console.log('====================================');

    this.setState({chatFlag: value});
  }
  onRegisterSwitchChanged(value) {
    //console.log("value", value)
    this.setState({registerSwitch: value});
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

    const navigationKey = categoryMap[item.category_id];
    if (navigationKey) {
      this.props.navigation.navigate(navigationKey);
    }
  };

  fetchUser() {
    let {user, actions} = this.props;
    user = user.user.user;
    console.log('================00USER00====================');
    console.log(user);
    console.log('====================================');
    try {
      camelapp.get('/get/fetchUser/' + user.id).then(res => {
        // console.log('response at fetch', res.data);
        actions.userData(res.data);
        this.setState({
          whatsappNumber: this.props.user.user.user.whatsapp_no,
          phoneNumber: this.props.user.user.user.phone,
          chatFlag:
            this?.props?.user?.user?.user?.chat_status == 0 ? false : true,
          registerSwitch:
            this.props.user.user.user.whatsapp_status == 0 ? false : true,

          posts: res.data.posts,
        });
      });
    } catch (error) {
      //console.log("error at fetch user", error.response)
    }
  }

  componentDidMount() {
    this.checkUserLogedIn();
  }

  onPostDelete(item) {
    //console.log("item", item.id);

    this.setState({loader: true});

    camelapp
      .post('delete/post', {
        post_id: item.id,
      })
      .then(response => {
        if (response.data) {
          //console.log("---- delete post", response.data)

          this.fetchUser();
          this.checkUserLogedIn();

          this.setState({loader: false});
        }
      });

    // deletePost(item.id).then((response) => {
    //   //console.log("response post deleted --- ", response)
    //   if (response.data.status != falase) {
    //     alert("Post Deleted Succesfully");
    //   } else {
    //     alert("Error Deleting Post");

    //   }
    // })
  }

  openFollowersModal() {
    //console.log("follower Modal is")

    this.setState({modal: true});
  }
  openFollowingModal() {
    this.setState({modalFollowing: true});
    //console.log("Follwing Modal is")
  }

  logOut() {
    console.log('====================================');
    console.log('LOGOUT');
    console.log('====================================');
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('user_check_in');

    this.props.navigation.replace('Login');
  }

  ScrollToRefresh() {
    this.fetchUser();
    this.setState({refreshing: false});
  }
  // componentDidMount = () => {
  //   this.focusListener = this.props.navigation.addListener('focus', () => {
  //     this.fetchUser();
  //   });
  // };

  render() {
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
    const onLikesClick = item => {
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
              filterPosts[tempIndex] = tempItem;

              this.setState({loading: false, filterPosts: filterPosts});
              alert(ArabicText.Succesfully_liked);
            }
            if (response.data.status == false) {
              let filterPosts = this.state.filterPosts;

              let tempIndex = filterPosts.indexOf(item);

              let like_count = item.like_count - 1;
              let tempItem = item;
              tempItem['like_count'] = like_count;
              filterPosts[tempIndex] = tempItem;

              this.setState({loading: false, filterPosts: filterPosts});
              alert(ArabicText.Successfully_Unliked);
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
    // onDetailsClick = async item => {
    //   let {user} = this.props;
    //   user = user.user.user;
    //   let post_id = item.id;
    //   if (user != undefined) {
    //     await camelapp
    //       .post('/add/view', {
    //         user_id: user.id,
    //         post_id: post_id,
    //       })
    //       .then(response => {
    //         console.log('response.data', response.data);
    //         if (item.category_id == '1') {
    //           this.props.navigation.navigate('CamelClubDetailsComponent', {
    //             itemFromDetails: item,
    //           });
    //         }

    //         if (item.category_id == '4') {
    //           this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '3') {
    //           this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '2') {
    //           this.props.navigation.navigate('DetailsSellingCamel', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '6') {
    //           this.props.navigation.navigate('DetailsComponentWithPrice', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '8') {
    //           this.props.navigation.navigate('DetailsComponentWithPrice', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '5') {
    //           this.props.navigation.navigate('DetailsMovingCamel', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '9') {
    //           this.props.navigation.navigate('DetailsMarketingCamel', {
    //             itemFromDetails: item,
    //           });
    //         }

    //         if (item.category_id == '11') {
    //           this.props.navigation.navigate('DetailsFemaleCamel', {
    //             itemFromDetails: item,
    //           });
    //         }
    //         if (item.category_id == '7') {
    //           this.props.navigation.navigate('DetailsComponent', {
    //             itemFromDetails: item,
    //           });
    //         }
    //       })
    //       .catch(error => {
    //         console.log('error', error);
    //       });
    //   } else {
    //     if (item.category_id == '1') {
    //       this.props.navigation.navigate('CamelClubDetailsComponent', {
    //         itemFromDetails: item,
    //       });
    //     }

    //     if (item.category_id == '4') {
    //       this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '3') {
    //       this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '2') {
    //       this.props.navigation.navigate('DetailsSellingCamel', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '6') {
    //       this.props.navigation.navigate('DetailsComponentWithPrice', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '8') {
    //       this.props.navigation.navigate('DetailsComponentWithPrice', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '5') {
    //       this.props.navigation.navigate('DetailsMovingCamel', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '9') {
    //       this.props.navigation.navigate('DetailsMarketingCamel', {
    //         itemFromDetails: item,
    //       });
    //     }

    //     if (item.category_id == '11') {
    //       this.props.navigation.navigate('DetailsFemaleCamel', {
    //         itemFromDetails: item,
    //       });
    //     }
    //     if (item.category_id == '7') {
    //       this.props.navigation.navigate('DetailsComponent', {
    //         itemFromDetails: item,
    //       });
    //     }
    //   }

    //   // this.props.navigation.navigate("DetailsComponent", { itemFromDetails: item })
    // };

    // ========NEW==========
    onDetailsClick = async item => {
      const {user} = this.props;
      const post_id = item.id;
      const categoryMap = {
        1: 'CamelClubDetailsComponent',
        2: 'DetailsSellingCamel',
        3: 'DetailsMissingAndTreatingCamel',
        4: 'DetailsMissingAndTreatingCamel',
        5: 'DetailsMovingCamel',
        6: 'DetailsComponentWithPrice',
        7: 'DetailsComponent',
        8: 'DetailsComponentWithPrice',
        9: 'DetailsMarketingCamel',
        11: 'DetailsFemaleCamel',
      };

      const navigateToDetails = categoryName => {
        this.props.navigation.navigate(categoryName, {
          itemFromDetails: item,
        });
      };

      if (user && user.user.user) {
        await camelapp
          .post('/add/view', {
            user_id: user.user.user.id,
            post_id: post_id,
          })
          .then(response => {
            console.log('response.data', response.data);
            const navigationKey = categoryMap[item.category_id];
            if (navigationKey) {
              navigateToDetails(navigationKey);
            }
          })
          .catch(error => {
            console.log('error', error);
          });
      } else {
        const navigationKey = categoryMap[item.category_id];
        if (navigationKey) {
          navigateToDetails(navigationKey);
        }
      }
    };

    const renderItem = ({item}) => {
      let array = item?.img;

      // console.log("array", array)
      let imagesArray = [];

      array.forEach(element => {
        if (element) {
          imagesArray.push({type: 'image', source: element});
        }
      });

      if (item.video == null) {
        imagesArray.push({type: 'video', source: null});
      } else {
        imagesArray.push({type: 'video', source: item.video});
      }

      return (
        <Item
          item={item}
          imagesArray={imagesArray}
          likes={item.like_count}
          title={item.title}
          comments={item.comment_count}
          shares={item.share_count}
          views={item.view_count}
          userName={item.user_name}
          userCity={item.user_location}
          userImage={item.user_images}
          category={item.category_name}
          onPostDelete={() => this.onPostDelete(item)}
          onDetailsClick={() => onDetailsClick(item)}
          onLikesClick={() => onLikesClick(item)}
          onUserProfileClick={() => onUserProfileClick(item)}
          onCategoryClick={() => this.onCategoryClick(item)}
          onCommentsClick={() => onCommentsClick(item)}
          sharePost={() => sharePosts(item)}
        />
      );
    };

    return (
      <View style={Styles.containerProfile}>
        {this.props.user.user.user === undefined ? (
          this.props.navigation.navigate('Login')
        ) : (
          <View>
            <View style={Styles.headerProfile}>
              {/* Edit & Cart Icons Profile */}
              <View style={styles.head}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('EditProfile')}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={35}
                    color="#D2691Eff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('BidTab')}>
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
                <Image
                  source={{
                    uri:
                      // this.props.user.user.user  === undefined ? this.props.navigation.navigate('Login')  :
                      'http://www.tasdeertech.com/public/images/profiles/' +
                      this.props.user.user.user.image,
                    // "http://www.tasdeertech.com/public/images/profiles/" + this.props.user.user.user.image === undefined ? this.props.navigation.navigate('Login') : this.props.user.user.user.image
                  }}
                  style={styles.img}></Image>
                <Text style={styles.name}>
                  {this.props.user.user.user.name}
                </Text>
                <View
                  style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                  <AntDesign name="checkcircle" size={14} color="#e50000" />
                  <Text
                    style={{
                      color: '#e50000',
                      fontSize: 10,
                      textAlign: 'right',
                      marginRight: 4,
                    }}>
                    Premium Account
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
                <View
                  // onPress={() => this.openFollowingModal()}
                  style={styles.video}>
                  <Text style={styles.textcolor}>
                    {this.props.user.user.follwers}
                  </Text>
                  <Text style={styles.textcolor}>{ArabicText.Followers}</Text>
                </View>

                <Text style={{fontSize: 30, fontWeight: '400', color: '#fff'}}>
                  |
                </Text>

                <View style={styles.video}>
                  <Text style={styles.textcolor}>
                    {this.props.user.user.posts.length}
                  </Text>
                  <Text style={styles.textcolor}>{ArabicText.posts}</Text>
                </View>

                <Text style={{fontSize: 30, fontWeight: '400', color: '#fff'}}>
                  |
                </Text>

                <TouchableOpacity style={styles.video}>
                  <Text style={styles.textcolor}>
                    {this.props.user.user.following}
                  </Text>
                  <Text style={styles.textcolor}>{ArabicText.Following}</Text>
                </TouchableOpacity>
              </View>
            </View>

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
                      Add Whatsapp number
                    </Text>

                    <TextInput
                      value={this.state.whatsappNumber}
                      style={Styles.forminputsPrice}
                      placeholder="Whats App Number"
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
                        style={{margin: 3, fontWeight: 'bold', color: 'black'}}>
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
                        <Text style={Styles.textbtn}>{ArabicText.add}</Text>
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
                      Enable/dissable Chat
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{margin: 3, fontWeight: 'bold', color: 'black'}}>
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
                        <Text style={Styles.textbtn}>{ArabicText.add}</Text>
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
                      Update Phone
                    </Text>

                    <TextInput
                      value={this.state.phoneNumber}
                      style={Styles.forminputsPrice}
                      placeholder="Phone Number"
                      keyboardType="numeric"
                      onChangeText={text => this.setState({phoneNumber: text})}
                      placeholderTextColor="#b0b0b0"></TextInput>

                    <TouchableOpacity onPress={() => this.updateNumber()}>
                      <View style={Styles.btnform}>
                        <Text style={Styles.textbtn}>{ArabicText.add}</Text>
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
                    style={{color: '#8b4513', fontSize: 15, fontWeight: '600'}}>
                    Enter OTP Here
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
            {this.state.loader == false && (
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
                data={this.state.posts}
                renderItem={renderItem}
                keyExtractor={item_2 => item_2.id}
                contentContainerStyle={{paddingBottom: 10}}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.ScrollToRefresh()}
                  />
                }
                initialNumToRender={5}
                maxToRenderPerBatch={5}
              />
            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const Item = ({
  title,
  userName,
  userCity,
  image,
  likes,
  comments,
  shares,
  views,
  userImage,
  category,
  onPostDelete,
  onDetailsClick,
  onCommentsClick,
  onCategoryClick,
  onLikesClick,
  imagesArray,
}) => (
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
              {userName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                paddingRight: 5,
                color: 'black',
                textAlign: 'right',
              }}>
              {userCity}
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
              uri: 'http://www.tasdeertech.com/images/profiles/' + userImage,
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
      // keyExtractor={this.state.mixed.fileName}
      data={imagesArray}
      layout={'default'}
      scrollEnabled={true}
      // onScroll={() => this.setState({ pauseVideo: true})}
      renderItem={({item, index}) => {
        return (
          <View style={Styles.imageCarousal}>
            {item.type == 'image' && (
              <Image
                source={{
                  uri: 'http://www.tasdeertech.com/images/posts/' + item.source,
                }}
                key={String(index)}
                resizeMode={'cover'}
                style={Styles.image}
              />
            )}
            {item.type == 'video' && (
              <Video
                // onTouchStart={() => {
                //     ////console.log("Pause:  ", this.state.pauseVideo)
                //     this.setState({ pauseVideo: !this.state.pauseVideo })
                // }}
                source={{
                  uri: 'http://www.tasdeertech.com/videos/' + item.source,
                }} // Can be a URL or a local file.
                key={String(index)}
                resizeMode="stretch"
                repeat
                controls={false}
                // paused={this.state.pauseVideo}
                style={Styles.image}
              />
            )}
          </View>
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
          {views}
        </Text>
        <Ionicons name="ios-eye-sharp" size={20} color="#CD853F" />
      </TouchableOpacity>

      <TouchableOpacity
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
        onPress={onLikesClick}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
          {likes}
        </Text>
        <AntDesign name="hearto" size={18} color="#CD853F" />
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
  </Card>
);

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
});
