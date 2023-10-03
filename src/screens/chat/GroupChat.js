import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Linking,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RNFS from 'react-native-fs';
import {Styles} from '../../styles/globlestyle';
import {Card} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ArabicText from '../../language/EnglishToArabic';
import camelapp from '../../api/camelapp';
import {FlatList} from 'react-native';
import {Image} from 'react-native';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import {connect, useSelector} from 'react-redux';
import * as userActions from '../../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import GetLocation from 'react-native-get-location';
const {width, height} = Dimensions.get('window');
import Video from 'react-native-video';
import VideoModal from '../../components/VideoModal';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import moment from 'moment';

const GroupChat = props => {
  const flatListRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [groupChat, setGroupChat] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [image, setImage] = useState(null);
  const [mimeVedio, setMimeVideo] = useState(null);
  const [video, setVideo] = useState(null);
  const [flagvideo, setFlagVedio] = useState([]);
  const [indexx, setIndexx] = useState();
  const [loader, setLoader] = useState(false);

  const [pausedCheck, setPausedCheck] = useState(true);
  const [modalItem, setModalItem] = useState('');
  const [videoModal, setVideoModal] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [modal, setModal] = useState(false);
  const [Infomodal, setInfoModal] = useState(false);

  const navigation = useNavigation();
  // const [sendMessage, setSendMessage] = useState([]);
  // const [showImage, setShowImage] = useState(undefined);
  // const [pickedImage, setPickedImage] = useState(undefined);

  // launchCamera(options?, callback);
  // const result = await launchCamera(options?);
  // console.log("IMAGE===>>> ", image?.imageShow)

  const {group_id} = props.route.params;
  console.log(image, 'IMAGE');
  let {user} = props;
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
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
    requestLocationPermission();
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location, 'LOCATIONNSS');
        setlat(location?.latitude);
        setlong(location?.longitude);
        setModalVisible(false);
        postLocation();
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  const postLocation = async () => {
    const groupDocumentId = props?.route?.params?.group_id;
    const locations = `${lat},${long}`;
    try {
      if (groupDocumentId) {
        // Add the message to a subcollection within the group document
        await firestore()
          .collection('groupChat') // Replace with your actual collection name
          .doc(groupDocumentId)
          .collection('messages')
          .add({
            senderId: user?.user?.user?.id, // Replace with the actual sender user ID
            message: inputValue,
            location: locations,
            timestamp: firebase?.firestore?.FieldValue.serverTimestamp(),
          });
        getDocumentIdForUserId();

        console.log('Message sent successfully');
        setInputValue('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
            pickedImage: images?.data,
            imageShow: images?.path,
            mediaType: images?.mime,
          });
          setModal(true);
        } else {
        }
        console.log('imagesa', image);
      })
      .catch(error => {
        console.log('error', error);
      });
    // setModalVisible(false)
  };
  const toTop = () => {
    flatListRef?.current?.scrollToEnd({animated: true, offset: 0});
  };
  const checkImage = () => {
    if (image == null) {
      null;
      return;
    } else {
      ['data:image/jpg/jpeg/png;base64' + image.pickedImage];
      return;
    }
  };
  const proceed = async item => {
    var newItem = item.split(',');

    var lat = newItem[0];
    var long = newItem[1];
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  const postGroupMedia = async () => {
    const groupDocumentId = props?.route?.params?.group_id;
    try {
      var paramsDataForImage = {
        senderId: user?.user?.user?.id, // Replace with the actual sender user ID
        message: inputValue,
        image: image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      var paramsDataForVideo = {
        senderId: user?.user?.user?.id, // Replace with the actual sender user ID
        // message: inputValue,
        video: video,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (groupDocumentId) {
        // Add the message to a subcollection within the group document
        await firestore()
          .collection('groupChat') // Replace with your actual collection name
          .doc(groupDocumentId)
          .collection('messages')
          .add({
            senderId: user?.user?.user?.id, // Replace with the actual sender user ID
            // message: inputValue,
            image: image,
            timestamp: firebase?.firestore?.FieldValue.serverTimestamp(),
          });
        getDocumentIdForUserId();

        console.log('Message sent successfully');
        setInputValue('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const postGroupChat = async () => {
    const groupDocumentId = props?.route?.params?.group_id;
    try {
      if (groupDocumentId) {
        // Add the message to a subcollection within the group document
        await firestore()
          .collection('groupChat') // Replace with your actual collection name
          .doc(groupDocumentId)
          .collection('messages')
          .add({
            senderId: user?.user?.user?.id, // Replace with the actual sender user ID
            message: inputValue,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

        console.log('Message sent successfully');
        setInputValue('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const postGroupChatssss = async () => {
    const locations = `${lat},${long}`;

    try {
      if (!inputValue) {
        setLoader(false);
        alert('Please Enter Message');
      } else {
        setLoader(true);
        const videoDummyLink = [`"data:${mimeVedio};base64",${video}"`];
        const imageDummyLink = [
          `"data:${image?.mediaType};base64,${image?.pickedImage}"`,
        ];
        console.log('====================================');
        console.log(videoDummyLink);
        console.log('====================================');
        const paramsData = {
          sender_id: user?.user?.user?.id,
          reciever_id: null,
          group_id: group_id,
          message: inputValue,
          location: lat ? locations?.toString() : null,
          file_url: image ? imageDummyLink : video ? videoDummyLink : null,
        };
        console.log('====================================');
        console.log(paramsData);
        console.log('====================================');

        await camelapp.post('/sendmsg', paramsData).then(res => {
          setLoader(false);
          setInputValue('');
          setImage(null);
          getGroupChat();
          setlat(null);
          setlong(null);
          setMimeVideo(null);
          setVideo(null);
          console.log(res.data, '<<<<postGroupChat res');
        });
      }
    } catch (error) {
      console.log(error.response, '<<<<postGroupChat ERROR');
    }
  };

  const getGroupChat = async () => {
    // try {
    //   console.log('group_id', group_id);
    //   const fetchConversation = await camelapp.get(
    //     '/getgroupconversation/' + group_id,
    //   );
    //   setGroupChat({chatData: fetchConversation.data});
    //   console.log(fetchConversation.data, '========GET chat DATA');
    // } catch (error) {
    //   console.log(error, '<<<<getGroupChat ERROR');
    // }
  };
  const selectOneFile = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      setMimeVideo(video?.mime);
      console.log('HGHJDGFHDGFJHD', video, 'VIDEO');
      if (video) {
        if (video?.size > 10000000) {
          alert('Video must be less then 10 MB');
        } else {
          RNFS.readFile(video.path, 'base64')
            .then(res => {
              console.log('res====>', res);
              setVideo(video.path);
              setModal(true);
              setImage(null);
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
  const onTouchStart = (index, item) => {
    var temArr = item;
    setIndexx(index);
    setFlagVedio(!temArr?.flagForVideo);
    console.log('====================================');
    console.log(flagvideo);
    console.log('====================================');

    //  temArr?.flagForVideo = !temArr?.flagForVideo ;

    var tempArray = groupChat.chatData;
    //   tempArray?.chatData[index]=item

    // setGroupChat( tempArray)
  };

  getUsersDetails = async (data, msgs) => {
    try {
      return await camelapp.post('getMultipleUsersDetails', data).then(res => {
        var arrayOfUserDetails = res?.data;
        console.log(arrayOfUserDetails, 'arrayOfUserDetails7');
        const mergedArray = arrayOfUserDetails.flatMap(obj1 => {
          const matchingObjects2 = msgs.filter(
            obj2 => obj2.senderId === obj1.id,
          );

          // Repeat obj1 based on the number of matching objects in array2
          return matchingObjects2.map(obj2 => ({...obj1, ...obj2}));
        });

        // console.log('mergedArraymergedArrayssssss', mergedArray);

        // setGroupChat(newMessages);
        setGroupChat(mergedArray);
      });
    } catch (error) {
      console.log('Error Message', error?.response);
    }
  };

  getUsersDetailInfo = async () => {
    const data = props?.route?.params?.groupUserData;
    try {
      return await camelapp.post('getMultipleUsersDetails', data).then(res => {
        console.log(res, 'RESPONSE1234');
      });
    } catch (error) {
      console.log('Error Message', error?.response);
    }
  };


  useEffect(() => {
   
  }, [])
  
  useEffect(() => {
    const groupDocumentId = props?.route?.params?.group_id;
    console.log(groupDocumentId);
    const unsubscribe = firestore()
      .collection('groupChat')
      .doc(groupDocumentId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        const newMessages = [];
        querySnapshot.forEach(doc => {
          newMessages.push(doc.data());
        });

        //geting unique ids for group users
        const uniqueUserIdsSet = new Set();
        const arrayOfUniqueUserIds = newMessages.reduce((acc, obj) => {
          if (!uniqueUserIdsSet.has(obj.senderId)) {
            uniqueUserIdsSet.add(obj.senderId);
            acc.push({id: obj.senderId, message: ''});
          }
          return acc;
        }, []);

        getUsersDetails(arrayOfUniqueUserIds, newMessages);

        setGroupChat(newMessages);
        //     console.log("nnnnnnnsnnn",nnnnn,"newMessagesnewMessages")
      });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
    // getDocumentIdForUserId();
    // requestLocationPermission();
  }, []);
  // useEffect(() => {
  //   const focusListner = navigation.addListener('focus', async () => {
  //     // toTop()
  //     // getGroupChat();
  //   });
  //   return focusListner;
  // }, []);
  console.log(user?.user?.user, 'inputValue');
  const {groupName} = props.route.params;
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          backgroundColor: 'white',
          elevation: 0.9,
          // padding: 20,
          paddingVertical: 20,
          paddingHorizontal: 10,
          borderBottomColor: 'black',
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => setInfoModal(!Infomodal)}>
          <Ionicons name={'information-circle'} size={24} color="brown" />
        </TouchableOpacity>

        <Text
          style={{
            color: 'black',
            fontSize: 19,
            textAlign: 'left',
            fontWeight: '800',
          }}>
          {groupName ? groupName : 'Group Chat'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 35,
            height: 35,
            borderRadius: 20,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}>
          <Ionicons name={'md-arrow-redo'} size={24} color="brown" />
        </TouchableOpacity>
      </View>
      <FlatList
        // ref={flatListRef}

        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 55}}
        data={groupChat}
        renderItem={({item, index}) => {
          return (
            <View>
              {/* Right side messages */}
              {item?.senderId === user?.user?.user?.id ? (
                <View>
                  <Card style={Styles.text_send}>
                    <Text
                      style={{color: '#fff', textAlign: 'left', fontSize: 14}}>
                      {item?.message}
                    </Text>
                    <Text
                      style={{color: '#eee', fontSize: 10, textAlign: 'right'}}>
                      {moment(item.timestamp?.toDate())?.format('h:mm a')}
                    </Text>
                  </Card>

                  {/* CHAT IMAGE */}
                  {item?.image ? (
                    <View style={styles.rightChatImageContainer}>
                      {/* <Text
                        style={{
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: '700',
                          // marginBottom: 7,
                        }}>
                        {item?.sender}
                      </Text> */}

                      {/* <Image source={{uri:"file:///data/user/0/com.alsyahd/cache/rn_image_picker_lib_temp_3c073ac1-2850-41ed-815a-70389f526201.jpg"}} style={styles.chatImage} /> */}

                      <Image
                        resizeMode="cover"
                        source={{
                          uri: `data:${item?.image?.mediaType};base64,${item?.image?.pickedImage}`,
                        }}
                        style={styles.chatImage}
                      />

                      <Text
                        style={{
                          marginHorizontal: 20,
                          position: 'absolute',
                          bottom: 10,
                          color: '#eee',
                          fontSize: 10,
                          textAlign: 'right',
                        }}>
                        {moment(item.timestamp?.toDate())?.format('h:mm a')}
                      </Text>
                    </View>
                  ) : null}

                  {/* {item?.file_type == 'video' && (
                    // <View style={styles.rightChatImageContainer}>
                    // <Video
                    //   onTouchStart={() => onTouchStart(index, item)}
                    //   paused={index == indexx ? flagvideo : item?.flagForVideo}
                    //   // onTouchStart={onTouchStart}
                    //   source={{
                    //     uri: `http://www.tasdeertech.com${item.file_url}`,
                    //   }} // Can be a URL or a local file.
                    //   resizeMode="stretch"
                    //   // repeat
                    //   controls={false}
                    //   style={{
                    //     backgroundColor: 'grey',
                    //     width: 200,
                    //     height: 150,
                    //     margin: 10,
                    //     padding: 10,
                    //     overflow: 'hidden',
                    //     borderTopStartRadius: 25,
                    //     borderBottomEndRadius: 25,
                    //     borderBottomStartRadius: 25,
                    //     left: width - 220,
                    //   }}
                    // />
                    // </View>
                  )} */}

                  {item?.location && (
                    <>
                      {/* <Text
                        style={{
                          color: '#d2691e',
                          fontSize: 13,
                          fontWeight: '700',
                          marginBottom: 7,
                        }}>
                        {item?.sender}
                      </Text> */}
                      <TouchableOpacity
                        style={styles.rightChatImageContainer}
                        onPress={() => proceed(item?.location)}>
                        <Image
                          source={require('../../../assets/maps.jpg')}
                          style={styles.chatImage}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ) : (
                //// Left side messages
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Image
                      source={{
                        uri:
                          'http://www.tasdeertech.com/images/profiles/' +
                          item?.user_image,
                      }}
                      style={{width: 50, height: 50, borderRadius: 100}}
                    />
                  </View>
                  <Card style={Styles.text_send_right}>
                    <Text
                      style={{
                        color: '#d2691e',
                        fontSize: 13,
                        fontWeight: '700',
                      }}>
                      {item?.user_name}
                    </Text>
                    <Text
                      style={{color: '#000', fontSize: 14, marginVertical: 5}}>
                      {item?.message}
                    </Text>
                    <Text
                      style={{color: '#eee', textAlign: 'right', fontSize: 10}}>
                      {moment(item.timestamp?.toDate())?.format('h:mm a')}
                    </Text>
                  </Card>

                  {/* CHAT IMAGE */}
                  {item?.image ? (
                    <View style={styles.chatImageContainer}>
                      <Text
                        style={{
                          color: '#d2691e',
                          fontSize: 13,
                          fontWeight: '700',
                          marginBottom: 7,
                        }}>
                        {item?.sender}
                      </Text>
                      <Image
                        resizeMode="cover"
                        source={{
                          uri: `data:${item?.image?.mediaType};base64,${item?.image?.pickedImage}`,
                        }}
                        style={styles.chatImage}
                      />
                    </View>
                  ) : null}

                  {/* CHAT VIDEO */}
                  {item?.file_type == 'video' && (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#ededed',
                        width: width,
                      }}>
                      {pausedCheck && (
                        <Image
                          activeOpacity={0.4}
                          source={require('../../../assets/camel.png')}
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
                          setPausedCheck(false);
                          setVideoModal(true);
                          setModalItem({
                            uri: `http://www.tasdeertech.com${item.file_url}`,
                          });
                        }}>
                        <Image
                          activeOpacity={0.4}
                          source={
                            pausedCheck
                              ? require('../../../assets/play.png')
                              : require('../../../assets/pause.png')
                          }
                          resizeMode={'cover'}
                          style={{width: 70, height: 70}}
                        />
                      </TouchableOpacity>
                    </View>
                    // <Video
                    //   onTouchStart={() => onTouchStart(index, item)}
                    //   // onTouchStart={onTouchStart}
                    //   paused={item?.flagForVideo}
                    //   source={{
                    //     uri: `http://www.tasdeertech.com${item.file_url}`,
                    //   }} // Can be a URL or a local file.
                    //   resizeMode="stretch"
                    //   //  repeat
                    //   controls={false}
                    //   style={{
                    //     backgroundColor: 'grey',
                    //     width: 200,
                    //     height: 150,
                    //     margin: 10,
                    //     padding: 10,
                    //     overflow: 'hidden',
                    //     borderTopStartRadius: 25,
                    //     borderBottomEndRadius: 25,
                    //     borderBottomStartRadius: 25,
                    //     left: width - 220,
                    //   }}
                    // />
                  )}
                  {/* {item?.location == null && (
                    <>
           <Text
                        style={{
                          color: '#d2691e',
                          fontSize: 13,
                          fontWeight: '700',
                          marginBottom: 7,
                        }}>
                        {item?.sender}
                      </Text> 
                      <TouchableOpacity
                        style={styles.chatImageContainer}
                        onPress={() => proceed(item?.location)}>
                        <Image
                          source={require('../../../assets/maps.jpg')}
                          style={styles.chatImage}
                        />
                      </TouchableOpacity>
                    </>
                  )} */}
                </View>
              )}
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={postGroupChat}>
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
          {image ? (
            <Image
              source={{uri: image?.imageShow}}
              style={{width: 30, height: 30, right: -40}}
            />
          ) : null}
          {video ? (
            <Image
              source={require('../../../assets/videoImage.png')}
              style={{width: 30, height: 30, right: -40}}
            />
          ) : null}
          {lat ? (
            <Image
              source={require('../../../assets/maps.jpg')}
              style={{width: 30, height: 30, right: -40}}
            />
          ) : null}
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
      </View>
      <Modal
        visible={modal}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setModal(false);
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setModal(false);
            setImage(null);
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
            backgroundColor: 'lightgrey',
          }}>
          {image ? (
            <Image
              resizeMode="contain"
              source={{uri: image?.imageShow}}
              style={{width: width, height: height * 0.7}}
            />
          ) : null}

          {video ? (
            <Image
              source={require('../../../assets/videoImage.png')}
              style={{width: width, height: height * 0.7}}
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
              <TouchableOpacity onPress={postGroupMedia}>
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
            <TextInput
              style={{
                backgroundColor: '#b0b0b0',
                borderRadius: 25,
                paddingHorizontal: 10,
                width: '90%',
                textAlign: 'right',
                color: '#000',
              }}
              // placeholder={ArabicText?.Message}
              placeholder="Type message"
              placeholderTextColor="black"
              onChangeText={text => setInputValue(text)}
              value={inputValue}
            />
          </View>
        </View>
      </Modal>
      <PickerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        openGallery={openGallery}
        selectOneFile={selectOneFile}
        getLocation={getLocation}
      />
      {/* VIDEO MODAL */}
      {/* <VideoModal
        onLoadStart={() => {
          setLoadVideo(true);
        }}
        onReadyForDisplay={() => {
          setLoadVideo(false);
        }}
        onPress={() => {
          !loadVideo && setPausedCheck(!pausedCheck);
        }}
        closeModal={() => {
          setVideoModal(false);
          setPausedCheck(true);
        }}
        pausedCheck={pausedCheck}
        loadVideo={loadVideo}
        videoModal={videoModal}
        modalItem={modalItem}
      /> */}
      <Modal
        visible={Infomodal}
        transparent={true}
        animationType="slide"
        onDismiss={() => {
          setInfoModal(false);
        }}
        onRequestClose={() => {
          setInfoModal(false);
        }}>
        <View
          style={{
            backgroundColor: 'white',
            elevation: 10,
            marginHorizontal: 20,
            position: 'relative',
            top: height / 4,
            height: 90,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setInfoModal(false);
            }}
            style={{
              marginVertical: 20,
              zIndex: 1111,
              marginHorizontal: 20,
            }}>
            <AntDesign name="closecircle" size={25} color="black" />
          </TouchableOpacity>
          <Text>hdghjdgfjhdgfdd</Text>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});
const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupChat);

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
  pickerBTNs: {
    backgroundColor: '#D2691E',
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatImageContainer: {
    width: 200,
    height: 150,
    backgroundColor: '#bbb',
    margin: 10,
    padding: 10,
    overflow: 'hidden',
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  rightChatImageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: '#D2691E',
    margin: 10,
    padding: 10,
    overflow: 'hidden',
    borderTopStartRadius: 25,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    position: 'relative',
    left: width / 7,
  },
  chatImage: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 70,
  },
  inputContainer: {
    height: 50,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: 6,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    width: '90%',
    height: '80%',
    borderRadius: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
