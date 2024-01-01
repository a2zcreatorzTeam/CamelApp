import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Card} from 'react-native-paper';
import {Dimensions} from 'react-native';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import EmptyComponent from '../components/EmptyComponent';
import BackBtnHeader from '../components/headerWithBackBtn';
const width = Dimensions.get('screen').width;
import * as ArabicText from '../language/EnglishToArabic';
import {profileBaseUrl} from '../constants/urls';
const hight = Dimensions.get('screen').height;

class FollowersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      userList: [],
      loader: false,
    };
  }
  userProfileClick = item => {
    let itemUser = item?.user;
    itemUser['user_images'] = item?.user?.image;
    itemUser['user_name'] = item?.user?.name;
    itemUser['user_id'] = item?.user?.id;
    let {user} = this.props;
    user = user?.user?.user;
    console.log(
      item?.item?.id,
      'item?.item?.id',
      'item?.user?.id',
      item?.user?.id,
      'item',
      item,
    );
    if (user != undefined) {
      if (item?.user?.id == user?.id) {
        this.props?.navigation.navigate('Profile', {screen: 'حسابي'});
      } else {
        this.props?.navigation?.navigate('UserProfile', {
          user_id: item?.user?.id,
          userProfile: itemUser,
        });
      }
    } else {
      this.props?.navigation?.navigate('UserProfile', {
        user_id: item?.user?.id,
        userProfile: itemUser,
      });
    }
  };
  async getData() {
    let {user} = this.props;
    user = user?.user?.user;
    let {id} = this.props?.route?.params;
    this.setState({loader: true});
    try {
      return await camelapp.get('/getAllFollowers/' + id).then(res => {
        this.setState({userList: res?.data[0]});
        this.setState({loader: false});
      });
    } catch (error) {
      this.setState({loader: false});
    }
  }
  ScrollToRefresh() {
    this.getData();
    this.setState({loader: false});
  }
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  };
  componentWillUnmount() {
    this.focusListener();
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
                  // 'http://www.tasdeertech.com/public/images/profiles/' +
                  profileBaseUrl + userImage,
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
          userName={item?.user?.name}
          userImage={item?.user?.image}
          onUserMessageClick={() => {
            this.userProfileClick(item);
          }}
        />
      );
    };
    return (
      <View
        style={{flex: 1, backgroundColor: '#fff', width: width, height: hight}}>
        <BackBtnHeader title={ArabicText?.followerslist} />
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
                refreshing={this.state.loader}
                onRefresh={() => this.ScrollToRefresh()}
              />
            }
            contentContainerStyle={{flexGrow: 1}}
            style={{flex: 1}}
            ListEmptyComponent={() => <EmptyComponent />}
            data={userList}
            renderItem={renderItem}
            keyExtractor={item => item?.item?.id?.toString()}
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
export default connect(mapStateToProps, mapDispatchToProps)(FollowersList);
