import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

import {Rating} from 'react-native-ratings';

const NewsPost = ({
  titleOfArticle,
  image,
  onItemClick = () => {},
  rating,
  userName,
  userProfile,
  date,
  rating_count,
}) => {
  let initialCount = (rating / rating_count).toFixed(2);
  console.log(initialCount, 'initialCount');
  return (
    <View style={Styles.containerNews}>
      <TouchableOpacity onPress={() => onItemClick()}>
        <View style={[Styles.newsbox1, {flex: 1, flexDirection: 'column'}]}>
          <View
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
          </View>

          <View style={{flexDirection: 'row', flex: 1}}>
            <Text
              style={{
                width: '55%',
                fontSize: 14,
                fontWeight: '700',
                textAlign: 'right',
                marginRight: 10,
                color: 'black',
              }}
              numberOfLines={4}>
              {titleOfArticle}
            </Text>

            <TouchableOpacity
              onPress={() => onItemClick()}
              style={{marginTop: -50}}>
              <Image
                source={{
                  uri: 'http://www.tasdeertech.com/public/images/news/' + image,
                }}
                style={Styles.imageNews}
                resizeMode="cover"></Image>
            </TouchableOpacity>
            <View style={{left: 5, position: 'absolute', bottom: 2}}>
              <Ionicons
                name="arrow-back-sharp"
                size={22}
                color="brown"
                style={Styles.arrow}
              />
            </View>

            <View
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
            </View>
          </View>
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
