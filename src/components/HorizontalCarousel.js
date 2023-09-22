import React from 'react';
import {View, Image, Dimensions, Text} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {StyleSheet} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('screen');
import * as ArabicText from '../language/EnglishToArabic';
const HorizontalCarousel = ({
  imagesArray,
  pausedCheck,
  onPress = () => {},
  pauseVideo = () => {},
  CustomUrl,
  price,
  lastBidPrice,
}) => {
  console.log(price?.length, 'priceeeee');
  return (
    <Carousel
      data={imagesArray}
      layout={'default'}
      scrollEnabled={true}
      onScroll={() => pauseVideo()}
      renderItem={({item, index}) => {
        console.log(item);
        const mediaSource =
          item.type == 'image'
            ? {
                uri: 'http://www.tasdeertech.com/images/posts/' + item.source,
              }
            : item.type == 'video'
            ? {uri: 'http://www.tasdeertech.com/videos/' + item?.source}
            : null;
        console.log(mediaSource, ',mediuisi');
        return (
          <View style={[Styles.imageCarousal, {position: 'relative'}]}>
            {CustomUrl &&
              item.mime != undefined &&
              item.mime.includes('image') && (
                <FastImage
                  style={Styles.image}
                  source={{
                    uri: item?.path,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage?.resizeMode.cover}
                />

                // <Image
                //   source={{
                //     uri: item?.path,
                //   }}
                //   key={String(index)}
                //   resizeMode={'cover'}
                //   style={Styles.image}
                // />
              )}
          
            {!CustomUrl && item?.type == 'image' && (
              // <Image
              //   source={{
              //     uri:
              //       'http://www.tasdeertech.com/images/posts/' + item?.source,
              //   }}
              //   key={String(index)}
              //   resizeMode={'cover'}
              //   style={Styles.image}
              // />
              <FastImage
                style={Styles.image}
                source={{
                  uri:
                    'http://www.tasdeertech.com/images/posts/' + item?.source,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage?.resizeMode.cover}
              />
            )}
            {(CustomUrl
              ? item.mime != undefined && item.mime.includes('video')
              : item.type == 'video') && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ededed',
                  width: width,
                }}>
                {pausedCheck && (
                  <Image
                    activeOpacity={0.4}
                    source={require('../../assets/camel.png')}
                    resizeMode={'cover'}
                    style={[
                      Styles.image,
                      {backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0.3},
                    ]}
                  />
                )}
                <TouchableOpacity
                  style={{
                    height: 70,
                    width: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    elevation: 2,
                    bottom: height / 6,
                    left: width / 2.3,
                  }}
                  onPress={() => {
                    onPress(
                      CustomUrl ? {uri: item?.path} : mediaSource,
                      item?.type,
                    );
                  }}>
                  <Image
                    activeOpacity={0.4}
                    source={
                      pausedCheck
                        ? require('../../assets/play.png')
                        : require('../../assets/pause.png')
                    }
                    resizeMode={'cover'}
                    style={{width: 70, height: 70}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      }}
      sliderWidth={width}
      itemWidth={width}
    />
  );
};

const styles = StyleSheet.create({
  video: {width: '100%', height: 400, borderWidth: 1, backgroundColor: 'black'},
  imageCarousal: {
    width: width,
    height: height / 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  priceContainer: {
    position: 'absolute',
    left: 20,
    top: 20,
    paddingTop: 5,
    alignItems: 'center',
    alignContent: 'center',
    width: 60,
    backgroundColor: '#D2691Eff',
    height: height * 0.065,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  priceTxt: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  bidPrice: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: 13,
  },
});

export default HorizontalCarousel;
