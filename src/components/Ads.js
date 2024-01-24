import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, Dimensions, FlatList } from 'react-native';
import camelapp from '../api/camelapp';
import { TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';
import { ImageBackground } from 'react-native';
import { mainImageUrl } from '../constants/urls';
import FastImage from 'react-native-fast-image';
import PaginationDots from './pagination';

const { width, height } = Dimensions.get('screen');
const Ads = () => {
  const [adsData, setAdsData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef(null);
  const viewAds = async () => {
    try {
      return await camelapp.get('/get-advertisement').then(res => {
        setAdsData(res?.data?.advertisement);
      });
    } catch (error) {
      console.log('advertisement:====', error);
    }
  };
  useEffect(() => {
    viewAds();
  }, []);
  return (
    <View style={{ height: 130, backgroundColor: 'white', paddingBottom: 10 }}>
      <FlatList
        data={adsData}
        pagingEnabled
        keyExtractor={item => item.id}
        renderItem={AdsComp}
        horizontal={true}
        inverted={true}

        snapToAlignment='center'
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideWidth = Dimensions.get('window').width;
          const currentIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
          console.log(currentIndex, "indexxx");
          console.log(currentIndex, slideWidth);
          setActiveSlide(currentIndex);
        }}
      />
      {adsData?.length > 1 && (
        <PaginationDots
          totalItems={adsData?.length}
          activeIndex={activeSlide}
          onPressDot={(index) =>
            flatListRef.current.scrollToIndex({ index, animated: true })
          }
        />
      )}
    </View>
  );
};
export default Ads;
const AdsComp = ({ item }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('wokinghgg');
        Linking.openURL(item?.url);
      }}
      style={{
        width: width,
        height: 110,
        backgroundColor: '#fff',
        padding: 2,
        alignItems: 'center',
      }}>
      <FastImage
        style={{ flex: 1, width: '100%', height: undefined, borderRadius: 7 }}
        source={{
          uri: `${mainImageUrl}advertisement/` + item?.image,

          headers: { Authorization: 'someAuthToken' },
          priority: FastImage.priority.high,
        }}
      resizeMode={FastImage?.resizeMode.contain}
      />
    </TouchableOpacity>
  );
};
