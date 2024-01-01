import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
const NewsPost = ({
  titleOfArticle,
  image,
  onItemClick = () => {},
  rating,
  userName,
  userProfile,
  date,
  rating_count,
  catagoryName,
}) => {
  return (
    <View style={Styles.containerNews}>
      <TouchableOpacity onPress={() => onItemClick()}>
        <View style={[Styles.newsbox1, {flexDirection: 'row'}]}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 30,
              flex: 0.5,
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>
                {userName}
              </Text>
              <Text style={{color: 'grey', fontSize: 10}}>{date}</Text>
            </View>

            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/public/images/profiles/' +
                  userProfile,
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View> */}
          {/* <View
            style={{
              flexDirection: 'row',
              marginLeft: 'auto',
              width: '100%',
              backgroundColor: 'red',
            }}> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
              paddingVertical: 5,
              // alignItems: 'center',
            }}>
            <View style={{width: '60%', alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  marginRight: 10,
                  color: 'black',
                }}
                // numberOfLines={4}
              >
                {titleOfArticle?.length > 150
                  ? titleOfArticle?.slice(0, 150)
                  : titleOfArticle}
              </Text>
              <Text
                style={{
                  color: 'grey',
                  fontSize: 10,
                  marginHorizontal: 20,
                  marginVertical: 10,
                  marginTop: 'auto',
                }}>
                {date}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onItemClick()}
              style={{
                // marginTop: -50,
                alignSelf: 'center',
              }}>
              <FastImage
                style={Styles.imageNews}
                source={{
                  uri: 'http://www.tasdeertech.com/public/images/news/' + image,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage?.resizeMode.cover}
              />
              {/* <Image
               
                style={Styles.imageNews}
                resizeMode="cover"></Image> */}
            </TouchableOpacity>
            {/* <View style={{left: 5, position: 'absolute', bottom: 2}}>
              <Ionicons
                name="arrow-back-sharp"
                size={22}
                color="brown"
                style={Styles.arrow}
              />
            </View> */}

            {/* <View
              style={{
                flexDirection: 'row',
                right: width / 2 - 40,
                bottom: 5,
                position: 'absolute',
              }}>
              <Rating
                showReadOnlyText={true}
                ratingCount={5}
                startingValue={initialCount}
                readonly={true}
                //onFinishRating={(rating) => { //console.log('Star Rating' + JSON.stringify(rating)); }}
                imageSize={20}
                style={{paddingVertical: 10}}
                ratingColor={'crimson'}
                type="custom"
                ratingBackgroundColor={'black'}
                tintColor="white"
              />
            </View> */}
          </View>
          {/* </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default NewsPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
