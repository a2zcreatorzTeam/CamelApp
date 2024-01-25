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
  Linking,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Styles } from '../styles/globlestyle';
import camelapp from '../api/camelapp';
import { connect } from 'react-redux';
const width = Dimensions.get('screen').width;
import * as ArabicText from '../language/EnglishToArabic';
import HorizontalCarousel from '../components/HorizontalCarousel';
import VideoModal from '../components/VideoModal';
import BackBtnHeader from '../components/headerWithBackBtn';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';
import { profileBaseUrl, thumbnailBaseUrl } from '../constants/urls';
class DetailsComponent extends Component {
  constructor(props) {
    super(props);
    const itemFromDetails = props.route.params?.itemFromDetails || {};
    const {
      user_id,
      user_name,
      user_images,
      user_whatsapp_status,
      user_chat_status,
    } = itemFromDetails;
    let { bid_status, price } = itemFromDetails;
    this.state = {
      itemFromDetails,
      user: {
        id: user_id,
        name: user_name,
        image: user_images,
        whatsapp_status: user_whatsapp_status,
        whatsapp_no: user_chat_status,
      },
      flagForBid: false,
      modalOffer: false,
      pauseVideo: true,
      price,
      pausedCheck: true,
      videoModal: false,
      modalItem: '',
      loadVideo: false,
      imagesArray: [],
      bidStatus: null,
      closeOffer: bid_status === 1,
      load: false,
    };
  }

