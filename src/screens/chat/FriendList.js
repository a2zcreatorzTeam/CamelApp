import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import camelapp from '../../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

const FriendList = prop => {
  const [friendRequest, setFriendRequest] = useState([]);

  const getFriendreq = async () => {
    try {
      const fetchData = await camelapp.get(
        '/getfriendrequest/' + prop?.user?.user?.user?.id,
      );
      setFriendRequest(fetchData.data);
      console.log(fetchData.data, '<<<=====getfriendrequest');
    } catch (error) {
      console.log(error, '=====ERROR getfriendrequest===');
    }
  };

  const friendRequestHandler = async (prop, status) => {
    try {
      const fetchData = await camelapp.post('/manage/friendrequest', {
        user_id: prop.user_id,
        friend_id: prop.friend_id,
        status: status,
      });
      getFriendreq();
    } catch (error) {
      console.log(error, '=====ERROR friendrequest===');
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    getFriendreq();
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
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
                  <Text style={styles.reqBTNtext}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => friendRequestHandler(item, 'R')}
                  style={[
                    styles.friendReqBTN,
                    {backgroundColor: '#ddd', left: 70},
                  ]}>
                  <Text style={{color: '#000', fontSize: 11}}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => friendRequestHandler(item, 'B')}
                  style={[
                    styles.friendReqBTN,
                    {
                      backgroundColor: '#C21807',
                      left: 127,
                    },
                  ]}>
                  <Text style={styles.reqBTNtext}>Block</Text>
                </TouchableOpacity>

                <View style={{justifyContent: 'flex-end'}}>
                  <Text style={styles.groupName} numberOfLines={2}>
                    {item?.name}
                  </Text>
                </View>

                <View style={styles.groupImageContainer}>
                  <Image
                    source={{
                      uri:
                        'http://www.tasdeertech.com/public/images/profiles/' +
                        item?.image,
                    }}
                    style={styles.groupImageStyle}
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
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },
  userName: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
    width: '100%',
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
  reqBTNtext: {color: '#fff', fontSize: 11},
});
