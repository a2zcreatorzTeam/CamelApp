import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import camelapp from '../api/camelapp';

const width = Dimensions.get('screen').width;

const Ads = () => {
  const [adsData, setAdsData] = useState([]);
  const flatListRef = useRef();
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
    <View style={{height: 115}}>
      <FlatList
        data={adsData}
        pagingEnabled
        keyExtractor={item => item.id}
        renderItem={AdsComp}
        horizontal={true}
        inverted={true}
      />
    </View>
  );
};
export default Ads;

const AdsComp = ({item}) => {
  return (
    <View
      style={{
        width: width,
        height: 110,
        backgroundColor: '#fff',
        padding: 5,
        alignItems: 'center',
      }}>
      <View
        style={{
          width: width - 25,
          height: 100,
          backgroundColor: '#fff',
          elevation: 4,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Image
          source={{
            uri:
              'http://www.tasdeertech.com/images/advertisement/' + item?.image,
          }}
          style={{
            width: 200,
            height: '100%',
            borderRadius: 7,
            resizeMode: 'contain',
          }}
        />

        <Image
          source={require('../../assets/star.png')}
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            top: 6,
            right: 6,
          }}
        />

        <View style={{paddingHorizontal: 10, marginTop: 25}}>
          <Text style={{fontSize: 20, color: '#000', fontWeight: '600'}}>
            {item?.title}
          </Text>
          <Text style={{color: '#000', fontSize: 12, fontWeight: '300'}}>
            Created at: {item?.created_at.slice(2, 10)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
