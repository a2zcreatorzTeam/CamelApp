import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EmptyComponent from '../components/EmptyComponent';
import Header from '../components/Header';
import {RefreshControl} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import * as ArabicText from '../language/EnglishToArabic';
import BackBtnHeader from '../components/headerWithBackBtn';
import {family} from '../constants/Family';

const width = Dimensions.get('screen').width;

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      searchedItem: '',
      searchText: '',
      filterPosts: [],
      key: false,
      refreshing: false,
    };
  }
  componentDidMount() {
    this.checkUserLogedIn();
  }
  checkUserLogedIn() {
    let {user} = this.props;
    // //console.log("user", this.props.user?.user?.user.id)
    if (user?.user?.user != undefined) {
      this.viewPosts();
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  async viewPosts() {
    let {user} = this.props;
    user = user?.user?.user.id;
    const {key} = this.state;
    await camelapp
      .get('/notification/' + user)
      .then(res => {
        console.log(res?.data?.notification, 'res?.data?.notification');
        this.setState({
          posts: res?.data?.notification,
          loader: false,
          key: !key,
        });
      })
      .catch(error => {
        console.log('Error notification  List----', error);
        this.setState({
          loader: false,
        });
      });
  }
  searchHandler = value => {
    const {key} = this.state;
    if (!value?.length) {
      this.setState({filterPosts: this.state.posts});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = this.state.posts.filter(item => {
        const {description} = item;
        return description?.toLowerCase().includes(value.toLowerCase());
      });
      if (filteredData.length > 0) {
        this.setState({filterPosts: filteredData, key: !key});
      } else {
        this.setState({filterPosts: [], key: !key});
      }
    }
  };
  // =============NEW Search Handler==============
  search(text) {
    this.setState({searchText: text});
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  onPressNotificaion = item => {
    if (
      item?.type == 'CHAT' ||
      (item?.type == 'chat' && item?.bid_status == 0)
    ) {
      this.props.navigation.navigate('MessageViewScreen', {
        messageData: {
          id: item?.sender_id,
          user_name: item?.sender_name,
          user_image: item?.sender_image,
        },
      });
    } else if (
      item?.type == 'CHAT' ||
      (item?.type == 'chat' && item?.bid_status == 1)
    ) {
      Toast.show({
        text1: ArabicText.offerhasbeenclosed,
        type: 'error',
        visibilityTime: 3000,
      });
    }
  };
  render() {
    const {filterPosts, key, searchedItem, posts} = this.state;
    const renderItem = ({item}) => {
      console.log(item, 'decccc');
      let d = new Date(item.created_at);
      return (
        <Post
          onPress={item => {
            this.onPressNotificaion(item);
          }}
          item={item}
          description={item.description}
          date={d.toLocaleString()}
          name={item?.sender_name}
        />
      );
    };
    return (
      <View style={styles.container}>
        <BackBtnHeader />
        {/* <Header
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: '', searchText: ''});
            }
          }}
          onPressSearch={() => this.searchFunction(this.state.searchText)}
        /> */}
        {this.state.loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={this.state.loader}
            style={{marginTop: 20}}
          />
        )}

        {this.state.loader == false && (
          <FlatList
            style={{
              flex: 1,
              width: '100%',
            }}
            key={key}
            ListEmptyComponent={() => <EmptyComponent />}
            data={searchedItem ? filterPosts : posts}
            contentContainerStyle={{
              paddingBottom: '10%',
              flexGrow: 1,
            }}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.ScrollToRefresh()}
              />
            }
          />
        )}
      </View>
    );
  }
}

const Post = ({description, date, item, onPress = () => {}, name}) => (
  <TouchableOpacity
    activeOpacity={0.99}
    onPress={() => onPress(item)}
    style={{
      width: width,
      height: 80,
      marginBottom: 5,
      backgroundColor: '#f3f3f3',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      paddingHorizontal: 10,
    }}>
    <View
      style={{
        width: width - 60,
        justifyContent: 'space-around',
        height: '70%',
        alignSelf: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            textAlign: 'right',
            fontFamily: Platform.OS == 'ios' ? null : family.Neo_Medium,
          }}>
          {description}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            textAlign: 'right',
            fontFamily: Platform.OS == 'ios' ? null : family.Neo_Medium,
          }}>
          {' ' + name + ' '}
        </Text>
      </View>
      <Text
        style={{
          color: 'black',
          fontSize: 12,
          width: width - 100,
          fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
        }}>
        {date}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: 50,
          alignSelf: 'flex-end',
          justifyContent: 'flex-end',
        }}></View>
    </View>
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 6,
        borderColor: 'grey',
        marginLeft: 4,
      }}>
      <MaterialIcons name="notifications-none" size={20} color="#D2691E" />
    </View>
  </TouchableOpacity>
);
const mapStateToProps = state => ({
  user: state.user,
});
const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
