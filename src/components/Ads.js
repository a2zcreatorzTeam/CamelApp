import React, {useEffect, useState} from 'react';
import {Text, View, Image, Dimensions, FlatList} from 'react-native';
import camelapp from '../api/camelapp';
import Toast from 'react-native-toast-message';
import * as ArabicText from '../language/EnglishToArabic';
import {TouchableOpacity} from 'react-native';
import {Linking} from 'react-native';

const width = Dimensions.get('window').width;
const Ads = () => {
  const [adsData, setAdsData] = useState([]);
  const viewAds = async () => {
    try {
      return await camelapp.get('/get-advertisement').then(res => {
        setAdsData(res?.data?.advertisement);
      });
    } catch (error) {
      // Toast.show({
      //   text1: error,
      //   type: 'error',
      //   visibilityTime: 3000,
      // });
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
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(item?.url);
      }}
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
          // aspectRatio: 1,
        }}>
          
        <Image
          resizeMode="contain"
          source={{
            uri:
              'http://www.tasdeertech.com/images/advertisement/' + item?.image,
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 7,
            // flex: 1,
          }}
        />

        {/* <Image
          source={require('../../assets/star.png')}
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            top: 6,
            right: 6,
          }}
        /> */}

        {/* <View style={{paddingHorizontal: 10, marginTop: 25}}>
          <Text style={{fontSize: 20, color: '#000', fontWeight: '600'}}>
            {item?.title}
          </Text>
          <Text style={{color: '#000', fontSize: 12, fontWeight: '300'}}>
            {ArabicText?.Createdat}: {item?.created_at.slice(2, 10)}
          </Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};
