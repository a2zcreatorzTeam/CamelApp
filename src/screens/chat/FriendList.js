/* eslint-disable eqeqeq */
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import camelapp from '../../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {useIsFocused} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import EmptyComponent from '../../components/EmptyComponent';
import * as ArabicText from '../../language/EnglishToArabic';
import {profileBaseUrl} from '../../constants/urls';
import FastImage from 'react-native-fast-image';
import {family} from '../../constants/Family';

const {width} = Dimensions.get('screen');

const FriendList = prop => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(false);
  console.log(
    prop?.user?.user?.user?.id,
    'prop?.user?.user?.user?.idprop?.user?.user?.user?.id',
  );
  const getFriendreq = async () => {
    if (prop?.user?.user?.user?.id) {
      try {
        const fetchData = await camelapp.get(
          '/getfriendrequest/' + prop?.user?.user?.user?.id,
        );
        fetchData?.data?.FriendRequest?.length &&
          setFriendRequest(fetchData?.data?.FriendRequest),
          setKey(!key);
        fetchData?.data?.FriendRequest == undefined && setFriendRequest([]),
          setKey(!key);
      } catch (error) {
        console.log(error, 'errorrrrrr');
        setFriendRequest([]);
        setKey(!key);
      }
    }
  };
  const friendRequestHandler = async (prop, status) => {
    try {
      const fetchData = await camelapp.post('/manage/friendrequest', {
        user_id: prop?.user_id,
        friend_id: prop?.friend_id,
        status: status,
      });
      console.log(fetchData, status, 'statusstatus');
      getFriendreq();
    } catch (error) {
      console.log(error, '=====ERROR friendrequest===');
    }
  };
  const BlockContact = async prop => {
    try {
      const fetchData = await camelapp.post('/add/block', {
        user_id: prop?.user_id,
        friend_id: prop?.friend_id,
        status: 'B',
      });
      fetchData?.data?.status == 'successfully blocked' && getFriendreq();
    } catch (error) {
      console.log(error, '=====ERROR friendrequest===');
    }
  };
  const ScrollToRefresh = () => {
    setRefreshing(true);
    getFriendreq();
    setRefreshing(false);
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    getFriendreq();
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        ListEmptyComponent={() => <EmptyComponent />}
        key={key}
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => ScrollToRefresh()}
          />
        }
        data={friendRequest}
        renderItem={({item}) => {
          return (
            <TouchableWithoutFeedback
            // onPress={() => prop.navigation.navigate("GroupChat", { group_id: item?.id })}
            >
              <View style={styles.groupContainer}>
                <TouchableOpacity
                  onPress={() => friendRequestHandler(item, 'A')}
                  style={[
                    styles.friendReqBTN,
                    {backgroundColor: '#D2691E', left: 10},
                  ]}>
                  <Text style={styles.reqBTNtext}>{ArabicText.accept}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => friendRequestHandler(item, 'R')}
                  style={[
                    styles.friendReqBTN,
                    {backgroundColor: '#ddd', left: 70},
                  ]}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 11,
                      fontFamily: family.Neo_Regular,
                    }}>
                    {ArabicText.reject}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => BlockContact(item)}
                  style={[
                    styles.friendReqBTN,
                    {
                      backgroundColor: '#C21807',
                      left: 127,
                    },
                  ]}>
                  <Text style={styles.reqBTNtext}>{ArabicText.block}</Text>
                </TouchableOpacity> */}

                <View style={{justifyContent: 'flex-end'}}>
                  <Text style={styles.groupName} numberOfLines={2}>
                    {item?.friend_name}
                  </Text>
                </View>

                <View style={styles.groupImageContainer}>
                  <FastImage
                    style={styles.groupImageStyle}
                    source={
                      item?.data?.downloadURL
                        ? {
                            uri: profileBaseUrl + item?.friend_image,
                            headers: {Authorization: 'someAuthToken'},
                            priority: FastImage.priority.normal,
                          }
                        : require('../../../assets/image.png')
                    }
                    resizeMode={FastImage?.resizeMode.cover}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
      />
    </View>
  );
};
const mapStateToProps = state => ({
  user: state.user,
});
const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
const styles = StyleSheet.create({
  groupContainer: {
    backgroundColor: '#fff',
    width: width,
    height: 70,
    borderBottomColor: '#D2691E',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  groupName: {
    width: 90,
    color: '#000',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: family.Neo_Medium,
  },
  userName: {
    color: '#000',
    fontSize: 16,
    textAlign: 'right',
    width: '100%',
    fontFamily: family.Neo_Medium,
  },
  groupImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#D2691E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  groupImageStyle: {
    width: '95%',
    height: '95%',
    resizeMode: 'contain',
    borderRadius: 50,
  },
  friendReqBTN: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  reqBTNtext: {
    color: '#fff',
    fontSize: 11,
    fontFamily: family.Neo_Regular,
  },
});
