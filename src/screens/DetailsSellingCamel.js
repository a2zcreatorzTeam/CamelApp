import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Styles } from '../styles/globlestyle';
import camelapp from '../api/camelapp';
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import { bindActionCreators } from 'redux';
const width = Dimensions.get('screen').width;
import * as ArabicText from '../language/EnglishToArabic';
import HorizontalCarousel from '../components/HorizontalCarousel';
import VideoModal from '../components/VideoModal';
import BackBtnHeader from '../components/headerWithBackBtn';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';
import { profileBaseUrl, thumbnailBaseUrl } from '../constants/urls';
import { family } from '../constants/Family';
class DetailsComponent extends Component {
  constructor(props) {
    super(props);
    let bid_status = props.route.params.itemFromDetails?.bid_status;
    let itemFromDetails = props.route.params.itemFromDetails;
    this.state = {
      userId: this?.props?.route?.params?.userId,
      itemFromDetails: itemFromDetails,
      flagForBid: false,
      modalOffer: false,
      higherAmount: 0,
      price: 0,
      user: {
        id: itemFromDetails?.user_id,
        name: itemFromDetails?.user_name,
        image: itemFromDetails?.user_images,
        whatsapp_status: itemFromDetails?.user_whatsapp_status,
        whatsapp_no: itemFromDetails?.user_chat_status,
        buttonName: this.props.route.params.buttonName,
      },
      imagesArray: [],
      pauseVideo: true,
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
      bidStatus: null,
      closeOffer: bid_status == 1 ? true : false,
      load: false,
    };
  }
  componentDidMount() {
    const bid = this.props.route.params?.bid;
    let itemFromDetails = this.props.route.params.itemFromDetails;
    console.log(itemFromDetails.price_type, 'priveeee');
    this.checkBidStatus();
    if (
      itemFromDetails.price_type == 'سوم' ||
      itemFromDetails.price_type == 'موس'
    ) {
      this.setState({ flagForBid: true });
    }
    let array = itemFromDetails?.img;
    let imagesArray = [];
    array[0] !== '' &&
      array.forEach(element => {
        imagesArray.push({
          type: 'image',
          source: bid ? element?.image : element,
        });
      });
    itemFromDetails?.video !== null &&
      imagesArray.push({
        type: 'video',
        source: itemFromDetails?.video,
      });
    this.setState({ imagesArray: imagesArray });
  }
  onCommentsClick = () => {
    let item = this.state.itemFromDetails;
    let { user } = this.props;
    user = user?.user?.user;
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
  sendMessage() {
    const { itemFromDetails } = this.state;
    const loggedUser = this.state.user;
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      if (user.id != itemFromDetails?.user_id) {
        if (
          itemFromDetails.user_chat_status == true ||
          itemFromDetails.user_chat_status == '1'
        ) {
          this.props.navigation.navigate('MessageViewScreen', {
            messageData: loggedUser,
          });
        } else {
          Toast.show({
            text1: ArabicText?.Thisuserhasdisabledchat,
            type: 'error',
            visibilityTime: 3000,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: ArabicText?.Thisisyourpost,
          visibilityTime: 3000,
        });
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  checkBidStatus = () => {
    const { itemFromDetails } = this.props.route.params;
    let { user } = this.props;
    user = user?.user?.user;
    if (user !== undefined && user?.id != itemFromDetails?.user_id) {
      camelapp
        .post('/checkBid', {
          user_id: user.id,
          post_id: itemFromDetails.id,
        })
        .then(response => {
          if (response.data.status == 'Not Exists') {
            this.setState({ bidStatus: false });
          } else {
            this.setState({ bidStatus: true });
          }
        });
    }
  };
  placeBid() {
    const { itemFromDetails, price } = this.state;
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      if (itemFromDetails.price_type == 'سوم') {
        if (
          parseInt(price) >
          parseInt(
            itemFromDetails?.bid_price > 0
              ? itemFromDetails.bid_price
              : itemFromDetails?.price,
          )
        ) {
          if (user?.id != itemFromDetails?.user_id) {
            camelapp
              .post('/add/bid', {
                user_id: user?.id,
                post_id: itemFromDetails?.id,
                price: parseInt(price),
              })
              .then(response => {
                if (response?.data?.status == true) {
                  Toast.show({
                    type: 'success',
                    text1: response?.data?.message,
                    visibilityTime: 3000,
                  });
                  // alert(response?.data?.message);
                  this.setState({ bidStatus: true });
                  this.setState({ modalOffer: false });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: ArabicText?.Errorinaddingbid,
                    visibilityTime: 3000,
                  });
                  // alert('Error in adding bid!');
                }
              });
          } else {
            Toast.show({
              type: 'error',
              text1: ArabicText?.You_can_not_Place_bid_on_your_price,
              visibilityTime: 3000,
            });
            // alert(ArabicText.You_can_not_Place_bid_on_your_price + '');
          }
        } else {
          Toast.show({
            type: 'error',
            text1: ArabicText?.Offer_can_not_be_less_than_base_price,
            visibilityTime: 3000,
          });
          // alert(ArabicText.Offer_can_not_be_less_than_base_price + '');
        }
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  closeBid() {
    const { itemFromDetails } = this.state;
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      camelapp
        .post('/closed/bid', {
          bid_status: 1,
          post_id: itemFromDetails?.id,
        })
        .then(response => {
          if (response?.data?.success == true) {
            this.setState({ closeOffer: true });
            Toast.show({
              text1: response?.data?.message,
              type: 'success',
              visibilityTime: 3000,
            });
          } else {
            Toast.show({
              text1: ArabicText.Errorinclosingbid,
              type: 'error',
              visibilityTime: 3000,
            });
          }
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  chatRequestNotification = item => {
    const { itemFromDetails } = this.state;
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      this.setState({ load: true });
      camelapp
        .post('/chat/request/notification', {
          user_id: user?.id,
          friend_id: this.state.user?.id,
          post_id: itemFromDetails?.id,
          type: 'CHAT',
        })
        .then(response => {
          this.setState({ load: false });
          if (response?.data?.success == true) {
            Toast.show({
              text1: ArabicText.Yourrequesthasbeensenttotheseller + '',
              type: 'success',
              visibilityTime: 3000,
            });
          } else {
            this.setState({ load: false });
            console.log('error');
          }
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  // DAIL NUMBER
  audioCall() {
    let { user } = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;
    let otherUser = this.props.route.params.itemFromDetails;
    if (user != undefined) {
      if (user?.id != otherUser?.user_id) {
        let phone = otherUser?.user_phone;
        if (
          otherUser?.phone_status == true ||
          otherUser?.phone_status == 'True' ||
          otherUser?.phone_status == 1
        ) {
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
                  text1: ArabicText?.Phonenumberisnotavailable,
                  visibilityTime: 3000,
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
            text1: ArabicText?.Thisuserhasdisabledmobilenumber,
            visibilityTime: 3000,
          });
          // alert('This user has disabled mobile number');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: ArabicText?.Thisisyourpost,
          visibilityTime: 3000,
        });
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  // WHATSAPP
  sendWhatsAppMessage() {
    let otherUser = this.props.route.params.itemFromDetails;
    let { user } = this.props;
    console.log(otherUser?.whatsapp_status);
    user = user?.user?.user ? user?.user?.user : user?.user;
    if (user != undefined) {
      if (
        otherUser?.whatsapp_status == 1 ||
        otherUser?.whatsapp_status == true
      ) {
        let msg = 'Hello';
        let mobile = otherUser?.whatsapp_no;
        if (mobile?.length != 0) {
          if (msg) {
            let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
            Linking.openURL(url)
              .then(data => {
                console.log(data, 'dataaaa');
                //console.log("WhatsApp Opened successfully " + data);
              })
              .catch(error => {
                Toast.show({
                  text1: ArabicText?.MakesureWhatsAppinstalledonyourdevice,
                  type: 'error',
                  visibilityTime: 3000,
                });
              });
          } else {
            Toast.show({
              text1: ArabicText?.Pleaseentermessagetosend,
              type: 'error',
              visibilityTime: 3000,
            });
          }
        } else {
          Toast.show({
            text1: ArabicText?.Thisuserhasdisabledchat,
            type: 'error',
            visibilityTime: 3000,
          });
        }
      } else {
        Toast.show({
          text1: ArabicText?.Thisuserhasdisabledchat,
          type: 'error',
          visibilityTime: 3000,
        });
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    let user = this.props?.user;
    user = user?.user?.user;
    const {
      pausedCheck,
      loadVideo,
      videoModal,
      modalItem,
      imagesArray,
      itemFromDetails,
      bidStatus,
      flagForBid,
      closeOffer,
      load,
      price,
      modalOffer,
    } = this.state;
    const postOwner = this.state.user;

    const thumbnail = itemFromDetails?.thumbnail?.thumbnail;

    return (
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <BackBtnHeader />
        <View
          style={Styles.firstView}>
          {/* PRICE SECTION */}
          <View
            style={Styles.priceView}>
            <Text
              style={Styles.priceTag}>
              {' '}
              {ArabicText?.Price}
            </Text>
            <Text
              numberOfLines={2}
              style={Styles.price}>
              {itemFromDetails?.bid_price > 0
                ? itemFromDetails?.bid_price
                : itemFromDetails?.price}
            </Text>
          </View>
          <View
            style={Styles.userDetailView}>
            <Text
              style={Styles.userName}>
              {itemFromDetails.name
                ? itemFromDetails?.name
                : itemFromDetails?.user_name}
            </Text>
            <Text style={Styles.userLocation}>
              {itemFromDetails?.location
                ? itemFromDetails?.location
                : itemFromDetails?.user_location}
            </Text>
          </View>
          <View
            style={Styles.imageView}>
            <Image
              source={{
                uri:
                  profileBaseUrl +
                  (itemFromDetails.user_images?.length
                    ? itemFromDetails.user_images
                    : itemFromDetails.user_image),
              }}
              style={Styles.profileImage}
            />
          </View>
        </View>

        <View style={[Styles.containerDetails, { paddingBottom: width * 0.1 }]}>
          <HorizontalCarousel
            thumbnail={thumbnailBaseUrl + thumbnail}
            price={itemFromDetails?.price}
            imagesArray={imagesArray}
            onPress={mediaSource => {
              this.setState({
                pausedCheck: false,
                videoModal: true,
                modalItem: mediaSource,
              });
            }}
            pausedCheck={pausedCheck}
            pauseVideo={() => {
              this.setState({ pausedCheck: true });
            }}
          />
          <View style={{ textAlign: 'right' }}>
            <Text style={Styles.textHeadingg}>{ArabicText.Title}</Text>
            <TextInput
              value={itemFromDetails.title}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.title}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Color}</Text>

            <TextInput
              value={itemFromDetails.color}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.color}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Type}</Text>
            <TextInput
              value={itemFromDetails.camel_type}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.camel_type}
              editable={false}></TextInput>
            <Text style={Styles.textHeadingg}>{ArabicText.Location}</Text>
            <TextInput
              value={itemFromDetails.location}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.location}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>
              {ArabicText.How_will_you_pay_the_application_percentage}
            </Text>
            <TextInput
              value={itemFromDetails.commission}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.commission}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Payment_Types}</Text>
            <TextInput
              value={itemFromDetails.price_type}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.price_type}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Description}</Text>
            <Text
              style={[
                Styles.inputdecrp,
                {
                  color: 'black',
                  height: undefined,
                },
              ]}>
              {itemFromDetails?.description}
            </Text>
          </View>
          <Modal animationType="slide" transparent={true} visible={modalOffer}>
            <TouchableWithoutFeedback>
              <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                  <Pressable
                    onPress={modalOffer =>
                      this.setState({ modalOffer: !modalOffer })
                    }>
                    <Ionicons name="close" size={30} color="brown" />
                  </Pressable>
                  <Text style={{ margin: 5, fontFamily: family.Neo_Regular, marginBottom: 0 }}>{ArabicText.offer_Up}</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={price}
                    style={Styles.forminputsPrice}
                    placeholder={ArabicText.offer_Up_placeholder}
                    onChangeText={text =>
                      this.setState({ price: text.replace(/[^0-9]/g, '') })
                    }
                    placeholderTextColor="#b0b0b0"></TextInput>
                  <TouchableOpacity onPress={() => this.placeBid()}>
                    <View style={Styles.btnform}>
                      <Text style={Styles.textbtn}>{ArabicText.offer_Up}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {/* OFFER UP  */}
          {(itemFromDetails?.bit_status !== 'true' ||
            itemFromDetails?.bit_status !== true) &&
            user !== undefined &&
            closeOffer == 0 &&
            bidStatus !== null &&
            !bidStatus &&
            flagForBid &&
            user?.id !== postOwner?.id && (
              <TouchableOpacity
                style={{ marginBottom: 20, marginTop: 20 }}
                onPress={() => this.setState({ modalOffer: true })}>
                <View style={Styles.btnform}>
                  {load ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text style={Styles.textbtn}>{ArabicText.MyBids}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          {/* FIXED PRICE  */}

          {(itemFromDetails?.bit_status !== 'true' ||
            itemFromDetails?.bit_status !== true) &&
            user !== undefined &&
            closeOffer == 0 &&
            !flagForBid &&
            user?.id !== postOwner?.id && (
              <TouchableOpacity
                style={{ marginBottom: 20, marginTop: 20 }}
                onPress={() => {
                  itemFromDetails?.chat_status == 1 ||
                    itemFromDetails?.chat_status == 'true' ||
                    itemFromDetails?.chat_status == true
                    ? this.props.navigation.navigate('MessageViewScreen', {
                      messageData: {
                        id: postOwner?.id,
                        user_name: itemFromDetails?.name,
                        user_image: itemFromDetails.user_images,
                      },
                    })
                    : this.chatRequestNotification();
                }}>
                <View style={Styles.btnform}>
                  <Text style={Styles.textbtn}>
                    {load ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      ArabicText.IamInterested
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          {/* CLOSE OFFER  */}
          {(itemFromDetails?.bit_status !== 'true' ||
            itemFromDetails?.bit_status !== true) &&
            closeOffer == 0 &&
            user?.id == postOwner?.id && (
              <TouchableOpacity
                style={{ marginBottom: 20, marginTop: 20 }}
                onPress={() => {
                  this.closeBid();
                }}>
                <View style={[Styles.btnform, { width: width / 3 }]}>
                  <Text style={[Styles.textbtn, { marginHorizontal: 10 }]}>
                    {load ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      ArabicText.CloseOffer
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          {/* SOCIAL ICONS */}
          {user?.id !== undefined && user?.id !== postOwner?.id && (
            <View
              style={Styles.socialIconView}>
              {/* CHAT ICON  */}
              <TouchableOpacity
                onPress={() => {
                  itemFromDetails?.chat_status == 1 ||
                    itemFromDetails?.chat_status == 'true' ||
                    itemFromDetails?.chat_status == true
                    ? this.props.navigation.navigate('MessageViewScreen', {
                      messageData: {
                        id: this?.state?.user?.id,
                        user_name: itemFromDetails?.name,
                        user_image: itemFromDetails.user_images,
                      },
                    })
                    : Toast.show({
                      text1: ArabicText?.Thisuserhasdisabledchat,
                      type: 'error',
                      visibilityTime: 3000,
                    });
                  //  this.chatRequestNotification();
                }}
                style={Styles.socialIcon}>
                <Feather name="send" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText.message}</Text>
              </TouchableOpacity>
              {/* COMMENT ICON */}
              <TouchableOpacity
                onPress={() => this.onCommentsClick()}
                style={Styles.socialIcon}>
                <Feather name="message-square" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText.comments}</Text>
              </TouchableOpacity>
              {/* WhatsApp */}
              <TouchableOpacity
                onPress={() => this.sendWhatsAppMessage()}
                style={Styles.socialIcon}>
                <FontAwesome name="whatsapp" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText?.whatsapp}</Text>
              </TouchableOpacity>
              {/* CALL USER */}
              <TouchableOpacity
                onPress={() => this.audioCall()}
                style={Styles.socialIcon}>
                <AntDesign name="mobile1" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText.phone}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* VIDEO MODAL */}
        <VideoModal
          onLoadStart={() => {
            this.setState({ loadVideo: true });
          }}
          onReadyForDisplay={() => {
            this.setState({ loadVideo: false });
          }}
          onPress={() => {
            !loadVideo && this.setState({ pausedCheck: !pausedCheck });
          }}
          closeModal={() => {
            this.setState({ videoModal: false, pausedCheck: true });
          }}
          pausedCheck={pausedCheck}
          loadVideo={loadVideo}
          videoModal={videoModal}
          modalItem={modalItem}
        />
      </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(DetailsComponent);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