  componentDidMount() {
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
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
        imagesArray.push({ type: 'image', source: element });
      });
    itemFromDetails?.video !== null &&
      imagesArray.push({
        type: 'video',
        source: itemFromDetails?.video,
      });

    this.setState({ imagesArray: imagesArray });
  }
  onCommentsClick = () => {
    let item = this.props.route.params?.itemFromDetails || {};
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
  // DAIL NUMBER
  audioCall() {
    let { user } = this.props;
    user = user?.user?.user ? user?.user?.user : user?.user;
    let otherUser = this.props.route.params.itemFromDetails;
    console.log('498');
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
    console.log(otherUser, 'profileee');
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
  checkBidStatus = () => {
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
    let { user } = this.props;
    user = user?.user?.user;
    if (user !== undefined && user?.id != itemFromDetails.user_id) {
      camelapp
        .post('/checkBid', {
          user_id: user?.id,
          post_id: itemFromDetails?.id,
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
    const { price } = this.state;
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
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
                  this.setState({ bidStatus: true });
                  this.setState({ modalOffer: false });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: ArabicText?.Errorinaddingbid,
                    visibilityTime: 3000,
                  });
                }
              });
          } else {
            Toast.show({
              type: 'error',
              text1: ArabicText?.You_can_not_Place_bid_on_your_price,
              visibilityTime: 3000,
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: ArabicText?.Offer_can_not_be_less_than_base_price,
            visibilityTime: 3000,
          });
        }
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  closeBid() {
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
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
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      this.setState({ load: true });
      camelapp
        .post('/chat/request/notification', {
          user_id: user?.id,
          friend_id: itemFromDetails?.user_id,
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
  render() {
    let user = this.props?.user;
    user = user?.user?.user;
    const {
      pausedCheck,
      loadVideo,
      videoModal,
      modalItem,
      imagesArray,
      bidStatus,
      flagForBid,
      closeOffer,
      load,
      modalOffer,
      price,
    } = this.state;

    const loggedUser = this.state.user;
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
    const thumbnail = itemFromDetails?.thumbnail?.thumbnail;
    console.log(itemFromDetails?.bid_status, "itemFromDetails?.bit_status");
    return (
      <ScrollView style={{ backgroundColor: '#ffff' }}>
        <BackBtnHeader />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            marginTop: 15,
          }}>
          {/* PRICE SECTION */}
          <View
            style={{
              backgroundColor: '#D2691Eff',
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '800',
                fontSize: 14,
              }}>
              {' '}
              {ArabicText?.Price}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '500',
                fontSize: 13,
              }}>
              {itemFromDetails?.bid_price > 0
                ? itemFromDetails?.bid_price
                : itemFromDetails?.price}
            </Text>
          </View>
          {/* PROFILE VIEW */}
          <View style={{ alignItems: 'flex-end', width: '70%' }}>
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: '700',
                marginRight: 20,
              }}>
              {itemFromDetails?.name}
            </Text>
            <Text style={{ color: '#000', fontSize: 14, marginRight: 20 }}>
              {itemFromDetails?.location
                ? itemFromDetails?.location
                : itemFromDetails?.user_location}
            </Text>
          </View>

          <View
            style={{
              height: 63,
              width: 63,
              borderRadius: 50,
              backgroundColor: '#f3f3f3',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: profileBaseUrl + itemFromDetails.user_images,
              }}
              style={{
                height: 55,
                width: 55,
                resizeMode: 'center',
                borderRadius: 50,
              }}
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

            <Text style={Styles.textHeadingg}>{ArabicText?.camel}</Text>
            <TextInput
              value={itemFromDetails?.camel_type}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails?.camel_type}
              editable={false}></TextInput>
            <Text style={Styles.textHeadingg}>{ArabicText.Location}</Text>
            <TextInput
              value={itemFromDetails?.location}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails?.location}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Payment_Types}</Text>
            <TextInput
              value={itemFromDetails?.price_type}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails?.price_type}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText?.Description}</Text>
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
            <View style={Styles.centeredView}>
              <View style={Styles.modalView}>
                <Pressable
                  onPress={modalOffer =>
                    this.setState({ modalOffer: !modalOffer })
                  }>
                  <Ionicons
                    name="close"
                    size={30}
                    color="brown"
                  // style={{ marginLeft: width - 140 }}
                  />
                </Pressable>
                <Text style={{ margin: 5 }}>{ArabicText.offer_Up}</Text>

                <TextInput
                  value={price}
                  style={Styles.forminputsPrice}
                  placeholder="0.0"
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
          </Modal>
          {/* OFFER UP  */}
          {(itemFromDetails?.bit_status !== 'true' || itemFromDetails?.bit_status == 0 ||
            itemFromDetails?.bit_status !== true) &&
            user !== undefined &&
            closeOffer == false &&
            bidStatus !== null &&
            !bidStatus &&
            flagForBid &&
            user?.id !== loggedUser?.id && (
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

          {
            (itemFromDetails?.bit_status !== 'true' || itemFromDetails?.bit_status == 0 ||
              itemFromDetails?.bit_status !== true) &&
            user !== undefined &&
            closeOffer == false &&
            !flagForBid &&
            user?.id !== loggedUser?.id && (
              <TouchableOpacity
                style={{ marginBottom: 20, marginTop: 20 }}
                onPress={() => {
                  itemFromDetails?.chat_status == 1 ||
                    itemFromDetails?.chat_status == 'true' ||
                    itemFromDetails?.chat_status == true
                    ? this.props.navigation.navigate('MessageViewScreen', {
                      messageData: {
                        id: loggedUser?.id,
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
            )
          }
          {/* CLOSE OFFER  */}
          {(itemFromDetails?.bit_status !== 'true' || itemFromDetails?.bit_status == 0 ||
            itemFromDetails?.bit_status !== true) &&
            closeOffer == false &&
            user?.id == loggedUser?.id && (
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
          {user?.id !== undefined && user?.id !== loggedUser?.id && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                justifyContent: 'center',
              }}>
              {/* CHAT ICON  */}
              <TouchableOpacity
                onPress={() => {
                  itemFromDetails?.chat_status == 1 ||
                    itemFromDetails?.chat_status == 'true' ||
                    itemFromDetails?.chat_status == true
                    ? this.props.navigation.navigate('MessageViewScreen', {
                      messageData: {
                        id: loggedUser?.id,
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
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 8,
                }}>
                <Feather name="send" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText.message}</Text>
              </TouchableOpacity>
              {/* COMMENT ICON */}
              <TouchableOpacity
                onPress={() => this.onCommentsClick()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 8,
                }}>
                <Feather name="message-square" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText.comments}</Text>
              </TouchableOpacity>
              {/* WhatsApp */}
              <TouchableOpacity
                onPress={() => this.sendWhatsAppMessage()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 8,
                }}>
                <FontAwesome name="whatsapp" size={30} color="#CD853F" />
                <Text style={Styles.fontDetails}>{ArabicText?.whatsapp}</Text>
              </TouchableOpacity>
              {/* CALL USER */}
              <TouchableOpacity
                onPress={() => this.audioCall()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 8,
                }}>
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

export default connect(mapStateToProps, null)(DetailsComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
