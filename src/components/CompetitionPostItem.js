import React, { memo, useState } from 'react';
import { Image, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Styles } from '../styles/globlestyle';
const { width, height } = Dimensions.get('screen');
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { imageBaseUrl, profileBaseUrl, thumbnailBaseUrl } from '../constants/urls';
import { family } from '../constants/Family';

const PostItem = ({
  item,
  image,
  commentCount,
  postLike = () => { },
  postComment = () => { },
  onClickItem = () => { },
}) => {
  // console.log(item?.thumbnail,"rthumkbghhh");
  const [isLiked, setIsLiked] = useState();
  const [likeCount, setLikeCount] = useState(item?.like_count);
  const [viewCount, setViewCount] = useState(item?.view_count);
  return (
    <TouchableOpacity
      onPress={() => onClickItem(viewCount, setViewCount)}
      style={{
        margin: 10,
        width: width / 2 - 20,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 10,
        backgroundColor: '#e7e7e7',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: width / 2 - 30,
          marginVertical: 8,
        }}>
        <Text style={{ color: 'black', marginBottom: 10, marginHorizontal: 10, fontFamily:family.Neo_Regular }}>
          {item?.user_name}
        </Text>
        <FastImage
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            alignSelf: 'center',
          }}
          source={{
            uri: profileBaseUrl + item?.user_image,
          }}
          resizeMode={FastImage?.resizeMode.cover}
        />
      </View>
      <TouchableOpacity onPress={() => onClickItem(viewCount, setViewCount)}>
        <View
          style={[
            Styles.BeautyImages,
            {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              width: width / 2 - 20,
            },
          ]}>
          {image ? (
            <FastImage
              style={[
                Styles.BeautyImages,
                {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  width: width / 2 - 20,
                },
              ]}
              source={{
                uri: imageBaseUrl + image,
              }}
            />
          ) : (
            <View style={{ backgroundColor: '#ededed' }}>

              <FastImage
                style={Styles.BeautyImages}
                source={
                  item?.thumbnail !== null
                    ? {
                      uri: thumbnailBaseUrl + item?.thumbnail?.thumbnail,
                      headers: { Authorization: 'someAuthToken' },
                      priority: FastImage.priority.high,
                    }
                    : require('../../assets/camel.png')
                }
                resizeMode={FastImage?.resizeMode.cover}
              />

              <TouchableOpacity
                onPress={() => onClickItem(viewCount, setViewCount)}
                style={{
                  height: 70,
                  width: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  elevation: 2,
                  bottom: 136 / 4,
                  left: 160 / 3,
                }}>
                <Image
                  activeOpacity={0.4}
                  source={require('../../assets/play.png')}
                  resizeMode={'cover'}
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: '#ffffff',
          position: 'absolute',
          alignItems: 'center',
          bottom: 8,
          width: 140,
          padding: 10,
          borderRadius: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          left: 5
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Text style={{ color: 'black', fontSize: 15, marginRight: 3, fontFamily: family.Neo_Regular }}>
            {viewCount}
          </Text>
          <Ionicons name="ios-eye-sharp" size={20} color="#CD853F" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            postComment();
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 5, color: 'black', fontFamily:family.Neo_Regular }}>{commentCount}</Text>
          <Feather name="message-square" size={16} color="#CD853F" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            postLike(item, setIsLiked, setLikeCount);
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 5, color: 'black', fontFamily:family.Neo_Regular }}>{likeCount}</Text>
          {(
            isLiked !== undefined ? isLiked == true : item?.flagForLike == true
          ) ? (
            <AntDesign name="heart" size={16} color="#CD853F" />
          ) : (
            <AntDesign name="hearto" size={16} color="#CD853F" />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(PostItem);
