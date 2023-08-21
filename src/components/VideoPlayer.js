import {
    ActivityIndicator,
    ImageBackground,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useRef} from 'react';
  import Images from '../../assets/Images';
  import {Colors} from '../../config';
  import {WebView} from 'react-native-webview';
  import AppBackground from '../../components/AppBackground';
  const VideoPlayer = ({props}) => {
    return (
     
        <WebView
          source={{uri: 'https://www.w3schools.com/html/mov_bbb.mp4'}}
          style={[
            {
              backgroundColor: 'lightgrey',
            }
           
          ]}
       
        />
    );
  };
  
  export default VideoPlayer;
  
  const styles = StyleSheet.create({});
  