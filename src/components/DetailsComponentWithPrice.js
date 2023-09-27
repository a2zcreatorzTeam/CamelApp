// import React, {Component} from 'react';
// import {
//   View,
//   StyleSheet,
//   Image,
//   TextInput,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   Modal,
//   Pressable,
// } from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {Styles} from '../styles/globlestyle';
// import * as ArabicText from '../language/EnglishToArabic';
// import camelapp from '../api/camelapp';
// import {connect} from 'react-redux';
// import * as userActions from '../redux/actions/user_actions';
// import {bindActionCreators} from 'redux';
// class DetailsComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       itemFromDetails: props.route.params.itemFromDetails,
//       user: {
//         id: this.props.route.params.itemFromDetails.user_id,
//         name: this.props.route.params.itemFromDetails.user_name,
//         image: this.props.route.params.itemFromDetails.user_images,
//         whatsapp_status:
//           this.props.route.params.itemFromDetails.user_whatsapp_status,
//         whatsapp_no: this.props.route.params.itemFromDetails.user_chat_status,
//       },
//       flagForBid: false,
//       modalOffer: false,
//       pauseVideo: true,
//       price: 0,
//     };

//     //console.log("itemFromDetails", this.state.itemFromDetails);
//   }

//   componentDidMount() {
//     console.log('47777');
//     // if (this.props.route.params.itemFromDetails.price_type != 'FIX') {
//     //   this.setState({flagForBid: true});
//     // }
//   }

//   sendMessage() {
//     let {user} = this.props;
//     if (user.user.user != undefined) {
//       if (user?.user?.user?.id != this.state?.itemFromDetails?.user_id) {
//         if (
//           this.state.itemFromDetails.user_chat_status == true ||
//           this.state.itemFromDetails.user_chat_status == '1'
//         ) {
//           this.props.navigation.navigate('MessageViewScreen', {
//             messageData: this.state.user,
//           });
//         } else {
//           alert('This user has disabled chat');
//         }
//       } else {
//         alert('This is your post');
//       }
//     } else {
//       this.props.navigation.navigate('Login');
//     }
//   }

//   placeBid() {
//     let {user} = this.props;
//     user = user?.user?.user;
//     console.log(user?.id, 'usererer');
//     //console.log("user_id", user_id)
//     //console.log("post _data", parseInt(this.props.route.params.itemFromDetails.id))
//     if (
//       parseInt(this.state.price) >
//       parseInt(this.props?.route?.params?.itemFromDetails?.price)
//     ) {
//       if (user?.id != this.props.route.params?.itemFromDetails?.user_id) {
//         //console.log("this.state.itemFromDetails.id", this.state.itemFromDetails.id)
//         // checkBid(user_id, this.state.itemFromDetails.id).then(response => {
//         //   //console.log("response check bid", response)

//         //   if (response.status == 'Not Exists') {
//         //     placeBid(
//         //       user_id,
//         //       this.props.route.params.itemFromDetails.id,
//         //       parseInt(this.state.price),
//         //     ).then(response => {
//         //       if (response.status == true) {
//         //         alert(response.message);
//         //         this.setState({modalOffer: false});
//         //       } else {
//         //         alert('Error in adding bid!');
//         //       }
//         //     });
//         //   } else {
//         //     alert('Bid already exists');
//         //   }
//         //   //console.log("price", this.state.price)
//         // });
//         camelapp
//           .post('/checkBid', {
//             user_id: user.id,
//             post_id: this.state.itemFromDetails.id,
//           })
//           .then(response => {
//             console.log(response.data.status, 'response.data.status');
//             this.getLastPrice();
//             if (response.data.status == 'Not Exists') {
//               camelapp
//                 .post('/add/bid', {
//                   user_id: user.id,
//                   post_id: this.state.itemFromDetails?.id,
//                   price: parseInt(this.state?.price),
//                 })
//                 .then(response => {
//                   if (response.data.status == true) {
//                     alert(response?.data?.message);
//                     this.setState({modalOffer: false});
//                   } else {
//                     alert('Error in adding bid!');
//                   }
//                 });
//             } else {
//               alert('Bid already exists');
//               this.setState({modalOffer: false});
//             }
//           });
//       } else {
//         alert(ArabicText.You_can_not_Place_bid_on_your_price + '');
//       }
//     } else {
//       alert(ArabicText.Offer_can_not_be_less_than_base_price + '');
//     }
//   }
//   render() {
//     return (
//       <ScrollView style={{backgroundColor: '#ffff'}}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'flex-end',
//             paddingHorizontal: 20,
//             marginTop: 15,
//           }}>
//           <View style={{alignItems: 'flex-end'}}>
//             <Text
//               style={{
//                 color: '#000',
//                 fontSize: 20,
//                 fontWeight: '700',
//                 marginRight: 20,
//               }}>
//               {this.state.itemFromDetails.name}
//             </Text>
//             <Text style={{color: '#000', fontSize: 14, marginRight: 20}}>
//               {this.state.itemFromDetails.user_location}
//             </Text>
//           </View>

