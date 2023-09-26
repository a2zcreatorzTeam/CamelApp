import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import {Dimensions} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
import {useState} from 'react';
import FastImage from 'react-native-fast-image';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const MovingPost = ({
  item,
  title,
  type,
  location,
  color,
  price,
  image,
  onDetailsClick = () => {},
}) => {
  const [viewCount, setViewCount] = useState(item?.view_count);
  return (
    <Card>
      <View style={Styles.container}>
        <View style={Styles.newsbox1}>
          <FastImage
            style={{
              height: height / 6,
              width: width / 3,
              right: 10,
              position: 'absolute',
            }}
            source={
              image
                ? {
                    uri: `http://www.tasdeertech.com/images/posts/${image}`,
                  }
                : require('../../assets/dummyImage.jpeg')
            }
            resizeMode={FastImage?.resizeMode.cover}
          />
          {/* <Image
            resizeMode="cover"
            source={
              image
                ? {
                    uri: `http://www.tasdeertech.com/images/posts/${image}`,
                  }
                : require('../../assets/dummyImage.jpeg')
            }
            style={{
              height: height / 6,
              width: width / 3,
              right: 10,
              position: 'absolute',
            }}></Image> */}
          <View
            style={{
              top: 5,
              bottom: 35,
              right: width / 3,
              position: 'absolute',
              padding: 20,
            }}>
            <Text style={styles.text}>
              {ArabicText.Title}: {title}{' '}
            </Text>
            <Text style={styles.text}>
              {ArabicText.Type}: {type}
            </Text>
            <Text style={styles.text}>
              {ArabicText.Location}:{location}
            </Text>
            <Text style={styles.text}>
              {' '}
              {ArabicText.Price}:{price}
            </Text>
          </View>

          <TouchableOpacity
            style={{left: 10, position: 'absolute', bottom: 5}}
            onPress={() => {
              console.log('gghghgh');
              onDetailsClick(viewCount, setViewCount);
            }}>
            <View style={Styles.btnHome}>
              <Text style={Styles.textbtn}>{ArabicText.Details}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};
export default MovingPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 16,
    padding: 5,
    color: 'black',
  },
});
