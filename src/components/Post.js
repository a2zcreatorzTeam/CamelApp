import React, {useState, memo, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Share,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import * as ArabicText from '../language/EnglishToArabic';
const {width, height} = Dimensions.get('screen');
import {useSelector} from 'react-redux';
//------Global Styling--------------//
import {Styles} from '../styles/globlestyle';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
const Post = ({
  item,
  onCommentsClick,
  onDetailsClick = () => {},
  onLikesClick,
  // onUserProfileClick,
  onCategoryClick,
  sharePost,
  onTouchStart,
  flagForVideo,
  pauseVideo,
  createdDate,
  category,
  postViewed = () => {},
}) => {
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [pausedCheck, setpausedCheck] = useState(true);
  const user = useSelector(state => state?.user?.user?.user);
  const [load, setLoad] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [modalItemType, setModalItemType] = useState('');
  const [isLiked, setIsLiked] = useState(item?.flagForLike);
  const [likeCount, setLikeCount] = useState(item?.like_count);
  const [viewCount, setViewCount] = useState(item?.view_count);

  const onUserProfileClick = async item => {
    if (user != undefined) {
      if (item?.user_id == user?.id) {
        navigation?.navigate('Profile', {screen: ArabicText?.profilee});
      } else {
        navigation?.navigate('UserProfile', {
          user_id: item?.user_id,
          userProfile: item,
        });
      }
    } else {
    }
  };
  // =====MEMO=====
  const memoizedItemProps = useMemo(() => {
    const {
      price,
      title,
      date,
      name,
      image,
      like_count,
      flagForLike,
      description,
      comment_count,
      share_count,
      view_count,
      user_location,
      user_images,
      imagesArray,
      category_name,
      flagForVideo,
      bid_price,
    } = item;
    // console.log(item, "itemmmmm");
    // console.log(item,"flagForLikeflagForLike");
    return {
      price,
      title,
      date,
      name,
      image,
      like_count,
      flagForLike,
      description,
      comment_count,
      share_count,
      view_count,
      user_location,
      user_images,
      imagesArray,
      category_name,
      flagForVideo,
      bid_price,
    };
  }, [item]);
  // =====Memoized Props====

  const {
    price,
    title,
    date,
    name,
    image,
    like_count,
    comment_count,
    share_count,
    user_location,
    user_images,
    imagesArray,
    category_name,
    bid_price,
  } = memoizedItemProps;
  // =====Memoized Functions====
  const handleCommentsClick = useCallback(() => {
    onCommentsClick(item);
  }, [onCommentsClick, item]);
  const handleShareClick = useCallback(() => {
    sharePost(item);
  }, [sharePost, item]);

  const handleDetailsClick = useCallback(() => {
    onDetailsClick(viewCount, setViewCount);
  }, [onDetailsClick, item]);

  const handleLikesClick = useCallback(() => {
    onLikesClick(item, setIsLiked, setLikeCount);
  }, [onLikesClick, item]);
  // const handleUserProfileClick = useCallback(() => {
  //   onUserProfileClick && onUserProfileClick(item);
  // }, [onUserProfileClick, item]);

  const handleCategoryClick = useCallback(() => {
    onCategoryClick && onCategoryClick(item);
  }, [onCategoryClick, item]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'SHARE POST',
        message: `URL`,
        url: `www.google.com`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  console.log('item167', bid_price, item?.price);
  return (
    <View style={styles.main}>
      {/*Post Header*/}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={Styles.btnHome2} onPress={handleCategoryClick}>
          <Text style={styles.catBtnText}>
            {category ? category : category_name}
          </Text>
        </TouchableOpacity>
        {/* Profile Btn */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onUserProfileClick(item)}
          style={styles.userIcon}>
          <View style={{maxWidth: 200, paddingRight: 5, marginBottom: 2}}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.postDate}>{date ? date : createdDate}</Text>
            <Text style={styles.userLocation}>{user_location}</Text>
          </View>
          <FastImage
            style={{width: 55, height: 55, borderRadius: 30}}
            source={{
              uri: 'http://www.tasdeertech.com/images/profiles/' + user_images,
            }}
            resizeMode={FastImage?.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>

      {/* OUTER CAROUSEL*/}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: '#f3f3f3',
        }}>
        {imagesArray?.map((item, index) => {
          const isImage = item.type === 'image';
          const isVideo = item.type === 'video';

          const mediaSource = isImage
            ? {uri: 'http://www.tasdeertech.com/images/posts/' + item?.source}
            : isVideo
            ? {uri: 'http://www.tasdeertech.com/videos/' + item?.source}
            : null;
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                postViewed(viewCount, setViewCount);
                setModal(true),
                  setModalItem(mediaSource),
                  setModalItemType(item?.type);
              }}
              style={{}}>
              <View
                style={[
                  Styles.imageCarousal,
                  {backgroundColor: '#f3f3f3', overflow: 'visible'},
                ]}>
                {price?.length ? (
                  <TouchableOpacity style={styles.priceContainer}>
                    <Text style={styles.priceTxt}> {ArabicText?.Price}</Text>
                    <Text numberOfLines={2} style={styles.bidPrice}>
                      {bid_price > 0 ? bid_price : price}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {isImage && mediaSource && (
                  <FastImage
                    style={Styles.image}
                    source={{
                      uri:
                        'http://www.tasdeertech.com/images/posts/' +
                        item?.source,
                      headers: {Authorization: 'someAuthToken'},
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage?.resizeMode.cover}
                  />
                )}

                {isVideo && (
                  <View style={{flex: 1, backgroundColor: '#ededed'}}>
                    {pausedCheck && (
                      <Image
                        activeOpacity={0.4}
                        source={require('../../assets/camel.png')}
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
                        setpausedCheck(false),
                          setModal(true),
                          setModalItem(mediaSource),
                          setModalItemType(item?.type);
                      }}>
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
                    </TouchableOpacity>
                  </View>
                )}

                {!isImage && !isVideo && (
                  <Text style={{color: '#000'}}>Media not available</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
      {/*MODAL WiTH CAROUSEL*/}
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
                        height: height / 2.5,
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
                      bottom: height / 6,
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

          <View style={styles.modalMediaWrpr}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {}}
              style={styles.userProfileContainer}>
              <Image
                source={{
                  uri:
                    'http://www.tasdeertech.com/images/profiles/' + user_images,
                }}
                style={styles.userProfileImage}
              />
            </TouchableOpacity>
            <View style={styles.userInfoContainer}>
              <Text style={[styles.userName, {color: '#fff'}]}>{name}</Text>
              <Text style={[styles.userLocation, {color: '#fff'}]}>
                {user_location}
              </Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* like, share & comment buttons */}
      <View
        style={{
          width: '50%',
          height: 30,
          borderRadius: 15,
          alignSelf: 'flex-end',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'absolute',
          bottom: 60,
          right: 10,
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
            {viewCount}
          </Text>
          <Ionicons name="ios-eye-sharp" size={20} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          }}
          // onPress={handleShareClick}
          onPress={() => onShare()}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {share_count}
          </Text>
          <Ionicons name="share-social-sharp" size={20} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCommentsClick}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {comment_count}
          </Text>
          <Feather name="message-square" size={18} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLikesClick(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
            {likeCount}
          </Text>

          {isLiked == 'true' || isLiked == true ? (
            <AntDesign name="heart" size={18} color="#CD853F" />
          ) : (
            <AntDesign name="hearto" size={18} color="#CD853F" />
          )}
        </TouchableOpacity>
      </View>

      <View style={Styles.posticon}>
        <TouchableOpacity onPress={handleDetailsClick} style={Styles.btnHome}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            {ArabicText.Details}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontWeight: '600',
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
};
export default memo(Post);

const styles = StyleSheet.create({
  main: {
    width: width,
    height: height / 2,
    marginTop: 15,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: width,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  catBtnText: {color: '#D2691Eff', fontWeight: 'bold', fontSize: 15},
  userIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'right',
  },
  postDate: {
    fontSize: 10,
    color: 'grey',
    textAlign: 'right',
  },
  userLocation: {
    fontSize: 10,
    color: '#000',
    textAlign: 'right',
  },
  modalContainer: {
    height: '100%',
    width: width,
    backgroundColor: '#000000db',
    justifyContent: 'center',
  },
  modalCloseBTN: {top: 10, right: 15, position: 'absolute'},
  modalMediaWrpr: {
    width: width,
    height: 60,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 10,
  },
  mediaControllerBTNs: {
    height: 30,
    width: '15%',
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 2,
    bottom: 25,
    left: 10,
  },

  mediaControllerTxt: {
    color: 'black',
    fontSize: 15,
    marginRight: 3,
  },
  priceContainer: {
    position: 'absolute',
    left: -350,
    top: 20,
    paddingTop: 5,
    alignItems: 'center',
    alignContent: 'center',
    width: 60,
    backgroundColor: '#D2691Eff',
    height: height * 0.065,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  priceTxt: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  bidPrice: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: 13,
  },
  userProfileContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  titleContainer: {position: 'absolute', right: 5, width: 220},
  titleText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
