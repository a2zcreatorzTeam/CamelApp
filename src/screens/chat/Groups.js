import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import camelapp from '../../api/camelapp';
import {connect, useSelector} from 'react-redux';
import * as userActions from '../../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

const Groups = prop => {
  const [groupList, setGroupList] = useState([]);

  // console.log("****");

  const getGrouplist = async () => {
    // let { id } = prop.user.user.user;
    try {
      const fetchData = await camelapp.get(
        '/getgrouplist/' + prop.user.user.user.id,
      );
      setGroupList(fetchData?.data);
      console.log('fetchData group list', fetchData.data);
    } catch (error) {
      console.log(error, '=====ERROR OF Group LIST API===');
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    getGrouplist();
  }, [isFocused]);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Create Group Button*/}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.createBTN}
        onPress={() =>
          prop.navigation.navigate('CreateGroup', {
            userID: prop.user.user.user.id,
            refreshGrouplist: getGrouplist,
          })
        }>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <FlatList
        data={groupList}
        renderItem={({item}) => {
          return (
            item?.status == 1 && (
              <TouchableWithoutFeedback
                onPress={() =>
                  prop.navigation.navigate('GroupChat', {group_id: item?.id})
                }>
                <View style={styles.groupContainer}>
                  <View style={{width: '80%'}}>
                    <Text style={styles.groupName}>{item?.name}</Text>
                    {/* <Text style={styles.userName} >الفو توشوب <Text style={styles.lastMessage}>
                                        اربك تكست هو اول موقع يسمح لزواره الكرام بتحويل الكتابة العربي
                                    </Text></Text> */}
                  </View>

                  {/* <View style={styles.groupImageContainer}>
                                    <Image source={require("../../../assets/splashimg.png")}
                                        style={styles.groupImageStyle} />
                                </View> */}
                </View>
              </TouchableWithoutFeedback>
            )
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

export default connect(mapStateToProps, mapDispatchToProps)(Groups);

const styles = StyleSheet.create({
  createBTN: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#D2691E',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
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
    color: '#000',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'right',
  },
  userName: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
    width: '100%',
  },
  lastMessage: {
    color: '#aaa',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'right',
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
});
