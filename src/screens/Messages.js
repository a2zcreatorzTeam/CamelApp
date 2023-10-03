import React, {Component, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Modal,
  Button,
  Pressable,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Card, Searchbar} from 'react-native-paper';
import {Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import EmptyComponent from '../components/EmptyComponent';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
import firestore from '@react-native-firebase/firestore';
import {RefreshControl} from 'react-native';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      getMessagesList: [],
      getUserDropList: [],
    };
  }

  getUsersDetails = async data => {
    try {
      return await camelapp
        .post('getMultipleUsersDetails', {
          users: data,
        })
        .then(res => {
          console.log('responsee', res);
        });
    } catch (error) {
      // console.log('Error Message--- view post', error?.response);
    }
  };
  getUserDropList(user_id) {
    const currentUser = user_id; // Replace with the logged-in user's ID
    const chatRoomsRef = firestore()
      .collection('chats')
      .where(`members.${currentUser}`, '==', true);
    // const unsubscribe = chatRoomsRef.onSnapshot(querySnapshot => {
    //   const usersSet = new Set();
    //   querySnapshot.forEach(doc => {
    //     const chatRoomData = doc.data();
    //     Object.keys(chatRoomData.members).forEach(userId => {
    //       console.log(userId, 'iddd');
    //       if (userId != user_id) {
    //         usersSet.add(userId);
    //       }
    //     });
    //   });
    //   const usersArray = Array.from(usersSet);
    //   this.setState({getUserDropList: usersArray});
    // });
    // return () => {
    //   unsubscribe();
    // };
    const unsubscribe = chatRoomsRef.onSnapshot(async querySnapshot => {
      const usersData = [];
      for (const doc of querySnapshot.docs) {
        const chatRoomData = doc.data();
        const otherUserId = Object.keys(chatRoomData.members).find(
          userId => userId !== currentUser,
        );

        // Query the messages subcollection to get the last message
        const lastMessageQuery = await firestore()
          .collection('chats')
          .doc(doc.id)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        const lastMessageDoc = lastMessageQuery.docs[0];
        const lastMessageData = lastMessageDoc ? lastMessageDoc.data() : null;
        // Fetch user details for the other user
        if (lastMessageData && user_id) {
          const userWithLastMessage = {
            id: otherUserId,
            message: lastMessageData.text,
            timestamp: lastMessageData.timestamp,
          };
          usersData.push(userWithLastMessage);
        }
      }
      usersData.sort((a, b) => b.timestamp - a.timestamp);
      this.getUsersDetails(usersData);
      this.setState({getUserDropList: usersData});
    });
    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }

  getMessagesList(user_id) {
    camelapp
      .get('/getmsg/' + user_id)
      .then(res => {
        //console.log("response Get Message", res);
        this.setState({getUserDropList: res.data});
      })
      .catch(error => {
        console.log('getUserDropList====>> ', error);
      });
  }
  checkUserLogedIn() {
    let {user} = this.props;

    if (user.user.user != undefined) {
      this.getUserDropList(user.user.user.id);
      this.getMessagesList(user.user.user.id);
    } else {
      clearInterval(this.interval);
      this.props.navigation.navigate('Login');
    }
  }

  componentDidMount() {
    this.checkUserLogedIn();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  modalOpen = () => {
    this.setState({modal: true});
  };

  navigateToMessages = item => {
    this.props.navigation.navigate('MessageViewScreen', {messageData: item});
  };

  navigateToMessagesNew = item => {
    this.setState({modal: false});

    this.props.navigation.navigate('MessageNew', {messageData: item});
  };
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }

  render() {
    const ListItem = ({userName, userImage, onUserMessageClick}) => (
      <Card onPress={onUserMessageClick}>
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: width - 45,
            height: hight / 9.5,
            alignSelf: 'center',
            flexDirection: 'row',
            // marginBottom: 5,
            marginTop: 5,
          }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'right',
              fontWeight: 'bold',
              marginRight: 20,
              color: 'black',
            }}>
            {userName}
          </Text>

          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 60,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'grey',
            }}>
            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/public/images/profiles/' +
                  userImage,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
              }}></Image>
          </View>
        </View>
      </Card>
    );

    const Item = ({userName, userImage, onUserMessageClick}) => (
      <Card onPress={onUserMessageClick}>
        <View
          style={{
            backgroundColor: '#fff', // '#f3f3f3',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: width,
            height: 70,
            flexDirection: 'row',
            marginBottom: 5,
            borderBottomWidth: 1,
            borderColor: '#d2691e',
          }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'right',
              color: '#565756',
              fontWeight: '700',
              marginRight: 10,
              marginBottom: 5,
            }}>
            {userName}
          </Text>

          <View
            style={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#d2691e',
              marginRight: 10,
              overflow: 'hidden',
              marginBottom: 5,
            }}>
            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/public/images/profiles/' +
                  userImage,
              }}
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
        </View>
      </Card>
    );
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          userName={item.name}
          userImage={item.image}
          onUserMessageClick={() => this.navigateToMessages(item)}
        />
      );
    };
    const renderLisTItem = ({item}) => {
      return (
        <ListItem
          item={item}
          userName={item.name}
          userImage={item.image}
          onUserMessageClick={() => this.navigateToMessagesNew(item)}
        />
      );
    };
    return (
      // <SafeAreaView style={{flex: 1}}>
      <View
        style={{flex: 1, backgroundColor: '#fff', width: width, height: hight}}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.ScrollToRefresh()}
            />
          }
          contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
          style={{flex: 1}}
          ListEmptyComponent={() => <EmptyComponent />}
          data={this.state.getMessagesList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        {this.state.modal && (
          <Modal transparent={true} visible={this.state.modal}>
            <View
              style={{
                backgroundColor: '#ffffff',
                flex: 1,
                width: width,
                height: hight,
                alignItems: 'center',
              }}>
              <Pressable
                style={{
                  marginTop: 10,
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                }}
                onPress={modal => this.setState({modal: !modal})}>
                <Ionicons name="close" size={30} color="brown" />
              </Pressable>
              <View
                style={{
                  backgroundColor: '#FFFFFF',

                  borderRadius: 10,
                  flex: 1,
                }}>
                <View
                //  style={{ top: 1, justifyContent: 'center', alignItems: 'center', }}
                >
                  <Searchbar
                    placeholder="Search"
                    // onChangeText={(text) => searchFilterFunction(text)}
                    // onClear={(text) => searchFilterFunction('')}
                    // value={search}
                    style={{
                      width: width - 45,
                      height: 60,
                      alignSelf: 'center',
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                </View>
                <FlatList
                  data={this.state.getUserDropList}
                  renderItem={renderLisTItem}
                  keyExtractor={item => item.id}
                  style={{
                    width: width - 45,
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* 
          <TouchableOpacity style={[Styles.floatIcon, {
            position: 'absolute',
            left: 10,
            bottom: 150,
          }]} onPress={() => this.modalOpen()}>
            <MaterialCommunityIcons name="plus" size={30} color="#D2691E" style={{ padding: 5 }} />
          </TouchableOpacity> */}
      </View>
      // </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
