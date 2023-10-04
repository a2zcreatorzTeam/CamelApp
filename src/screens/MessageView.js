import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import * as ArabicText from '../language/EnglishToArabic';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import camelapp from '../api/camelapp';
import {connect, useSelector} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {DataContext, getChatMessages} from '../context/DataContext';
import {useCallback} from 'react';
import {checkOrCreateChatRoom, sendMessage} from '../services';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import BackBtnHeader from '../components/headerWithBackBtn';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import GetLocation from 'react-native-get-location';
import {Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Linking} from 'react-native';

// class MessageView extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dataSource: [],
//       isLoading: true,
//       inputValue: '',
//       reciever_id: props.route.params.messageData.id,
//     };
//   }

//   componentDidMount() {
//     console.log('chattt');
//     // this.interval =
//     //     setInterval(() => {

//     //         this.getChatMessages();

//     //     }, 5000)
//     //console.log("props.route.params.messageData.sender_id", this.props.route.params.messageData.id);
//     this.getChatMessages();
//   }
//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   getChatMessages = async () => {
//     let {user} = this.props;

//     //console.log("user", user.user.user);

//     let sender_id = user.user.user.id;

//     let reciever_id = this.props.route.params.messageData.id;

//     await camelapp
//       .get('/getmsgchat/' + sender_id + '/' + reciever_id)
//       .then(response => {
//         //console.log("response getChatMessages", response.data);

//         this.setState({dataSource: response.data});
//       });
//   };

//   _renderItem = ({item, index}) => {
//     let {user} = this.props;

//     let sender_id = user.user.user.id;

//     //console.log("item", item)
//     return item.sender_id == sender_id ? (
//       <Card style={Styles.text_send}>
//         <Text style={{color: '#fff', textAlign: 'right', fontSize: 14}}>
//           {item.message}
//         </Text>
//         <Text style={{color: 'black', fontSize: 10}}>{item.created_at}</Text>
//       </Card>
//     ) : (
//       <Card style={Styles.text_send_right}>
//         <Text style={{color: '#d2691e', fontSize: 14}}>{item.message}</Text>
//         <Text style={{color: 'gray', textAlign: 'right', fontSize: 10}}>
//           {item.created_at}
//         </Text>
//       </Card>
//     );
//   };

//   sendMessage = () => {
//     let {user} = this.props;

//     //console.log("user", user.user.user);

//     let sender_id = user.user.user.id;

//     let reciever_id = this.props.route.params.messageData.id;

//     if (this.state.inputValue != '') {
//       camelapp
//         .post('/sendmsg', {
//           sender_id: sender_id,
//           reciever_id: reciever_id,
//           message: this.state.inputValue,
//         })
//         .then(response => {
//           //console.log('send message response', response);

//           this.setState({inputValue: ''});
//           this.getChatMessages();
//         });
//     }
//   };
//   handlePress = useCallback(
//     function () {
//       setIsLoading(true);
//       firebaseService.createMessage({message, uid}).then(function () {
//         setIsLoading(false);
//         setMessage('');
//       });
//     },
//     [message],
//   );

//   render() {
//     return (
//       <View
//         //style={Styles.containerMessageView}
//         style={{flex: 1, width: width, height: hight}}>
//         <FlatList
//           data={this.state.dataSource}
//           renderItem={this._renderItem}
//           keyExtractor={(item, index) => index.toString()}
//         />

//         <View style={Styles.msgbar}>
//           <TouchableOpacity
//             style={{left: 5, position: 'absolute', bottom: 0, marginRight: 10}}>
//             <Feather
//               name="send"
//               size={30}
//               color="#D2691E"
//               style={{
//                 left: 5,
//                 position: 'absolute',
//                 bottom: 7,
//                 marginTop: 40,
//                 transform: [{rotate: '225deg'}],
//               }}
//               onPress={() => this.sendMessage()}
//             />
//           </TouchableOpacity>
//           <TextInput
//             style={Styles.msginput}
//             placeholder={ArabicText.message}
//             placeholderTextColor="#b0b0b0"
//             onChangeText={text => this.setState({inputValue: text})}
//             value={this.state.inputValue}></TextInput>
//         </View>
//       </View>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   user: state.user,
// });

