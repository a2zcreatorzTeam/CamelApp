import React, {memo, useState} from 'react';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Styles} from '../styles/globlestyle';
const PostItem = ({
  item,
  image,
  commentCount,
  postLike = () => {},
  postComment = () => {},
}) => {
  const [isLiked, setIsLiked] = useState();
  const [likeCount, setLikeCount] = useState(item?.like_count);
  return (
    <View style={{margin: 10}}>
      <View style={Styles.BeautyOpacity}>
        <Image
          source={{
            uri: 'http://www.tasdeertech.com/images/posts/' + image,
          }}
          style={Styles.BeautyImages}
          resizeMode="cover"></Image>
      </View>
      <View
        style={{
          backgroundColor: '#ffffff',
          position: 'absolute',
          alignItems: 'center',
          bottom: 5,
          width: 100,
          padding: 10,
          borderRadius: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
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
    </View>
  );
};

export default memo(PostItem);
