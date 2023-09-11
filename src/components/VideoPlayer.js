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
  import {Colors} from '../../config';
  import {WebView} from 'react-native-webview';
  const VideoPlayer = ({props}) => {
    return (
     
        <WebView
          source={{uri: 'https://www.w3schools.com/html/mov_bbb.mp4'}}
          style={[
            {
              backgroundColor: 'lightgrey',
              width:300,
              height:200
            }
           
          ]}
       
        />
    );
  };
  
  export default VideoPlayer;
  
  const styles = StyleSheet.create({});
  