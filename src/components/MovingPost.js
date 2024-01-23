import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { Styles } from '../styles/globlestyle';
import { Card } from 'react-native-paper';
import { Dimensions } from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
import { useState } from 'react';
import FastImage from 'react-native-fast-image';
import { imageBaseUrl, thumbnailBaseUrl } from '../constants/urls';

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
  locationTo,
  thumbnail,
  onDetailsClick = () => { },
}) => {
  const [viewCount, setViewCount] = useState(item?.view_count);
  console.log(item, "movingCamelll");

  return (
    <Card>
      <View style={Styles.container}>
        <View style={Styles.newsbox1}>
          {image ? (
            <FastImage
              style={{
                alignSelf: 'flex-end',
                marginLeft: 'auto',
                height: 170,
                width: '45%',
                alignSelf: 'center',
                justifyContent: 'center',
                left: 10,
                borderRadius: 10,
              }}
              source={
                image
                  ? {
                    uri: imageBaseUrl + image,
                  }
                  : require('../../assets/dummyImage.jpeg')
              }
              resizeMode={FastImage?.resizeMode.cover}
            />
          ) : (
            <View
              style={{
                alignSelf: 'flex-end',
                marginLeft: 'auto',
                height: 170,
                width: '45%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {
                <FastImage
                  style={{
                    height: 170,
                    width: '100%',
                    left: 10,
                    borderRadius: 10,
                    opacity: 0.5,
                  }}
                  source={
                    thumbnail !== null
                      ? {
                        uri: thumbnailBaseUrl + thumbnail?.thumbnail,
                        headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }
                      : require('../../assets/camel.png')
                  }
                  resizeMode={FastImage?.resizeMode.cover}
                />
              }
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  height: 70,
                  width: 70,
                  alignItems: 'center',
                  position: 'absolute',
                  elevation: 2,
                  right: 20,
                  top: 50,
                }}
                onPress={() => { }}>
                <Image
                  activeOpacity={0.4}
                  source={require('../../assets/play.png')}
                  resizeMode={'cover'}
                  style={{ width: 60, height: 60 }}
                />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              top: 5,
              bottom: 35,
              right: width / 3,
              position: 'absolute',
              padding: 20,
              marginRight: 15,
            }}>
            <Text style={styles.text}>
              {ArabicText.Title}: {title}{' '}
            </Text>
            <Text style={styles.text}>
              {ArabicText.Type}: {type}
            </Text>
            {
              item?.category_name == 'تسبيل الفحول' ? <Text style={styles.text}>
                {ArabicText.Location}:{location}
              </Text> :
                <><Text style={styles.text}>
                  {ArabicText.Location_From}:{location}
                </Text>

                  <Text style={styles.text}>
                    {ArabicText.Location_To}:{locationTo}
                  </Text>
                </>
            }

            {price ? (
              <Text style={styles.text}>
                {' '}
                {ArabicText.Price}:{price}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={{ left: 10, position: 'absolute', bottom: 5 }}
            onPress={() => {
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
