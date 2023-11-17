import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Post from '../components/MovingPost';
import camelapp from '../api/camelapp';
import EmptyComponent from '../components/EmptyComponent';
import AddButton from '../components/AddButton';
import * as ArabicText from '../language/EnglishToArabic';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Header from '../components/Header';
import {Styles} from '../styles/globlestyle';
import {TouchableOpacity} from 'react-native';

class CamelMovingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      filterPosts: [],
      searchText: '',
      playVideo: false,
      refreshing: false,
      searchedItem: '',
      key: false,
      To: '',
      From: '',
    };
  }

  search(text) {
    this.setState({searchText: text});
  }
  searchFunction(searchtext) {
    const {key} = this.state;
    if (searchtext != undefined && searchtext?.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state?.posts.filter(item => {
        return (
          item?.user_name?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.name?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.title?.toLowerCase().includes(searchtext.toLowerCase()) ||
          item?.user_location
            ?.toLowerCase()
            ?.includes(searchtext.toLowerCase()) ||
          item?.price?.toLowerCase()?.includes(searchtext.toLowerCase()) ||
          item?.type?.toLowerCase()?.includes(searchtext.toLowerCase())
        );
      });
      this.setState({filterPosts: tempPost, key: !key});
    }
  }
  searchLocationFunction(To, From) {
    const {key} = this.state;
    if (
      To != undefined &&
      From != undefined &&
      To?.length != 0 &&
      From?.length != 0
    ) {
      let tempPost = this.state?.posts.filter(item => {
        return (
          item?.location?.toLowerCase().includes(From.toLowerCase()) &&
          item?.to_location?.toLowerCase().includes(To.toLowerCase())
        );
      });
      this.setState({filterPosts: tempPost, key: !key});
    }
  }
  async viewPosts() {
    const {key} = this.state;
    const user = this.props?.user;
    userData = user?.user?.user;
    try {
      return await camelapp
        .post('/get/camelmove', {
          user_id: userData?.id,
        })
        .then(res => {
          this.setState({
            posts: res.data.Posts,
            loader: false,
            filterPosts: res.data.Posts,
            key: !key,
          });
        });
    } catch (error) {
      //console.log("Error Message camel Moving List", error.response);
    }
  }
  postViewed = async (item, viewCount, setViewCount) => {
    this.setState({loading: false});
    let {user} = this.props;
    user = user?.user?.user;
    let post_id = item?.id;
    if (user != undefined) {
      await camelapp
        .post('/add/view', {
          user_id: user?.id,
          post_id: post_id,
        })
        .then(response => {
          if (response?.data?.message !== 'Already Viewed') {
            setViewCount(viewCount + 1);
          }
        })
        .catch(error => {
          this.setState({loading: false});
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.viewPosts();
    });
  };
  componentWillUnmount() {
    this.focusListener();
  }
  render() {
    const {
      key,
      filterPosts,
      searchedItem,
      To,
      From,
      loader,
      refreshing,
      searchText,
    } = this.state;
    let {user} = this.props;
    user = user.user.user;
    const renderItem = ({item}) => {
      return (
        <Post
          date={item?.date}
          item={item}
          title={item?.title}
          type={item?.car_type}
          price={item?.price}
          location={item?.location}
          locationTo={item?.to_location}
          color={item?.color}
          image={item?.img[0]}
          detailBUTTON={ArabicText.PLACEHOLDER_DETAIL}
          onDetailsClick={(viewCount, setViewCount) => {
            onDetailsClick(item, viewCount, setViewCount);
          }}
        />
      );
    };
    const onDetailsClick = (item, viewCount, setViewCount) => {
      // if (user != undefined) {
      this.props.navigation.navigate('DetailsMovingCamel', {
        itemFromDetails: item,
      });
      // } else {
      //   this.props.navigation.navigate('Login');
      // }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user.user.status == true) {
        this.props.navigation.navigate('MovingCamelForm');
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    console.log('CAMELMOVINGLIST');
    return (
      <View style={styles.container}>
        <Header
          filterIcon
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: '', searchText: ''});
            }
          }}
          onChangeTo={text => {
            if (text) {
              this.setState({To: text});
            } else {
              this.setState({To: '', searchedItem: ''});
            }
          }}
          onChangeFrom={text => {
            if (text) {
              this.setState({From: text});
            } else {
              this.setState({From: '', searchedItem: ''});
            }
          }}
          onPressSearch={() => {
            To?.length && From?.length
              ? this.searchLocationFunction(To, From)
              : this.searchFunction(searchText);
          }}
        />
        {loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={loader}
            style={{marginTop: 20}}
          />
        )}
        {loader == false && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  Styles.btnHome2,
                  {
                    width: '30%',
                    height: 40,
                    borderRadius: 10,
                  },
                ]}
                onPress={() => {}}>
                <Text style={Styles.catBtnText}>{ArabicText?.MovingCamel}</Text>
              </TouchableOpacity>
              <AddButton onPress={() => onAddButtonClick()} />
            </View>
            <FlatList
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
              contentContainerStyle={{paddingBottom: '20%'}}
              data={
                searchedItem || (To && From) ? filterPosts : this.state?.posts
              }
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
              initialNumToRender={5}
              maxToRenderPerBatch={5}
            />
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelMovingList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