// const ActionCreators = Object.assign({}, userActions);
// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(MessageView);

const MessageView = ({route}) => {
  const [inputValue, setInputValue] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [key, setKey] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [image, setImage] = useState(null);
  const [mimeVedio, setMimeVideo] = useState(null);
  const [video, setVideo] = useState(null);

  const reciever_id = route.params.messageData.id;
  const user_id = useSelector(state => state?.user?.user?.user?.id);
  const user = useSelector(state => state?.user);
  const chatRoomId =
    user_id < reciever_id
      ? `${user_id}_${reciever_id}`
      : `${reciever_id}_${user_id}`;
  handlePress = () => {
    sendMessage(user_id, inputValue, chatRoomId, lat, long, image).then(
      success => {
        success && setInputValue(''),
          setModalVisible(false),
          setConfirmModal(false);
      },
    );
  };
  const proceed = async (lat, long) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };
  useEffect(() => {
    checkOrCreateChatRoom(chatRoomId, user_id, reciever_id);
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('timestamp', 'asc') // You can order messages by timestamp or other criteria
      .onSnapshot(querySnapshot => {
        const newMessages = [];
        querySnapshot.forEach(doc => {
          newMessages.push(doc.data());
        });
        setDataSource(newMessages?.reverse());
      });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  _renderItem = ({item, index}) => {
    console.log(item?.imageUrl, 'item?.longitude, item');
    const formattedDateTime = moment.unix(item?.timestamp).format('HH:mm:ss');
    let sender_id = user.user.user.id;
    return item?.sender == sender_id ? (
      <>
        {item?.latitude && item?.longitude ? (
          <>
            <TouchableOpacity
              style={styles.rightChatImageContainer}
              onPress={() => proceed(item?.latitude, item?.longitude)}>
              <Image
                source={require('../../assets/maps.jpg')}
                style={styles.chatImage}
              />
            </TouchableOpacity>
          </>
        ) : item?.imageUrl ? (
          <TouchableOpacity
            style={styles.rightChatImageContainer}
            // onPress={() => proceed(item?.latitude, item?.longitude)}
          >
            <Image
              source={{
                uri: item?.imageUrl?.pickedImage,
              }}
              style={styles.chatImage}
            />
          </TouchableOpacity>
        ) : (
          <>
            <Card style={Styles.text_send}>
              <Text style={{color: '#fff', textAlign: 'right', fontSize: 14}}>
                {item.text}
              </Text>
              <Text style={{color: 'black', fontSize: 10}}>
                {formattedDateTime}
              </Text>
            </Card>
          </>
        )}
      </>
    ) : (
      <>
        {item?.latitude && item?.longitude ? (
          <>
            <TouchableOpacity
              style={[styles.rightChatImageContainer, {left:0}]}
              onPress={() => proceed(item?.latitude, item?.longitude)}>
              <Image
                source={require('../../assets/maps.jpg')}
                style={styles.chatImage}
              />
            </TouchableOpacity>
          </>
        ) : item?.imageUrl ? (
          <TouchableOpacity
            style={styles.rightChatImageContainer}
            // onPress={() => proceed(item?.latitude, item?.longitude)}
          >
            <Image
              source={{
                uri: item?.imageUrl?.pickedImage,
              }}
              style={styles.chatImage}
            />
          </TouchableOpacity>
        ) : (
          <Card style={Styles.text_send_right}>
            <Text style={{color: '#d2691e', fontSize: 14}}>{item.text}</Text>
            <Text style={{color: 'gray', textAlign: 'right', fontSize: 10}}>
              {formattedDateTime}
            </Text>
          </Card>
        )}
      </>
    );
  };

  RenderList = () => {
    return (
      <FlatList
        contentContainerStyle={{paddingTop: 10}}
        inverted
        initialNumToRender={dataSource?.length}
        data={dataSource}
        renderItem={this._renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const requestLocationPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: `Alsyahd Mobile App`,
          message: 'Alsyahd needs location access to get your current location',

          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        alert('You can use the location');
      } else {
        console.log('location permission denied');
        alert('Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setlat(location?.latitude);
        setlong(location?.longitude);
        setImage('');
        setVideo('');
        handlePress();
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  const openGallery = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      selectionLimit: 1,
    })
      .then(async images => {
        if (images) {
          setImage({
            // image: undefined,
            pickedImage: 'data:image/png;base64,' + images?.data,
            imageShow: images?.path,
            mediaType: images?.mime,
          });
          setlat('');
          setlong('');
          setVideo('');
          setConfirmModal(true);
          setModalVisible(false);
          console.log('imagesa', 'data:image/png;base64' + images?.data);
        } else {
        }
      })
      .catch(error => {
        console.log('error', error);
      });
    // setModalVisible(false)
  };
  const selectOneFile = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      setMimeVideo(video?.mime);
      if (video) {
        if (video?.size > 10000000) {
          alert('Video must be less then 10 MB');
        } else {
          RNFS.readFile(video.path, 'base64')
            .then(res => {
              console.log('res====>', res);
              setVideo(res);
              setlat('');
              setlong('');
              setImage('');
              setConfirmModal(true);

              // this.setState({ videoForPost: "data:video/mp4;base64," + res });
              // let tempMixed = this.state.mixed;
              // let mixed = this.state.mixed;
              // let videoFlag = false;
              // if (tempMixed.length > 0) {
              //   tempMixed.map((item, index) => {
              //     if (item?.mime != undefined) {

              //       if (item?.mime.includes("video") === true) {
              //         mixed[index] = video
              //         videoFlag = true;
              //       }
              //     }
              //   })
              //   if (videoFlag === false) {
              //     mixed.push(video);
              //   }
              //   this.setState({ mixed: mixed, video: video });
              // } else {
              //   tempMixed.push(video);
              //   this.setState({ mixed: tempMixed, video: video });
              // }
            })
            .catch(err => {
              console.log(err.message, err.code);
            });
        }
      } else {
        alert('Please select the video.');
      }
    });
  };
  return (
    <View style={{flex: 1, width: width, height: hight}}>
      <BackBtnHeader />
      <RenderList />
      <View style={styles.inputContainer}>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => handlePress()}>
            {loader ? (
              <ActivityIndicator size={20} color={'orange'} />
            ) : (
              <Feather
                name="send"
                size={30}
                color="#D2691E"
                style={{
                  transform: [{rotate: '225deg'}],
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          {/* {image ? (
            <Image
              source={{uri: image?.imageShow}}
              style={{width: 30, height: 30, right: -40}}
            />
          ) : null}
          {video ? (
            <Image
              source={require('../../assets/videoImage.png')}
              style={{width: 30, height: 30, right: -40}}
            />
          ) : null}
          {lat ? (
            <Image
              source={require('../../assets/maps.jpg')}
              style={{width: 30, height: 30, right: -40}}
            />
          ) : null} */}
          <View style={{width: '90%', right: 8, position: 'absolute'}}>
            <TextInput
              style={{width: '100%', textAlign: 'right', color: '#000'}}
              placeholder={ArabicText?.Message}
              placeholderTextColor="#b0b0b0"
              onChangeText={text => setInputValue(text)}
              value={inputValue}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{width: '10%'}}>
          <Entypo
            name="attachment"
            size={18}
            color="#bbb"
            style={{
              alignSelf: 'flex-end',
              marginLeft: 'auto',

              // left: 5,
              // position: 'absolute',
              // bottom: 8,
              // marginTop: 40,
              // left:'70%'
            }}
          />
        </TouchableOpacity>
      </View>
      <PickerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        openGallery={openGallery}
        selectOneFile={selectOneFile}
        getLocation={getLocation}
      />

      <Modal
        visible={confirmModal}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setConfirmModal(false);
          setImage(null);
          setVideo(null);
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setConfirmModal(false);
            setImage(null);
            setVideo(null);
            setModalVisible(false);
          }}
          style={{
            marginVertical: 20,
            zIndex: 1111,
            marginHorizontal: 20,
          }}>
          <AntDesign name="closecircle" size={35} color="orange" />
        </TouchableOpacity>
        <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          {image ? (
            <Image
              resizeMode="contain"
              source={{uri: image?.imageShow}}
              style={{width: width, height: hight * 0.4}}
            />
          ) : null}
          {video ? (
            <Image
              source={require('../../assets/videoImage.png')}
              style={{width: width, height: hight * 0.7}}
            />
          ) : null}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              marginHorizontal: 20,
              marginVertical: 10,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  handlePress(), console.log('sendddd');
                }}>
                {loader ? (
                  <ActivityIndicator size={20} color={'orange'} />
                ) : (
                  <View
                    style={{
                      backgroundColor: '#D2691E',
                      padding: 8,
                      borderRadius: 20,
                    }}>
                    <Text>Send</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* <View style={Styles.msgbar}>
        <TouchableOpacity
          style={{left: 5, position: 'absolute', bottom: 0, marginRight: 10}}>
          <Feather
            name="send"
            size={30}
            color="#D2691E"
            style={{
              left: 5,
              position: 'absolute',
              bottom: 7,
              marginTop: 40,
              transform: [{rotate: '225deg'}],
            }}
            onPress={() => handlePress()}
          />
        </TouchableOpacity>
        <TextInput
          style={Styles.msginput}
          placeholder={ArabicText.message}
          placeholderTextColor="#b0b0b0"
          onChangeText={text => setInputValue(text)}
          value={inputValue}></TextInput>

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{position: 'absolute', bottom: 3, left: 4}}>
            <Entypo
              name="attachment"
              size={18}
              color="#bbb"
              style={{
                left: 5,
                position: 'absolute',
                bottom: 8,
                marginTop: 40,
              }}
            />
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

const PickerModal = prop => {
  return (
    <>
      {/* MODAL */}
      <Modal
        animationType="fade"
        visible={prop.modalVisible}
        transparent={true}
        onRequestClose={() => prop.setModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{height: '100%'}}
          onPress={() => prop.setModalVisible(false)}
        />

        <View
          style={{
            height: '25%',
            width: '96%',
            alignSelf: 'center',
            marginTop: 'auto',
            backgroundColor: '#ddd',
            borderRadius: 15,
            marginBottom: 55,
            elevation: 3,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 55,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => prop.openGallery()}
              style={[styles.pickerBTNs, {backgroundColor: '#BF026D'}]}>
              <Entypo name="image-inverted" size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => prop.selectOneFile()}
              style={[styles.pickerBTNs, {backgroundColor: '#8031A7'}]}>
              <Entypo name="video" size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => prop.getLocation()}
              style={[styles.pickerBTNs, {backgroundColor: '#00873E'}]}>
              <Entypo name="location-pin" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: 6,
    justifyContent: 'space-around',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    width: '75%',
    height: '75%',
    borderRadius: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pickerBTNs: {
    backgroundColor: '#D2691E',
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightChatImageContainer: {
    width: 200,
    height: 150,
    backgroundColor: '#D2691E',
    margin: 10,
    padding: 10,
    overflow: 'hidden',
    borderTopStartRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    left: width - 220,
  },
  chatImage: {
    width: '100%',
    height: '90%',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 70,
  },
});

export default MessageView;
