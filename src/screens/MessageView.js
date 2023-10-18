import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import * as ArabicText from '../language/EnglishToArabic';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import {useSelector} from 'react-redux';
import {checkOrCreateChatRoom, sendMessage} from '../services';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import BackBtnHeader from '../components/headerWithBackBtn';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import GetLocation from 'react-native-get-location';
import {Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Linking} from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
const MessageView = ({route}) => {
  const [inputValue, setInputValue] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [modal, setModal] = useState(false);
  const [pausedCheck, setpausedCheck] = useState(true);
  const [load, setLoad] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [modalItemType, setModalItemType] = useState('');
  const [downloadFiles, setdownloadFiles] = useState(false);

  const reciever_id = route.params.messageData.id;
  const reciever_data = route.params.messageData;
  const user_id = useSelector(state => state?.user?.user?.user?.id);
  const user = useSelector(state => state?.user);
  const chatRoomId =
    user_id < reciever_id
      ? `${user_id}_${reciever_id}`
      : `${reciever_id}_${user_id}`;
  handlePress = () => {
    console.log(
      user_id,
      inputValue,
      chatRoomId,
      lat,
      long,
      image,
      video,
      'user_id, inputValue, chatRoomId, lat, long, image, video',
    );
    sendMessage(user_id, inputValue, chatRoomId, lat, long, image, video).then(
      success => {
        success && setModalVisible(false),
          setConfirmModal(false),
          setImage(''),
          setVideo(''),
          setlat(''),
          setlong('');
        setLoader(false);
        !success && setLoader(false);
      },
    );
    setInputValue('');
    !image && !video && setLoader(false);
  };
  const proceed = async (lat, long) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };
  _renderItem = ({item, index}) => {
    const formattedDateTime = moment.unix(item?.timestamp).format('h:mm:a');
    let sender_id = user.user.user.id;
    return item?.sender == sender_id ? (
      <View style={{width: '100%'}}>
        {item?.latitude && item?.longitude ? (
          <>
            <TouchableOpacity
              style={[styles.rightChatImageContainer]}
              onPress={() => proceed(item?.latitude, item?.longitude)}>
              <Image
                source={require('../../assets/maps.jpg')}
                style={styles.chatImage}
              />
              <Text style={styles.formattedDateText}>{formattedDateTime}</Text>
            </TouchableOpacity>
          </>
        ) : item?.imageUrl ? (
          <TouchableOpacity
            style={[styles.rightChatImageContainer]}
            onPress={() => {
              setModal(true),
                setModalItem({uri: item?.imageUrl}),
                setModalItemType('image');
            }}>
            <Image
              source={{
                uri: item?.imageUrl,
              }}
              style={styles.chatImage}
            />
            <Text style={styles.formattedDateText}>{formattedDateTime}</Text>
          </TouchableOpacity>
        ) : item?.videoUrl ? (
          <>
            <TouchableOpacity
              style={[styles.rightChatImageContainer]}
              onPress={() => {
                setModal(true),
                  setModalItem({uri: item?.videoUrl}),
                  setModalItemType('video');
              }}>
              <ImageBackground
                imageStyle={{
                  borderRadius: 25,
                }}
                source={require('../../assets/camel.png')}
                style={[
                  styles.chatImage,
                  {
                    height: '90%',
                    opacity: 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 0,
                  },
                ]}>
                <Image
                  tintColor="#fff"
                  source={require('../../assets/play.png')}
                  resizeMode={'cover'}
                  style={{width: 70, height: 70}}
                />
              </ImageBackground>
              <Text style={styles.formattedDateText}>{formattedDateTime}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Card style={Styles.text_send}>
              <Text style={{color: '#fff', textAlign: 'right', fontSize: 14}}>
                {item.text}
              </Text>
              <Text style={{color: 'white', fontSize: 10}}>
                {formattedDateTime}
              </Text>
            </Card>
          </>
        )}
      </View>
    ) : (
      <>
        {item?.latitude && item?.longitude ? (
          <>
            <TouchableOpacity
              style={[
                styles.rightChatImageContainer,
                styles.containerHeight,
                {left: 0},
              ]}
              onPress={() => proceed(item?.latitude, item?.longitude)}>
              <Image
                source={require('../../assets/maps.jpg')}
                style={styles.chatImage}
              />
              <Text
                style={[
                  styles.formattedDateText,
                  {textAlign: 'right', marginRight: 20},
                ]}>
                {formattedDateTime}
              </Text>
            </TouchableOpacity>
          </>
        ) : item?.imageUrl ? (
          <TouchableOpacity
            style={[
              styles.rightChatImageContainer,
              styles.containerHeight,
              {left: 0},
            ]}
            // onPress={() => proceed(item?.latitude, item?.longitude)}
          >
            <Image
              source={{
                uri: item?.imageUrl?.pickedImage,
              }}
              style={styles.chatImage}
            />
            <Text
              style={[
                styles.formattedDateText,
                {textAlign: 'right', marginRight: 20},
              ]}>
              {formattedDateTime}
            </Text>
          </TouchableOpacity>
        ) : item?.videoUrl ? (
          <>
            <TouchableOpacity
              style={[
                styles.rightChatImageContainer,
                styles.containerHeight,
                {left: 0},
              ]}
              // onPress={() => proceed(item?.latitude, item?.longitude)}
            >
              <ImageBackground
                imageStyle={{
                  borderRadius: 25,
                }}
                source={require('../../assets/camel.png')}
                style={[
                  styles.chatImage,
                  {
                    height: '90%',
                    opacity: 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 0,
                  },
                ]}>
                <Image
                  tintColor="#fff"
                  source={require('../../assets/play.png')}
                  resizeMode={'cover'}
                  style={{width: 70, height: 70}}
                />
              </ImageBackground>
              <Text
                style={[
                  styles.formattedDateText,
                  {textAlign: 'right', marginRight: 20},
                ]}>
                {formattedDateTime}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Card style={Styles.text_send_right}>
            <Text style={{color: '#fff', textAlign: 'right', fontSize: 14}}>
              {item.text}
            </Text>
            <Text style={{color: 'white', fontSize: 10}}>
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
        style={{marginTop: 10, backgroundColor: '#fff'}}
        contentContainerStyle={{paddingTop: 10, overflow: 'hidden'}}
        inverted
        initialNumToRender={dataSource?.length}
        data={dataSource}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
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
        setModalVisible(false);
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
      selectionLimit: 1,
    })
      .then(async images => {
        console.log('imagesss', images);
        if (images) {
          setImage({
            imageShow: images?.path,
            mediaType: images?.mime,
          });
          setlat('');
          setlong('');
          setVideo('');
          setConfirmModal(true);
          setModalVisible(false);
        } else {
          console.log('noImagesssss');
        }
      })
      .catch(error => {
        Toast.show({
          text1: error,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(error, 'errroooooooeee');
        console.log('error', error);
      });
    // setModalVisible(false)
  };
  const selectOneFile = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'video',
    }).then(async video => {
      console.log('video4100', video);
      if (video) {
        if (video?.size > 10000000) {
          Toast.show({
            text1: ArabicText?.Videomustbelessthen10MB,
            type: 'error',
            visibilityTime: 3000,
          });
        } else {
          setVideo(video?.path);
          setlat('');
          setlong('');
          setImage('');
          setConfirmModal(true);
          setModalVisible(false);
        }
      } else {
        Toast.show({
          text1: ArabicText?.Pleaseselectthevideo,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Please select the video.');
      }
    });
  };
  fileDownload = async (type, item) => {
    const date = Date.now();
    setdownloadFiles(true);
    RNFS.downloadFile({
      fromUrl: item?.uri,
      toFile:
        type == 'image'
          ? `${RNFS.DownloadDirectoryPath}/${date}.png`
          : `${RNFS.DownloadDirectoryPath}/${date}.mp4`,
    })
      .promise.then(r => {
        setdownloadFiles(false);
        Toast.show({
          text1: ArabicText?.DownloadSuccessfully,
          type: 'success',
          visibilityTime: 3000,
        });
        // alert('Download Successfully');
      })
      .catch(err => {
        setdownloadFiles(false);
        Toast.show({
          text1: ArabicText?.Somethingwentwrongindownloading,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Something went wrong in downloading');

        console.log(err);
      });
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
  return (
    <View style={{flex: 1, width: width, height: hight}}>
      <BackBtnHeader reciever_data={reciever_data} />
      <RenderList />
      <View style={styles.inputContainer}>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.99}
            onPress={() => {
              inputValue?.length && handlePress();
            }}>
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
        <View
          style={{
            width: '80%',
            backgroundColor: '#fff',
            height: '75%',
            borderRadius: 25,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{width: '15%'}}>
            <Entypo name="attachment" size={18} color="#bbb" style={{}} />
          </TouchableOpacity>
          <TextInput
            style={{
              width: '85%',
              textAlign: 'right',
              color: '#000',
              marginRight: 10,
            }}
            placeholder={ArabicText?.Message}
            placeholderTextColor="#b0b0b0"
            onChangeText={text => setInputValue(text)}
            value={inputValue}
          />
        </View>
      </View>
      {/* attachment modal */}
      <PickerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        openGallery={openGallery}
        selectOneFile={selectOneFile}
        getLocation={getLocation}
      />
      {/* media send confirmtion modal */}
      <Modal
        visible={confirmModal}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setConfirmModal(false);
          setImage(null);
          setVideo(null);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#3C3937',
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
              marginLeft: 'auto',
            }}>
            <AntDesign name="closecircle" size={35} color="#D2691E" />
          </TouchableOpacity>
          <View
            style={{
              alignContent: 'center',
              backgroundColor: '#3C3937',
              flex: 1,
              justifyContent: 'center',
            }}>
            {image ? (
              <Image
                resizeMode="contain"
                source={{uri: image?.imageShow}}
                style={{width: width, height: hight * 0.6, marginBottom: '20%'}}
              />
            ) : null}
            {video ? (
              <Image
                resizeMode="contain"
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
                  backgroundColor: '#D2691E',
                  padding: 10,
                  borderRadius: 100,
                  marginBottom: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setLoader(true), handlePress();
                  }}>
                  {loader ? (
                    <ActivityIndicator size={20} color={'white'} />
                  ) : (
                    <Feather
                      name="send"
                      size={28}
                      color="white"
                      style={{
                        transform: [{rotate: '225deg'}],
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* IMAGE_ VIDEO MODAL  */}
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

          <View style={{height: 300}}>
            <View style={Styles.imageCarousal}>
              {modalItemType === 'image' && (
                <FastImage
                  style={Styles.image}
                  source={modalItem}
                  resizeMode={FastImage?.resizeMode.contain}
                />
              )}
              {modalItemType == 'video' && (
                <View style={{flex: 1, backgroundColor: '#ededed'}}>
                  <Video
                    onError={error => console.error('Video error:', error)}
                    onLoadStart={() => {
                      setLoad(true);
                    }}
                    onReadyForDisplay={() => {
                      setLoad(false);
                    }}
                    source={modalItem}
                    resizeMode="contain"
                    repeat={true}
                    controls={false}
                    paused={pausedCheck}
                    style={[
                      Styles.image,
                      {
                        width: width,
                        height: hight / 2.5,
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
                      bottom: hight / 6,
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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              fileDownload(modalItemType, modalItem);
            }}
            style={{
              bottom: 0,
              // top: 10,
              // right: 15,
              marginHorizontal: 30,
              marginVertical: 30,
              position: 'absolute',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 100,
            }}>
            {downloadFiles == true ? (
              <ActivityIndicator size={20} color={'#D2691E'} />
            ) : (
              <AntDesign name="download" size={25} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
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

    width: 250,
    left: width - 270,
    height: 185,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatImage: {
    width: '100%',
    height: '85%',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  modalContainer: {
    height: '100%',
    width: width,
    backgroundColor: '#000000db',
    justifyContent: 'center',
  },
  modalCloseBTN: {top: 10, right: 15, position: 'absolute'},
  containerHeight: {
    borderRadius: 25,
    borderTopStartRadius: 0,
  },
  formattedDateText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'left',
    width: '100%',
    marginLeft: 10,
  },
});

export default MessageView;
