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
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Styles} from '../styles/globlestyle';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
const hight = Dimensions.get('screen').height;
import * as ArabicText from '../language/EnglishToArabic';
import HorizontalCarousel from './HorizontalCarousel';
import VideoModal from './VideoModal';
class DetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this?.props?.route?.params?.userId,
      user_ids: '',
      itemFromDetails: props.route.params.itemFromDetails,
      flagForBid: false,
      modalOffer: false,
      higherAmount: 0,
      price: 0,
      user: {
        id: this.props.route.params.itemFromDetails?.user_id,
        name: this.props.route.params.itemFromDetails.user_name,
        image: this.props.route.params.itemFromDetails.user_images,
        whatsapp_status:
          this.props.route.params.itemFromDetails.user_whatsapp_status,
        whatsapp_no: this.props.route.params.itemFromDetails.user_chat_status,
        buttonName: this.props.route.params.buttonName,
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
    let {user} = this.props;
    user = user.user.user;
    this.setState({user_ids: user?.id});
    console.log(this.state.itemFromDetails.img, 'jkjkjkjkjjjj');
    if (this.props.route.params.itemFromDetails.price_type == 'سوم') {
      this.setState({flagForBid: true});
    }
    console.log(this.state.itemFromDetails, ' this.state.itemFromDetails');
    let array = this.state.itemFromDetails.img;
    let imagesArray = [];

    array.forEach(element => {
      imagesArray.push({type: 'image', source: element});
    });
    imagesArray.push({
      type: 'video',
      source: this.state?.itemFromDetails?.video,
    });
    console.log(imagesArray, 'imagesArray');
    this.setState({imagesArray: imagesArray});

    // this.focusListener = this.props.navigation.addListener('focus', () => {
    //   // this.getLastPrice();
    // });
  }
  onCommentsClick = () => {
    let item = this.state.itemFromDetails;
    let {user} = this.props;
    user = user.user.user;
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

  sendWhatsAppMessage() {
    let {user} = this.props;

    // console.log('user', user.user.user);

    if (user?.user?.user?.id != this.state?.itemFromDetails?.user_id) {
      if (user.user.user != undefined) {
        // console.log(
        //   'this.state.itemFromDetails.user_whatsapp_status',
        //   this.state.itemFromDetails.user_whatsapp_status,
        // );

        //console.log("user", this.state.user)

        if (
          this.state.itemFromDetails.user_whatsapp_status == true ||
          this.state.itemFromDetails.user_whatsapp_status == '1'
        ) {
          let msg = 'Hello';
          let mobile = this.state.itemFromDetails?.user_whatsapp_no;

          if (mobile.length != 0) {
            if (msg) {
              let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
              Linking.openURL(url)
                .then(data => {
                  //console.log("WhatsApp Opened successfully " + data);
                })
                .catch(() => {
                  alert('Make sure WhatsApp installed on your device');
                });
            } else {
              alert('Please enter message to send');
            }
          } else {
            alert('This user has disabled chat');
          }
        } else {
          alert('This user has disabled chat');
        }
      } else {
        this.props.navigation.navigate('Login');
      }
    } else {
      alert('This is your post');
    }
  }

  sendMessage() {
    let {user} = this.props;
    if (user.user.user != undefined) {
      if (user?.user?.user?.id != this.state?.itemFromDetails?.user_id) {
        if (
          this.state.itemFromDetails.user_chat_status == true ||
          this.state.itemFromDetails.user_chat_status == '1'
        ) {
          this.props.navigation.navigate('MessageViewScreen', {
            messageData: this.state.user,
          });
        } else {
          alert('This user has disabled chat');
        }
      } else {
        alert('This is your post');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  placeBid() {
    console.log(
      this.props.route.params.itemFromDetails.price,
      'placebid',
      'this.state.price',
      this.state.price,
    );
    let {user} = this.props;
    user = user.user.user;
    if (user != undefined) {
      if (
        parseInt(this.state.price) >
        parseInt(this.props.route.params.itemFromDetails.price)
      ) {
        if (user.id != this.props.route.params.itemFromDetails.user_id) {
          camelapp
            .post('/checkBid', {
              user_id: user.id,
              post_id: this.state.itemFromDetails.id,
            })
            .then(response => {
              console.log(response.data.status, 'response.data.status');
              // this.getLastPrice();
              if (response.data.status == 'Not Exists') {
                camelapp
                  .post('/add/bid', {
                    user_id: user.id,
                    post_id: this.state.itemFromDetails?.id,
                    price: parseInt(this.state?.price),
                  })
                  .then(response => {
                    if (response.data.status == true) {
                      alert(response?.data?.message);
                      this.setState({modalOffer: false});
                      this.props.navigation.pop();
                    } else {
                      alert('Error in adding bid!');
                    }
                  });
              } else {
                alert('Bid already exists');
                this.setState({modalOffer: false});
              }
            });
        } else {
          console.log('====================================');
          console.log('You_can_not_Place_bid_on_your_price');
          console.log('====================================');
          alert(ArabicText.You_can_not_Place_bid_on_your_price + '');
        }
      } else {
        alert(ArabicText.Offer_can_not_be_less_than_base_price + '');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  // getLastPrice() {
  //   let item = this.state.itemFromDetails;
  //   let post_id = item?.id;
  //   camelapp
  //     .get(`/getLastBidPrice/${post_id}`, {
  //       post_id: post_id,
  //     })
  //     .then(res => {
  //       // console.log(res?.data);
  //       if (res?.data?.is_data_found == '0' || res?.data?.is_data_found == 0) {
  //         this.setState({higherAmount: 0});
  //       } else if (
  //         res?.data?.is_data_found == '1' ||
  //         res?.data?.is_data_found == 1
  //       ) {
  //         console.log(
  //           '================PRICE====================',
  //           res?.data?.data?.price,
  //         );
  //         this.setState({higherAmount: res?.data?.data?.price});
  //       }
  //     });
  // }

  render() {
    const {pausedCheck, loadVideo, videoModal, modalItem, imagesArray} =
      this.state;
    console.log(imagesArray, 'imgaearrayyyyy');
    return (
      <ScrollView style={{backgroundColor: '#fff'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            marginTop: 15,
          }}>
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: '700',
                marginRight: 20,
              }}>
              {this.state.itemFromDetails.name}
            </Text>
            <Text style={{color: '#000', fontSize: 14, marginRight: 20}}>
              {this.state.itemFromDetails.user_location}
            </Text>
          </View>
          {/* {this?.state?.higherAmount == 0 ? ( */}
          {/* PRICE SECTION */}

          {/* ) : (
            <View
              style={{
                marginTop: '25%',
                marginHorizontal: 20,
                position: 'absolute',
                zIndex: 1111,
                alignSelf: 'flex-start',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                height: hight / 2.5,
                width: '100%',
              }}>
              <View
                style={{
                  paddingTop: 5,
                  alignItems: 'center',
                  alignContent: 'center',
                  width: 60,
                  backgroundColor: '#D2691Eff',
                  height: hight * 0.065,
                  borderBottomRightRadius: 50,
                  borderBottomLeftRadius: 50,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '800',
                    fontSize: 14,
                  }}>
                  {' '}
                  {ArabicText.Price}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  {this?.state?.higherAmount}
                </Text>
              </View>
            </View>
          )} */}
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
                uri:
                  'http://www.tasdeertech.com/images/profiles/' +
                  this.state.itemFromDetails.user_images,
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
          <View
            style={{
              // marginTop: '18%',
              marginHorizontal: 20,
              position: 'absolute',
              zIndex: 1111,
              alignSelf: 'flex-start',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: hight / 2.5,
              width: '100%',
            }}>
            <View
              style={{
                paddingTop: 0,
                alignItems: 'center',
                alignContent: 'center',
                width: 60,
                backgroundColor: '#D2691Eff',
                height: hight * 0.065,
                borderBottomRightRadius: 50,
                borderBottomLeftRadius: 50,
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
                {this?.state?.itemFromDetails?.price}
              </Text>
            </View>
          </View>
          {/* <Carousel
            // keyExtractor={this.state.mixed.fileName}
            data={this.state.imagesArray}
            layout={'default'}
            scrollEnabled={true}
            onScroll={() => this.setState({pauseVideo: true})}
            renderItem={({item, index}) => {
              //console.log('item');
              return (
                <View style={Styles.imageCarousal}>
                  {item.type == 'image' && (
                    <Image
                      source={{
                        uri:
                          'http://www.tasdeertech.com/images/posts/' +
                          item.source,
                      }}
                      key={String(index)}
                      resizeMode={'cover'}
                      style={Styles.image}
                    />
                  )}
                  {item.type == 'video' && (
                    <Video
                      onTouchStart={() => {
                        this.setState({pauseVideo: !this.state.pauseVideo});
                      }}
                      source={{
                        uri: 'http://www.tasdeertech.com/videos/' + item.source,
                      }} // Can be a URL or a local file.
                      key={String(index)}
                      resizeMode="stretch"
                      controls={false}
                      paused={this.state.pauseVideo}
                      style={Styles.image}
                    />
                  )}
                </View>
              );
            }}
            sliderWidth={width}
            itemWidth={width}
          /> */}

          <HorizontalCarousel
            price={this?.state?.itemFromDetails?.price}
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
              value={this.state.itemFromDetails.title}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.title}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Color}</Text>

            <TextInput
              value={this.state.itemFromDetails.color}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.color}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Type}</Text>
            <TextInput
              value={this.state.itemFromDetails.camel_type}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.camel_type}
              editable={false}></TextInput>
            <Text style={Styles.textHeadingg}>{ArabicText.Location}</Text>
            <TextInput
              value={this.state.itemFromDetails.location}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.location}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>
              {ArabicText.How_will_you_pay_the_application_percentage}
            </Text>
            <TextInput
              value={this.state.itemFromDetails.commission}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.commission}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Payment_Types}</Text>
            <TextInput
              value={this.state.itemFromDetails.price_type}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.price_type}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Description}</Text>
            <TextInput
              value={this.state.itemFromDetails.description}
              style={Styles.inputdecrp}
              placeholder={this.state.itemFromDetails.description}
              editable={false}></TextInput>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalOffer}>
            <TouchableWithoutFeedback>
              <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                  <Pressable
                    onPress={modalOffer =>
                      this.setState({modalOffer: !modalOffer})
                    }>
                    <Ionicons name="close" size={30} color="brown" />
                  </Pressable>
                  <Text style={{margin: 5}}>{ArabicText.offer_Up}</Text>
                  <TextInput
                    value={this.state.price}
                    style={Styles.forminputsPrice}
                    placeholder={ArabicText.offer_Up_placeholder}
                    onChangeText={text => this.setState({price: text})}
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

          {this.state.flagForBid &&
            this?.state?.user_ids !== this?.state?.user?.id && (
              <TouchableOpacity
                style={{marginBottom: 20, marginTop: 20}}
                onPress={() => this.setState({modalOffer: true})}>
                <View style={Styles.btnform}>
                  <Text style={Styles.textbtn}>{ArabicText.MyBids}</Text>
                </View>
              </TouchableOpacity>
            )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.sendMessage()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <Feather name="send" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>{ArabicText.message}</Text>
            </TouchableOpacity>
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

            <TouchableOpacity
              onPress={() => this.sendWhatsAppMessage()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <FontAwesome name="whatsapp" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>واتساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <AntDesign name="mobile1" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>{ArabicText.phone}</Text>
            </TouchableOpacity>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailsComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