//           <View
//             style={{
//               height: 63,
//               width: 63,
//               borderRadius: 50,
//               backgroundColor: '#f3f3f3',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <Image
//               source={{
//                 uri:
//                   'http://www.tasdeertech.com/images/profiles/' +
//                   this.state.itemFromDetails.user_images,
//               }}
//               style={{
//                 height: 55,
//                 width: 55,
//                 resizeMode: 'center',
//                 borderRadius: 50,
//               }}
//             />
//           </View>
//         </View>
//         <View style={Styles.containerDetails}>
//           <Image
//             source={{
//               uri:
//                 'http://www.tasdeertech.com/images/posts/' +
//                 this.state.itemFromDetails.img[0],
//             }}
//             style={Styles.image}></Image>
//           <View style={{textAlign: 'right'}}>
//             <Text style={Styles.textHeadingg}>{ArabicText.Title}</Text>
//             <TextInput
//               value={this.state.itemFromDetails.title}
//               style={Styles.forminputsDetails}
//               placeholder={this.state.itemFromDetails.title}
//               editable={false}></TextInput>

//             <Text style={Styles.textHeadingg}>{ArabicText.Color}</Text>
//             <TextInput
//               value={this.state.itemFromDetails.color}
//               style={Styles.forminputsDetails}
//               placeholder={this.state.itemFromDetails.color}
//               editable={false}></TextInput>

//             <Text style={Styles.textHeadingg}>{ArabicText?.camel}</Text>
//             <TextInput
//               value={this.state?.itemFromDetails?.camel_type}
//               style={Styles.forminputsDetails}
//               placeholder={this.state?.itemFromDetails?.camel_type}
//               editable={false}></TextInput>
//             <Text style={Styles.textHeadingg}>{ArabicText.Location}</Text>
//             <TextInput
//               value={this.state?.itemFromDetails?.location}
//               style={Styles.forminputsDetails}
//               placeholder={this.state?.itemFromDetails?.location}
//               editable={false}></TextInput>

//             <Text style={Styles.textHeadingg}>{ArabicText.Payment_Types}</Text>
//             <TextInput
//               value={this.state?.itemFromDetails?.price_type}
//               style={Styles.forminputsDetails}
//               placeholder={this.state?.itemFromDetails?.price_type}
//               editable={false}></TextInput>

//             <Text style={Styles.textHeadingg}>{ArabicText?.Description}</Text>
//             <TextInput
//               value={this?.state.itemFromDetails?.description}
//               style={Styles.inputdecrp}
//               placeholder={this.state?.itemFromDetails?.description}
//               editable={false}></TextInput>
//           </View>

//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={this.state.modalOffer}>
//             <View style={Styles.centeredView}>
//               <View style={Styles.modalView}>
//                 <Pressable
//                   onPress={modalOffer =>
//                     this.setState({modalOffer: !modalOffer})
//                   }>
//                   <Ionicons
//                     name="close"
//                     size={30}
//                     color="brown"
//                     // style={{ marginLeft: width - 140 }}
//                   />
//                 </Pressable>
//                 <Text style={{margin: 5}}>{ArabicText.offer_Up}</Text>

