import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Toast from 'react-native-toast-message';
import camelapp from '../api/camelapp';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import VideoModal from '../components/VideoModal';
import HorizontalCarousel from '../components/HorizontalCarousel';
import BackBtnHeader from '../components/headerWithBackBtn';
import {profileBaseUrl, thumbnailBaseUrl} from '../constants/urls';
import {family} from '../constants/Family';

const width = Dimensions.get('screen').width;
class CamelClubDetailsComponent extends Component {
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

    this.state = {
      itemFromDetails,
      user: {
        id: user_id,
        name: user_name,
        image: user_images,
        whatsapp_status: user_whatsapp_status,
        whatsapp_no: user_chat_status,
      },
      imagesArray: [],
      pauseVideo: true,
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
    };
  }

  componentDidMount() {
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
    let array = itemFromDetails.img;
    let imagesArray = [];
    array[0] !== '' &&
      array.forEach(element => {
        imagesArray.push({type: 'image', source: element});
      });
    itemFromDetails?.video !== null &&
      imagesArray.push({
        type: 'video',
        source: itemFromDetails?.video,
      });
    this.setState({imagesArray: imagesArray});
  }
  onCommentsClick = () => {
    const item = this.props.route.params?.itemFromDetails || {};
    let {user} = this.props;
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
    let {user} = this.props;
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
                console.log('notSupported');
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
          console.log('disabledd');
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
    let {user} = this.props;
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
    const {pausedCheck, loadVideo, videoModal, modalItem, imagesArray} =
      this.state;
    const itemFromDetails = this.props.route.params?.itemFromDetails || {};
    const loggedUser = this.state.user;
    let user = this.props?.user;
    user = user?.user?.user;
    const thumbnail = itemFromDetails?.thumbnail?.thumbnail;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: width * 0.4, backgroundColor: '#d2691e'}}>
        <BackBtnHeader />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            marginTop: 15,
            backgroundColor: '#fff',
          }}>
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                marginRight: 20,
                fontFamily: family.Neo_Medium,
              }}>
              {itemFromDetails.name}
            </Text>
            <Text
              style={{
                color: '#000',
                fontSize: 14,
                marginRight: 20,
                fontFamily: family.Neo_Regular,
              }}>
              {itemFromDetails.user_location}
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

        <View style={Styles.containerDetails}>
          <HorizontalCarousel
            thumbnail={thumbnailBaseUrl + thumbnail}
            price={itemFromDetails?.price ? itemFromDetails?.price : ''}
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
              this.setState({pausedCheck: true});
            }}
          />
          <View style={{textAlign: 'right'}}>
            <Text style={Styles.textHeadingg}>{ArabicText.Title}</Text>
            <TextInput
              value={itemFromDetails.title}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.title}
              editable={false}></TextInput>
            <Text style={Styles.textHeadingg}> {ArabicText.Location}</Text>
            <TextInput
              value={itemFromDetails.location}
              style={Styles.forminputsDetails}
              placeholder={itemFromDetails.location}
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

          {/* SOCIAL ICONS */}
          {user !== undefined && user?.id !== loggedUser?.id && (
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
            this.setState({loadVideo: true});
          }}
          onReadyForDisplay={() => {
            this.setState({loadVideo: false});
          }}
          onPress={() => {
            !loadVideo && this.setState({pausedCheck: !pausedCheck});
          }}
          closeModal={() => {
            this.setState({videoModal: false, pausedCheck: true});
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CamelClubDetailsComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeadingg: {
    textAlign: 'right',
    fontSize: 14,
    padding: 5,
    marginTop: 2,
    right: 0,
    color: 'black',
    fontFamily:family.Neo_Regular
  },
});
