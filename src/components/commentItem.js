import React from 'react';
import {Card} from 'react-native-paper';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useState} from 'react';
import {Styles} from '../styles/globlestyle';
const Item = ({
  userName,
  item,
  comment,
  userImage,
  commentsCount,
  onLikesClick,
  time,
  date,
}) => {
  const [isLiked, setIsLiked] = useState();
  const [likeCount, setLikeCount] = useState(commentsCount);
  return (
    <>
      <View
        style={{
          margintop: 5,
          marginBottom: 5,
          height: 'auto',
          borderBottomColor: 'grey',
          borderBottomWidth: 0.4,
          marginHorizontal: 5,
          alignSelf: 'flex-end',
          paddingVertical: 10,
          justifyContent: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              color: 'black',
            }}>
            {likeCount}
          </Text>

          <TouchableOpacity
            style={{left: 5}}
            // style={{left: 5, position: 'absolute', bottom: 0, }}

            onPress={() => {
              onLikesClick(setIsLiked, setLikeCount);
            }}>
            <AntDesign
              name={
                (isLiked !== undefined ? isLiked == true : item?.flagForLike)
                  ? 'heart'
                  : 'hearto'
              }
              size={14}
              color={
                (
                  isLiked !== undefined
                    ? isLiked == true
                    : item?.flagForLike == true
                )
                  ? 'red'
                  : '#CD853F'
              }
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              // width: '100%',
            }}>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  fontSize: 16,
                  paddingHorizontal: 20,
                  color: 'black',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}>
                {userName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  paddingHorizontal: 20,
                  color: 'black',
                  fontWeight: '400',
                  textAlign: 'right',
                }}>
                {date}
              </Text>
              <Text 
                ellipsizeMode="tail"
                style={{
                  fontSize: 12,
                  color: 'black',
                  textAlign: 'right',
                  // width: '90%',
                  // marginLeft: 10,
                }}>
                {comment}
              </Text>
            </View>
          </View>

          <View
            style={{
              borderRadius: 100,
              height: 50,
              width: 50,
            }}>
            <Image
              source={{
                uri: 'http://www.tasdeertech.com/images/profiles/' + userImage,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 100,
              }}></Image>
          </View>
        </View>
      </View>
    </>
  );
};
export default Item;
