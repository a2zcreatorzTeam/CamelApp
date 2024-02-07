import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  View,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import {ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {height, width} = Dimensions.get('screen');
const VideoModal = ({
  modalItem,
  closeModal = () => {},
  onLoadStart = () => {},
  onReadyForDisplay = () => {},
  onPress = () => {},
  loadVideo,
  pausedCheck,
  videoModal,
}) => {
  return (
    <Modal
      visible={videoModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.modalContainer}>
        {/* Modal Close Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            closeModal();
          }}
          style={styles.modalCloseBTN}>
          <AntDesign name="closecircle" size={35} color="#fff" />
        </TouchableOpacity>

        <View
          style={{
            height: 350,
            justifyContent: 'center',
          }}>
          <View style={styles.imageCarousal}>
            {
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ededed',
                  justifyContent: 'center',
                }}>
                <Video
                  onLoadStart={() => onLoadStart()}
                  onReadyForDisplay={() => onReadyForDisplay()}
                  source={modalItem}
                  resizeMode="contain"
                  repeat={true}
                  controls={false}
                  paused={pausedCheck}
                  style={[
                    styles.image,
                    {
                      width: width,
                      height: 350,
                    },
                  ]}
                />
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
                    onPress();
                  }}>
                  {loadVideo ? (
                    <ActivityIndicator size="large" />
                  ) : (
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
                  )}
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',
    width: width,
    backgroundColor: '#000000db',
    justifyContent: 'center',
  },
  modalCloseBTN: {top: 30, right: 15, position: 'absolute'},
  modalMediaWrpr: {
    width: width,
    height: 60,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 10,
  },
  video: {width: '100%', height: 400, borderWidth: 1, backgroundColor: 'black'},
  imageCarousal: {
    width: width,
    height: height / 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // overflow: 'hidden',
  },
});

export default VideoModal;
