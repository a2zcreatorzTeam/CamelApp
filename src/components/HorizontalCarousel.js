import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {StyleSheet} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {TouchableOpacity} from 'react-native';
const {width, height} = Dimensions.get('screen');
const HorizontalCarousel = ({
  imagesArray,
  pausedCheck,
  onPress = () => {},
  pauseVideo = () => {},
  CustomUrl,
}) => {
  return (
    <Carousel
      data={imagesArray}
      layout={'default'}
      scrollEnabled={true}
      onScroll={() => pauseVideo()}
      renderItem={({item, index}) => {
        console.log(
          CustomUrl
            ? item?.path
            : 'http://www.tasdeertech.com/images/posts/' + item.source,
        );
        const mediaSource =
          item.type == 'image'
            ? {
                uri: 'http://www.tasdeertech.com/images/posts/' + item.source,
              }
            : item.type == 'video'
            ? {uri: 'http://www.tasdeertech.com/videos/' + item.source}
            : null;
        return (
          <View style={Styles.imageCarousal}>
            {CustomUrl &&
              item.mime != undefined &&
              item.mime.includes('image') && (
                <Image
                  source={{
                    uri: item?.path,
                  }}
                  key={String(index)}
                  resizeMode={'cover'}
                  style={Styles.image}
                />
              )}

            {!CustomUrl && item?.type == 'image' && (
              <Image
                source={{
                  uri:
                    'http://www.tasdeertech.com/images/posts/' + item?.source,
                }}
                key={String(index)}
                resizeMode={'cover'}
                style={Styles.image}
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
});

export default HorizontalCarousel;