//                 <TextInput
//                   value={this.state.price}
//                   style={Styles.forminputsPrice}
//                   placeholder="0.0"
//                   onChangeText={text => this.setState({price: text})}
//                   placeholderTextColor="#b0b0b0"></TextInput>

//                 <TouchableOpacity
//                   onPress={
//                     () => this.placeBid()()
//                     //   context?.placeBid,
//                     //   context?.checkBid,
//                     //   context?.data?.profile?.user.id,
//                   }>
//                   <View style={Styles.btnform}>
//                     <Text style={Styles.textbtn}>{ArabicText.offer_Up}</Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//           {this.state.flagForBid &&
//             this?.state?.user?.id !== this?.state?.user?.id && (
//               <TouchableOpacity
//                 style={{marginBottom: 20, marginTop: 20}}
//                 onPress={() => this.setState({modalOffer: true})}>
//                 <View style={Styles.btnform}>
//                   <Text style={Styles.textbtn}>{ArabicText.MyBids}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               marginTop: 20,
//               justifyContent: 'center',
//             }}>
//             <TouchableOpacity
//               onPress={() => this.sendMessage()}
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 margin: 8,
//               }}>
//               <Feather name="send" size={30} color="#CD853F" />
//               <Text style={Styles.fontDetails}>{ArabicText.message}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 margin: 8,
//               }}>
//               <Feather name="message-square" size={30} color="#CD853F" />
//               <Text style={Styles.fontDetails}>{ArabicText.comments}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 margin: 8,
//               }}>
//               <FontAwesome name="whatsapp" size={30} color="#CD853F" />
//               <Text style={Styles.fontDetails}>واتساب</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 margin: 8,
//               }}>
//               <AntDesign name="mobile1" size={30} color="#CD853F" />
//               <Text style={Styles.fontDetails}>{ArabicText.phone}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     );
//   }
// }

// // const mapStateToProps = state => ({
// //   user: state.user,
// // });

// // export default DetailsComponent;
// // export default connect(mapStateToProps, null)(DetailsComponent);

