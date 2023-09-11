import React, { useState, memo, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import * as ArabicText from '../language/EnglishToArabic';
const { width, height } = Dimensions.get('screen');
import { useSelector } from 'react-redux';
//------Global Styling--------------//
import { Styles } from '../styles/globlestyle';
import { useNavigation } from '@react-navigation/native';
const Post = ({
  item,
  onCommentsClick,
  onDetailsClick,
  onLikesClick,
  // onUserProfileClick,
  onCategoryClick,
  sharePost,
  onTouchStart,
  flagForVideo,
  pauseVideo,
  createdDate,


}) => {
  // console.log(item, "postItemmmmm");
  const navigation = useNavigation()
  const [modal, setModal] = useState(false);
  const [pausedCheck, setpausedCheck] = useState(true);
  const user = useSelector(state => state?.user?.user?.user)
  const [load, setLoad] = useState(false)
  const [modalItem, setModalItem] = useState('')
  const [modalItemType, setModalItemType] = useState('')

  const onUserProfileClick = async item => {
    if (item?.user_id === user?.id) {
      navigation?.navigate('Profile');
    } else {
      console.log("userProfillee");
      navigation?.navigate('UserProfile', {
        // user_id: item?.user_id,
      });
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
      lastBidPrice,
    } = item;
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
      lastBidPrice,
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
    flagForLike,
    description,
    comment_count,
    share_count,
    view_count,
    user_location,
    user_images,
    imagesArray,
    category_name,
    lastBidPrice,
  } = memoizedItemProps;

  // =====Memoized Functions====
  const handleCommentsClick = useCallback(() => {
    onCommentsClick(item);
  }, [onCommentsClick, item]);
  const handleShareClick = useCallback(() => {
    sharePost(item);
  }, [sharePost, item]);

  const handleDetailsClick = useCallback(() => {
    onDetailsClick(item);
  }, [onDetailsClick, item]);

  const handleLikesClick = useCallback(() => {
    onLikesClick(item);
  }, [onLikesClick, item]);

  // const handleUserProfileClick = useCallback(() => {
  //   onUserProfileClick && onUserProfileClick(item);
  // }, [onUserProfileClick, item]);

  const handleCategoryClick = useCallback(() => {
    onCategoryClick(item);
  }, [onCategoryClick, item]);




  // price={item?.price}
  // item={item}
  // title={item?.title}
  // date={item?.date}
  // image={item?.image}
  // likes={item?.like_count}
  // likeStatus={item?.flagForLike}
  // description={item?.description}
  // comments={item?.comment_count}
  // shares={item?.share_count}
  // views={item?.view_count}
  // userName={item?.name}
  // userCity={item?.user_location}
  // userImage={item?.user_images}
  // imagesArray={item?.imagesArray}
  // category={item?.category_name}
  // pauseFlag={item?.flagForVideo}
  // lastBidPrice={item?.lastBidPrice}
  return (
    <View style={styles.main}>
      {/*Post Header*/}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={Styles.btnHome2}

          onPress={handleCategoryClick}>
          <Text style={styles.catBtnText}>{category_name}</Text>
        </TouchableOpacity>
        {/* Profile Btn */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onUserProfileClick(item)}
          style={styles.userIcon}>
          <View style={{ maxWidth: 200, paddingRight: 5, marginBottom: 2 }}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.postDate}>{date ? date : createdDate}</Text>
            <Text style={styles.userLocation}>{user_location}</Text>
          </View>
          <Image
            source={{
              uri: 'http://www.tasdeertech.com/images/profiles/' + user_images,
            }}
            style={{ width: 55, height: 55, borderRadius: 30 }}
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
            ? { uri: 'http://www.tasdeertech.com/images/posts/' + item.source }
            : isVideo
              ? { uri: 'http://www.tasdeertech.com/videos/' + item.source }
              : null;

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => { setModal(true), setModalItem(mediaSource), setModalItemType(item?.type) }}
              style={{ backgroundColor: 'yellow' }}>
              <View
                style={[Styles.imageCarousal, { backgroundColor: '#f3f3f3' }]}>
                {price && (
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceTxt}> {ArabicText.Price}</Text>
                    <Text numberOfLines={2} style={styles.bidPrice}>
                      {lastBidPrice ? lastBidPrice : price}
                    </Text>
                  </View>
                )}

                {isImage && (
                  <Image
                    source={mediaSource}
                    key={String(index)}
                    resizeMode="cover"
                    style={Styles.image}
                  />
                )}

                {isVideo && (
                  <View style={{ flex: 1, backgroundColor: '#ededed' }}>
                    {pausedCheck &&
                      <Image
                        activeOpacity={0.4}
                        source={require('../../assets/camel3.png')}
                        resizeMode={'cover'}
                        style={[Styles.image, { backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0.3 }]}
                      />
                      // :
                      // <Video
                      //   onLoadStart={() => setLoad(true)}
                      //   onReadyForDisplay={() => setLoad(false)}
                      //   source={{
                      //     uri: 'http://www.tasdeertech.com/videos/' + item.source,
                      //   }}
                      //   key={String(index)}
                      //   resizeMode="contain"
                      //   repeat={true}
                      //   controls={false}
                      //   paused={pausedCheck}
                      //   style={[Styles.image, {
                      //     width: width,
                      //     height: height / 2.5,

                      //   }]}
                      // />
                    }
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
                      onPress={
                        () => {
                          // load ? null :
                          // setPaused(!paused)
                          setpausedCheck(false),
                            setModal(true), setModalItem(mediaSource), setModalItemType(item?.type)
                        }
                      }
                    >
                      <Image
                        activeOpacity={0.4}
                        source={pausedCheck ? require('../../assets/play.png') : require('../../assets/pause.png')}
                        resizeMode={'cover'}
                        style={{ width: 70, height: 70 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {!isImage && !isVideo && (
                  <Text style={{ color: '#000' }}>Media not available</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>

      {/* <Carousel
        data={imagesArray}
        layout={'default'}
        scrollEnabled={true}
        renderItem={({item, index}) => {
          const isImage = item.type === 'image';
          const isVideo = item.type === 'video';

          const mediaSource = isImage
            ? {uri: 'http://www.tasdeertech.com/images/posts/' + item.source}
            : isVideo
            ? {uri: 'http://www.tasdeertech.com/videos/' + item.source}
            : null;

          return (
            <TouchableWithoutFeedback onPress={() => setModal(true)}>
              <View
                style={[Styles.imageCarousal, {backgroundColor: '#f3f3f3'}]}>
                {price && (
                  <View style={styles.priceWrpr}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceTxt}> {ArabicText.Price}</Text>
                      <Text numberOfLines={2} style={styles.bidPrice}>
                        {lastBidPrice ? lastBidPrice : price}
                      </Text>
                    </View>
                  </View>
                )}

                {isImage && (
                  <Image
                    source={mediaSource}
                    key={String(index)}
                    resizeMode="cover"
                    style={Styles.image}
                  />
                )}

                {isVideo && (
                  <>
                    <Video
                      onTouchStart={onTouchStart}
                      source={mediaSource}
                      key={String(index)}
                      resizeMode="stretch"
                      controls={false}
                      paused={flagForVideo}
                      style={Styles.image}
                    />

                    <TouchableOpacity
                      style={styles.mediaControllerBTNs}
                      onPress={onTouchStart}>
                      <Text style={styles.mediaControllerTxt}>
                        {flagForVideo ? 'Pause' : 'Play'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {!isImage && !isVideo && (
                  <Text style={{color: '#000'}}>Media not available</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        }}
        sliderWidth={width}
        itemWidth={width}
      /> */}

      {/*MODAL WiTH CAROUSEL*/}
      <Modal
        visible={modal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { setModal(false), setpausedCheck(true) }}>
        <View style={styles.modalContainer}>
          {/* Modal Close Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { setModal(false), setpausedCheck(true) }}
            style={styles.modalCloseBTN}>
            <AntDesign name="closecircle" size={35} color="#fff" />
          </TouchableOpacity>

          <View style={{ height: 300, backgroundColor: 'red' }}>
            <View style={Styles.imageCarousal}>
              {modalItemType === 'image' && (
                <Image
                  source={modalItem}
                  resizeMode="cover"
                  style={Styles.image}
                />
              )}
              {modalItemType == 'video' && (
                <View style={{ flex: 1, backgroundColor: '#ededed' }}>
                  <Video
                    onLoadStart={() => setLoad(true)}
                    onReadyForDisplay={() => setLoad(false)}
                    source={modalItem}
                    resizeMode="contain"
                    repeat={true}
                    controls={false}
                    paused={pausedCheck}
                    style={[Styles.image, {
                      width: width,
                      height: height / 2.5,
                    }]}
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
                    onPress={
                      () => {
                        setpausedCheck(true)
                        load ? null :
                          setpausedCheck(!pausedCheck)
                      }
                    }
                  >
                    {
                      load ? <ActivityIndicator size="large" /> :
                        <Image
                          activeOpacity={0.4}
                          source={pausedCheck ? require('../../assets/play.png') : require('../../assets/pause.png')}
                          resizeMode={'cover'}
                          style={{ width: 70, height: 70 }}
                        />
                    }
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.modalMediaWrpr}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onUserProfileClick()}
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
              <Text style={[styles.userName, { color: '#fff' }]}>{name}</Text>
              <Text style={[styles.userLocation, { color: '#fff' }]}>
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
          <Text style={{ color: 'black', fontSize: 15, marginRight: 3 }}>
            {' '}
            {view_count}
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
          onPress={handleShareClick}>
          <Text style={{ color: 'black', fontSize: 15, marginRight: 3 }}>
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
          <Text style={{ color: 'black', fontSize: 15, marginRight: 3 }}>
            {comment_count}
          </Text>
          <Feather name="message-square" size={18} color="#CD853F" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLikesClick}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: 'black', fontSize: 15, marginRight: 3 }}>
            {like_count}
          </Text>

          {flagForLike == true ? (
            <AntDesign name="heart" size={18} color="#CD853F" />
          ) : (
            <AntDesign name="hearto" size={18} color="#CD853F" />
          )}
        </TouchableOpacity>
      </View>

      <View style={Styles.posticon}>
        <TouchableOpacity onPress={handleDetailsClick} style={Styles.btnHome}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
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
    // elevation: 5,
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
  catBtnText: { color: '#D2691Eff', fontWeight: 'bold', fontSize: 15 },
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
  modalCloseBTN: { top: 10, right: 15, position: 'absolute' },
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
    left: 20,
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
  titleContainer: { position: 'absolute', right: 5, width: 220 },
  titleText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
