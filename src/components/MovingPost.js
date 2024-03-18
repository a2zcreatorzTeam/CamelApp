/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import {Dimensions} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
import {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {imageBaseUrl, thumbnailBaseUrl} from '../constants/urls';
import {family} from '../constants/Family';

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
  onDetailsClick = () => {},
}) => {
  const [viewCount, setViewCount] = useState(item?.view_count);

  return (
    <View style={Styles.container}>
      <View style={Styles.newsbox1}>

        {image ? (
          <FastImage
            style={{
              height: 170,
              width: '40%',
              alignSelf: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: 'gray',
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
              height: 170,
              width: '40%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: 'gray',
            }}>
            {
              <FastImage
                style={{
                  height: 170,
                  width: '100%',
                  // left: 10,
                  borderRadius: 10,
                  opacity: 0.5,
                }}
                source={
                  thumbnail !== null
                    ? {
                        uri: thumbnailBaseUrl + thumbnail?.thumbnail,
                        headers: {Authorization: 'someAuthToken'},
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
              onPress={() => {}}>
              <Image
                activeOpacity={0.4}
                source={require('../../assets/play.png')}
                resizeMode={'cover'}
                style={{width: 60, height: 60}}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={{width: '60%'}}>
          <View
            style={{
              // top: 5,
              // bottom: 35,
              // right: width / 3,
              // position: 'absolute',
              padding: 20,
              marginRight: 10,
              width: '100%',
              paddingRight: 5,
            }}>
            <Text style={styles.text}>
              {ArabicText.Title}: {title}{' '}
            </Text>
            <Text style={styles.text}>
              {ArabicText.Type}: {type}
            </Text>
            {item?.category_name == 'تسبيل الفحول' ? (
              <Text style={styles.text}>
                {ArabicText.Location}:{location}
              </Text>
            ) : (
              <>
                <Text style={styles.text}>
                  {ArabicText.Location_From}:{location}
                </Text>

                <Text style={styles.text}>
                  {ArabicText.Location_To}:{locationTo}
                </Text>
              </>
            )}

            {price ? (
              <Text style={styles.text}>
                {' '}
                {ArabicText.Price}:{price}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={{
              marginBottom: 10,
              alignSelf: 'flex-start',
            }}
            onPress={() => {
              onDetailsClick(viewCount, setViewCount);
            }}>
            <View style={Styles.btnHome}>
              <Text style={Styles.textbtn}>{ArabicText.Details}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    fontSize: 16,
    // padding: 5,
    color: 'black',
    fontFamily: family.Neo_Medium,
  },
});
