import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Card} from 'react-native-paper';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import camelapp from '../../api/camelapp';
import * as userActions from '../../redux/actions/user_actions';
import EmptyComponent from '../../components/EmptyComponent';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      getMessagesList: [],
      getUserDropList: [],
      userList: [],
      loader: false,
    };
  }
  getUsersDetails = async data => {
    try {
      return await camelapp.post('getMultipleUsersDetails', data).then(res => {
        this.setState({userList: res?.data});
        this.setState({loader: false});
      });
    } catch (error) {
      this.setState({loader: false});
      console.log('Error Message--- view post', error?.response);
    }
  };
  getUserDropList(user_id) {
    console.log('user_oddd');
    const currentUser = user_id; // Replace with the logged-in user's ID
    const chatRoomsRef = firestore()
      .collection('chats')
      .where(`members.${currentUser}`, '==', true);
    console.log('heloo');
    const unsubscribe = chatRoomsRef.onSnapshot(async querySnapshot => {
      if (querySnapshot.docs.length !== 0) {
        // Handle the case when no documents match the query.
        // Set a message or state to indicate no data.
        console.log('No matching documents in Firestore');

        const usersData = [];
        console.log('insideUnsubb');
        for (const doc of querySnapshot?.docs) {
          console.log('5777');
          const chatRoomData = doc.data();
          const otherUserId = Object.keys(chatRoomData.members).find(
            userId => userId != currentUser,
          );
          console.log(otherUserId, 'otherUserId');
          // Query the messages subcollection to get the last message
          const lastMessageQuery = await firestore()
            .collection('chats')
            .doc(doc.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();
          // if (!lastMessageQuery.empty) {
          const lastMessageDoc = lastMessageQuery?.docs[0];
          const lastMessageData = lastMessageDoc
            ? lastMessageDoc?.data()
            : null;
          // Fetch user details for the other user
          if (lastMessageData && user_id) {
            const userWithLastMessage = {
              id: otherUserId,
              message: lastMessageData?.text ? lastMessageData?.text : '',
              timestamp: lastMessageData.timestamp,
              location:
                lastMessageData?.latitude && lastMessageData?.longitude
                  ? true
                  : false,
            };
            usersData.push(userWithLastMessage);
          }
          usersData.sort((a, b) => b.timestamp - a.timestamp);
          this.getUsersDetails(usersData);
          this.setState({getUserDropList: usersData});
        }
      } else {
        this.setState({loader: false});
      }
    });
    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }
  checkUserLogedIn() {
    let {user} = this.props;
    if (user?.user?.user != undefined) {
      this.setState({loader: true});
      this.getUserDropList(user?.user?.user?.id);
    } else {
      this.setState({loader: false});
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
  navigateToMessages = item => {
    this.props.navigation.navigate('MessageViewScreen', {messageData: item});
  };
  ScrollToRefresh() {
    this.checkUserLogedIn();
    this.setState({refreshing: false});
  }
  render() {
    const {userList} = this.state;

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
          userName={item?.user_name}
          userImage={item.user_image}
          lastMessage={item.message}
          onUserMessageClick={() => this.navigateToMessages(item)}
        />
      );
    };
    return (
      <View
        style={{flex: 1, backgroundColor: '#fff', width: width, height: hight}}>
        <ActivityIndicator
          size="large"
          color="#D2691Eff"
          animating={this.state.loader}
          style={styles.activityIndicator}
        />
        {this.state.loader == false && (
          <FlatList
            initialNumToRender={userList?.length}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.ScrollToRefresh()}
              />
            }
            contentContainerStyle={{flexGrow: 1}}
            style={{flex: 1}}
            ListEmptyComponent={() => <EmptyComponent />}
            data={userList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        )}

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('MyFriendList')}
          style={{marginTop: 'auto', margin: 30}}>
          <AntDesign name="pluscircle" size={50} color="#D2691Eff" />
        </TouchableOpacity>
      </View>
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
const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Messages);
