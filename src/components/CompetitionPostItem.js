import React, {memo, useState} from 'react';
import {Image, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Styles} from '../styles/globlestyle';
const {width} = Dimensions.get('screen');
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostItem = ({
  item,
  image,
  commentCount,
  postLike = () => {},
  postComment = () => {},
  onClickItem = () => {},
}) => {
  console.log(image, 'imageee');
  const [isLiked, setIsLiked] = useState();
  const [likeCount, setLikeCount] = useState(item?.like_count);
  const [viewCount, setViewCount] = useState(item?.view_count);
  console.log(item.flagForLike, 'flagForLike22', item?.view_count);
  return (
    <TouchableOpacity
      onPress={() => onClickItem(viewCount, setViewCount)}
      style={{
        margin: 10,
        width: width / 2 - 20,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
      }}>
      <View style={Styles.BeautyOpacity}>
        <FastImage
          style={Styles.BeautyImages}
          source={{
            uri: 'http://www.tasdeertech.com/images/posts/' + image,
          }}
          resizeMode={FastImage?.resizeMode.cover}
        />
      </View>
      <View
        style={{
          backgroundColor: '#ffffff',
          position: 'absolute',
          alignItems: 'center',
          bottom: 5,
          width: 140,
          padding: 10,
          borderRadius: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
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
          onPress={() => {
            postComment();
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginRight: 5, color: 'black'}}>{commentCount}</Text>
          <Feather name="message-square" size={16} color="#CD853F" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            postLike(item, setIsLiked, setLikeCount);
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginRight: 5, color: 'black'}}>{likeCount}</Text>
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
