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
import camelapp from '../api/camelapp';
import * as userActions from '../redux/actions/user_actions';
import EmptyComponent from '../components/EmptyComponent';
import Header from '../components/Header';
import { profileBaseUrl } from '../constants/urls';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;

class MyFriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      getUserDropList: [],
      userList: [],
      loader: false,
      searchedItem: '',
      searchText: '',
      filteredUsers: [],
    };
  }
  getUsersDetails = async data => {
    let {user} = this.props;
    user = user?.user?.user;
    console.log(user, 'useer67rer');
    try {
      return await camelapp.get('/friendlist/' + user?.id).then(res => {
        console.log(res?.data, 'dataaaa');
        this.setState({userList: res?.data});
      });
    } catch (error) {
      this.setState({loader: false});
      console.log('Error Message--- view post', error?.response);
    }
  };
  componentDidMount() {
    this.getUsersDetails();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  navigateToMessages = item => {
    let payload = {
      user_name: item?.firend_name,
      user_image: item?.firend_image,
      id: item?.firend_id,
    };
    this.props.navigation.navigate('MessageViewScreen', {messageData: payload});
  };
  ScrollToRefresh() {
    this.getUsersDetails();
    this.setState({refreshing: false});
  }
  searchFunction(searchtext) {
    if (searchtext != undefined && searchtext?.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state.userList.filter(item => {
        return (
          item.firend_name.toLowerCase().indexOf(searchtext.toLowerCase()) > -1
        );
      });
      console.log(tempPost, 'posttt');
      this.setState({filteredUsers: tempPost});
    }
  }
  search(text) {
    this.setState({searchText: text});
  }
  render() {
    const {userList, filteredUsers, searchedItem} = this.state;
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
                  // 'http://www.tasdeertech.com/public/images/profiles/' +
                  profileBaseUrl+
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
          userName={item?.firend_name}
          userImage={item.firend_image}
          onUserMessageClick={() => this.navigateToMessages(item)}
        />
      );
    };
    return (
      <View
        style={{flex: 1, backgroundColor: '#fff', width: width, height: hight}}>
        <Header
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: '', searchText: ''});
            }
          }}
          onPressSearch={() => this.searchFunction(this.state.searchText)}
        />
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
            data={searchedItem ? filteredUsers : userList}
            renderItem={renderItem}
            keyExtractor={item => item?.id?.toString()}
          />
        )}
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
export default connect(mapStateToProps, mapDispatchToProps)(MyFriendList);
