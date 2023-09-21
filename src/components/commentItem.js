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
}) => {
  console.log(item?.id);
  const [isLiked, setIsLiked] = useState();
  const [likeCount, setLikeCount] = useState(commentsCount);
  console.log(
    isLiked,
    item?.flagForLike
  );
  return (
    <Card style={{margintop: 5, marginBottom: 5, height: 80}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              alignItems: 'flex-end',
              right: 100,
              top: 10,
              position: 'absolute',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                paddingRight: 5,
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'right',
              }}>
              {userName}
            </Text>

            <View
              style={{
                marginVertical: 30,
                alignItems: 'center',
                // right: 130,
                // top: 10,
                // position: 'absolute',

                marginBottom: 10,
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: 10,
                  paddingRight: 5,
                  textAlign: 'right',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                {time}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              right: 130,
              top: 10,
              position: 'absolute',
              marginBottom: 10,
            }}></View>
          <View
            style={{
              alignItems: 'center',
              right: 60,
              top: 35,
              position: 'absolute',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                paddingRight: 5,
                color: 'black',
                textAlign: 'right',
              }}>
              {comment}
            </Text>
          </View>

          <View style={Styles.user_HomeComment}>
            <Image
              source={{
                uri: 'http://www.tasdeertech.com/images/profiles/' + userImage,
              }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50 / 4,
              }}></Image>
          </View>
        </View>
      </View>
      <Card.Actions style={Styles.posticonCommentLikesSection}>
        <Text
          style={{
            left: 35,
            position: 'absolute',
            bottom: 15,
            color: 'black',
          }}>
          {likeCount}
        </Text>

        <TouchableOpacity
          style={{left: 20, position: 'absolute', bottom: 15}}
          onPress={() => onLikesClick(setIsLiked, setLikeCount)}>
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
        {/* </View> */}
      </Card.Actions>
    </Card>
  );
};
export default Item;
