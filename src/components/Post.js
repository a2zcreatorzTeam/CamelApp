import React, {useState, memo} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import * as ArabicText from '../language/EnglishToArabic';
import {Card} from 'react-native-paper';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

//------Global Styling--------------//
import {Styles} from '../styles/globlestyle';

const Post = ({
  image,
  userName,
  userCity,
  likes,
  likeStatus,
  comments,
  shares,
  views,
  userImage,
  onCommentsClick,
  onLikesClick,
  title,
  category,
  onDetailsClick,
  onUserProfileClick,
  onCategoryClick,
  sharePost,
  imagesArray,
  pauseFlag,
  onTouchStart,
  pauseVideo,
  date,
  price,
  lastBidPrice,
}) => {
  const [modal, setModal] = useState(false);
  // const [pauseVideo, setpauseVideo] = useState(false)
  const [like, setLike] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Card style={{elevation: 5, marginTop: 10}}>
        {/**upper Header of card */}
        <View
          style={{
            height: 80,
            flexDirection: 'row',
            textAlign: 'right',
            width: width,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              width: width / 3,
              height: 60,
              flexDirection: 'row',
              marginTop: 5,
            }}
            onPress={onCategoryClick}>
            <View style={Styles.btnHome2}>
              <Text
                style={{color: '#D2691Eff', fontWeight: 'bold', fontSize: 15}}>
                {category}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: '#fff',
              // flexDirection: 'row',
              marginTop: 5,
              textAlign: 'right',
              position: 'absolute',
              right: 85,
            }}>
            <TouchableOpacity
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                height: '100%',
              }}
              onPress={onUserProfileClick}>
              <Text
                style={{
                  fontSize: 18,
                  paddingRight: 5,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {userName}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  paddingRight: 5,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {date}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  paddingRight: 5,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {userCity}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onUserProfileClick}
            style={{
              backgroundColor: '#fff',
              width: width / 5,
              height: 60,
              flexDirection: 'row',
              marginTop: 5,
            }}>
            <Image
              source={{
                uri: 'http://www.tasdeertech.com/images/profiles/' + userImage,
              }}
              style={{
                width: 55,
                height: 55,
                borderRadius: 30,
              }}></Image>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '50%',
            height: 30,
            borderRadius: 15,
            alignSelf: 'flex-end',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            position: 'absolute',
            bottom: 57,
            right: 7,
            zIndex: 999,
            flexDirection: 'row',
            backgroundColor: '#fff',
            elevation: 2,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}>
            <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
              {' '}
              {views}
            </Text>
            <Ionicons name="ios-eye-sharp" size={20} color="#CD853F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}
            onPress={sharePost}>
            <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
              {shares}
            </Text>
            <Ionicons name="share-social-sharp" size={20} color="#CD853F" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCommentsClick}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}>
            <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
              {comments}
            </Text>
            <Feather name="message-square" size={18} color="#CD853F" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onLikesClick(e => console.log('*****', e))}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'black', fontSize: 15, marginRight: 3}}>
              {likes}
            </Text>

            {likeStatus == true ? (
              <AntDesign name="heart" size={18} color="#CD853F" />
            ) : (
              <AntDesign name="hearto" size={18} color="#CD853F" />
            )}
          </TouchableOpacity>
        </View>
        {/* Post icons */}

        {/* OUTER CAROUSEL*/}
        <Carousel
          data={imagesArray}
          layout={'default'}
          scrollEnabled={true}
          renderItem={({item, index}) => {
            return (
              <TouchableWithoutFeedback onPress={() => setModal(true)}>
                <View style={[Styles.imageCarousal, {position: 'relative'}]}>
                  {price ? (
                    <View
                      style={{
                        marginHorizontal: 30,
                        position: 'absolute',
                        zIndex: 1111,
                        alignSelf: 'flex-start',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        height: hight / 2.5,
                        width: 100,
                      }}>
                      <View
                        style={{
                          paddingTop: 5,
                          alignItems: 'center',
                          alignContent: 'center',
                          width: 60,
                          backgroundColor: '#D2691Eff',
                          height: hight * 0.065,
                          borderBottomRightRadius: 50,
                          borderBottomLeftRadius: 50,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: '800',
                            fontSize: 14,
                          }}>
                          {' '}
                          {ArabicText.Price}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            fontWeight: '500',
                            fontSize: 13,
                          }}>
                          {lastBidPrice ? lastBidPrice : price}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {item.type == 'image' && (
                    <Image
                      source={{
                        uri:
                          'http://www.tasdeertech.com/images/posts/' +
                          item.source,
                      }}
                      key={String(index)}
                      resizeMode={'cover'}
                      style={Styles.image}
                    />
                  )}
                  {item.type == 'video' && (
                    <>
                      <Video
                        onTouchStart={onTouchStart}
                        // onTouchStart={onTouchStart}
                        source={{
                          uri:
                            'http://www.tasdeertech.com/videos/' + item.source,
                        }} // Can be a URL or a local file.
                        key={String(index)}
                        resizeMode="stretch"
                        controls={false}
                        paused={pauseFlag}
                        style={Styles.image}
                      />
                      <View
                        style={{
                          width: '15%',
                          height: 30,
                          borderRadius: 15,
                          alignSelf: 'flex-start',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          position: 'absolute',
                          bottom: 10,
                          left: 7,
                          zIndex: 999,
                          flexDirection: 'row',
                          backgroundColor: '#fff',
                          elevation: 2,
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 5,
                          }}
                          onPress={onTouchStart}>
                          {pauseFlag == false ? (
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 15,
                                marginRight: 3,
                              }}>
                              Pause
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 15,
                                marginRight: 3,
                              }}>
                              Play
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            );
          }}
          sliderWidth={width}
          itemWidth={width}
        />

        {/*MODAL INNER CAROUSEL*/}
        <Modal
          visible={modal}
          transparent={true}
          animationType={'fade'}
          onRequestClose={() => setModal(false)}>
          <View
            style={{
              height: '100%',
              width: width,
              backgroundColor: '#000000db',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setModal(false)}
              style={{top: 10, right: 15, position: 'absolute'}}>
              <AntDesign name="closecircle" size={35} color="#fff" />
            </TouchableOpacity>

            <View>
              <Carousel
                // keyExtractor={this.state.mixed.fileName}
                data={imagesArray}
                layout={'default'}
                scrollEnabled={true}
                // onScroll={() => this.setState({ pauseVideo: true})}
                renderItem={({item, index}) => {
                  console.log(
                    'item===>>>',
                    'https://www.tasdeertech.com/images/posts/' + item.source,
                  );

                  return (
                    <View style={Styles.imageCarousal}>
                      {item.type == 'image' && (
                        <Image
                          source={{
                            uri:
                              'https://www.tasdeertech.com/images/posts/' +
                              item.source,
                          }}
                          key={String(index)}
                          resizeMode={'cover'}
                          style={Styles.image}
                        />
                      )}
                      {item.type == 'video' && (
                        <Video
                          onTouchStart={onTouchStart}
                          source={{
                            uri:
                              'https://www.tasdeertech.com/videos/' +
                              item.source,
                          }} // Can be a URL or a local file.
                          key={String(index)}
                          resizeMode="stretch"
                          controls={false}
                          paused={pauseVideo}
                          style={Styles.image}
                        />
                      )}
                    </View>
                  );
                }}
                sliderWidth={width}
                itemWidth={width}
              />
            </View>

            <View
              style={{
                width: width,
                height: 60,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'absolute',
                bottom: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onUserProfileClick}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                }}>
                <Image
                  source={{
                    uri:
                      'http://www.tasdeertech.com/images/profiles/' + userImage,
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                  }}></Image>
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#fff',
                    textAlign: 'right',
                  }}>
                  {userName}
                </Text>
                <Text
                  // numberOfLines={1}
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    textAlign: 'right',
                  }}>
                  {userCity}
                </Text>
              </View>

              <View style={{position: 'absolute', right: 5, width: 220}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: '600',
                  }}>
                  {title}
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        <Card.Actions>
          <View style={Styles.posticon}>
            <TouchableOpacity onPress={onDetailsClick}>
              <View style={Styles.btnHome}>
                <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>
                  {ArabicText.Details}
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: '600',
              }}>
              {title}
            </Text>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
};
export default memo(Post);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    color: 'black',
  },
  textComment: {
    right: 85,
    position: 'absolute',
    color: 'black',
  },
});