// const mapStateToProps = state => ({
//   user: state.user,
// });
// const ActionCreators = Object.assign({}, userActions);
// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });
// export default connect(mapStateToProps, mapDispatchToProps)(DetailsComponent);
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import * as ArabicText from '../language/EnglishToArabic';
import HorizontalCarousel from './HorizontalCarousel';
import VideoModal from './VideoModal';
import BackBtnHeader from './headerWithBackBtn';
class DetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemFromDetails: props.route.params.itemFromDetails,
      user: {
        id: this.props.route.params.itemFromDetails.user_id,
        name: this.props.route.params.itemFromDetails.user_name,
        image: this.props.route.params.itemFromDetails.user_images,
        whatsapp_status:
          this.props.route.params.itemFromDetails.user_whatsapp_status,
        whatsapp_no: this.props.route.params.itemFromDetails.user_chat_status,
      },
      flagForBid: false,
      modalOffer: false,
      pauseVideo: true,
      price: props?.route?.params?.itemFromDetails?.price,

      pausedCheck: true,
      videoModal: false,
      modalItem: '',
      loadVideo: false,
      imagesArray: [],
    };
  }

  componentDidMount() {
    // if (this.props.route.params.itemFromDetails.price_type != 'FIX') {
    //   this.setState({flagForBid: true});
    // }
    let array = this.state.itemFromDetails.img;
    console.log(
      this.state.itemFromDetails.img,
      'this.state.itemFromDetails.imgthis.state.itemFromDetails.img',
    );
    let imagesArray = [];

    array.forEach(element => {
      imagesArray.push({type: 'image', source: element});
    });
    imagesArray.push({type: 'video', source: this.state.itemFromDetails.video});

    this.setState({imagesArray: imagesArray});
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
    let {user} = this.props;
    user = user?.user?.user;
    if (
      parseInt(this.state.price) >
      parseInt(this.props?.route?.params?.itemFromDetails?.price)
    ) {
      if (user?.id != this.props.route.params?.itemFromDetails?.user_id) {
        //console.log("this.state.itemFromDetails.id", this.state.itemFromDetails.id)
        // checkBid(user_id, this.state.itemFromDetails.id).then(response => {
        //   //console.log("response check bid", response)

        //   if (response.status == 'Not Exists') {
        //     placeBid(
        //       user_id,
        //       this.props.route.params.itemFromDetails.id,
        //       parseInt(this.state.price),
        //     ).then(response => {
        //       if (response.status == true) {
        //         alert(response.message);
        //         this.setState({modalOffer: false});
        //       } else {
        //         alert('Error in adding bid!');
        //       }
        //     });
        //   } else {
        //     alert('Bid already exists');
        //   }
        //   //console.log("price", this.state.price)
        // });
        camelapp
          .post('/checkBid', {
            user_id: user?.id,
            post_id: this.state?.itemFromDetails?.id,
          })
          .then(response => {
            console.log(response?.data?.status, 'response.data.status');
            this.getLastPrice();
            if (response?.data?.status == 'Not Exists') {
              camelapp
                .post('/add/bid', {
                  user_id: user.id,
                  post_id: this.state?.itemFromDetails?.id,
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
        alert(ArabicText.You_can_not_Place_bid_on_your_price + '');
      }
    } else {
      alert(ArabicText.Offer_can_not_be_less_than_base_price + '');
    }
  }
  render() {
    const {videoModal, modalItem, pausedCheck, loadVideo} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#ffff'}}>
        <BackBtnHeader />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            marginTop: 15,
          }}>
          {/* PROFILE VIEW */}
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
        <View
          style={{
            marginTop: '20%',
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

        <View style={[Styles.containerDetails]}>
          <HorizontalCarousel
            price={this.state.itemFromDetails?.price}
            imagesArray={this.state.imagesArray}
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
          {/* <Image
            source={{
              uri:
                'http://www.tasdeertech.com/images/posts/' +
                this.state.itemFromDetails.img[0],
            }}
            style={Styles.image}></Image> */}
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

            <Text style={Styles.textHeadingg}>{ArabicText?.camel}</Text>
            <TextInput
              value={this.state?.itemFromDetails?.camel_type}
              style={Styles.forminputsDetails}
              placeholder={this.state?.itemFromDetails?.camel_type}
              editable={false}></TextInput>
            <Text style={Styles.textHeadingg}>{ArabicText.Location}</Text>
            <TextInput
              value={this.state?.itemFromDetails?.location}
              style={Styles.forminputsDetails}
              placeholder={this.state?.itemFromDetails?.location}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Payment_Types}</Text>
            <TextInput
              value={this.state?.itemFromDetails?.price_type}
              style={Styles.forminputsDetails}
              placeholder={this.state?.itemFromDetails?.price_type}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText?.Description}</Text>
            <TextInput
              value={this?.state.itemFromDetails?.description}
              style={Styles.inputdecrp}
              placeholder={this.state?.itemFromDetails?.description}
              editable={false}></TextInput>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalOffer}>
            <View style={Styles.centeredView}>
              <View style={Styles.modalView}>
                <Pressable
                  onPress={modalOffer =>
                    this.setState({modalOffer: !modalOffer})
                  }>
                  <Ionicons
                    name="close"
                    size={30}
                    color="brown"
                    // style={{ marginLeft: width - 140 }}
                  />
                </Pressable>
                <Text style={{margin: 5}}>{ArabicText.offer_Up}</Text>

                <TextInput
                  value={this.state.price}
                  style={Styles.forminputsPrice}
                  placeholder="0.0"
                  onChangeText={text => this.setState({price: text})}
                  placeholderTextColor="#b0b0b0"></TextInput>

                <TouchableOpacity
                  onPress={
                    () => this.placeBid()()
                    //   context?.placeBid,
                    //   context?.checkBid,
                    //   context?.data?.profile?.user.id,
                  }>
                  <View style={Styles.btnform}>
                    <Text style={Styles.textbtn}>{ArabicText.offer_Up}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {this.state.flagForBid &&
            this?.state?.user?.id !== this?.state?.user?.id && (
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
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <Feather name="message-square" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>{ArabicText.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity
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
      //     );
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const ActionCreators = Object.assign({}, userActions);
// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

export default connect(mapStateToProps, null)(DetailsComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
