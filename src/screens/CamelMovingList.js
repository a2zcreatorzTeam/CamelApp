import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Platform,
  Dimensions,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackBtnHeader from '../components/headerWithBackBtn';
import shadows from '../helper/shadows';
import {family} from '../constants/Family';
const {width} = Dimensions.get('window');

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
      locationInput: false,
      searchedTo: '',
      searchedFrom: '',
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
    this.setState({searchedTo: To, searchedFrom: From});
    const {key} = this.state;
    if ((To && To.length > 0) || (From && From.length > 0)) {
      let tempPost = this.state?.posts?.filter(item => {
        return To && From
          ? item?.location?.toLowerCase().includes(From.toLowerCase()) &&
              item?.to_location?.toLowerCase().includes(To.toLowerCase())
          : (From &&
              item?.location?.toLowerCase().includes(From.toLowerCase())) ||
              (To &&
                item?.to_location?.toLowerCase().includes(To.toLowerCase()));
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
      locationInput,
    } = this.state;
    let {user} = this.props;
    user = user?.user?.user;
    const renderItem = ({item}) => {
      return (
        <Post
          thumbnail={item?.thumbnail}
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
      if (user?.user?.status == true) {
        this.props.navigation.navigate('MovingCamelForm');
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    return (
      <View style={styles.container}>
        {locationInput ? (
          <BackBtnHeader />
        ) : (
          <Header
            filterIcon={locationInput}
            onChangeText={text => {
              if (text) {
                this.search(text);
              } else {
                this.setState({searchedItem: '', searchText: ''});
              }
            }}
            // onChangeTo={text => {
            //   if (text) {
            //     this.setState({ To: text });
            //   } else {
            //     this.setState({ To: '', searchedItem: '', searchedTo: '' });
            //   }
            // }}
            // onChangeFrom={text => {
            //   if (text) {
            //     this.setState({ From: text });
            //   } else {
            //     this.setState({ From: '', searchedItem: '', searchedFrom: '' });
            //   }
            // }}
            onPressSearch={() => {
              // To?.length || From?.length
              //   ? this.searchLocationFunction(To, From)
              //   :
              this.searchFunction(searchText);
            }}
          />
        )}
        <View style={{backgroundColor: '#fff', flex: 1, alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  locationInput: !locationInput,
                  To: '',
                  From: '',
                  searchedItem: '',
                  searchText: '',
                })
              }
              style={[styles.btnContainer, {marginLeft: 10, marginRight: 0}]}>
              <FontAwesome name={'filter'} size={28} color="white" />
            </TouchableOpacity>

            <View
              style={{
                width: '80%',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              {locationInput && (
                <>
                  <View
                    style={[
                      Styles.searchbar,
                      {width: '40%', paddingHorizontal: 5, ...shadows.shadow5},
                    ]}>
                    <TextInput
                      value={To}
                      style={[
                        styles.searchInput,
                        {
                          width: '100%',
                          position: 'relative',
                        },
                      ]}
                      placeholder={ArabicText.To}
                      placeholderTextColor="black"
                      onChangeText={text => {
                        if (text) {
                          this.setState({To: text});
                          this.searchLocationFunction(text, From);
                        } else {
                          this.setState({
                            To: '',
                            searchedItem: '',
                            searchedTo: '',
                          });
                        }
                      }}
                    />
                  </View>
                  <View
                    style={[
                      Styles.searchbar,
                      {width: '40%', paddingHorizontal: 5, ...shadows.shadow5},
                    ]}>
                    <TextInput
                      value={From}
                      style={[
                        styles.searchInput,
                        {
                          width: '100%',
                          position: 'relative',
                        },
                      ]}
                      placeholder={ArabicText.From}
                      placeholderTextColor="black"
                      onChangeText={text => {
                        if (text) {
                          this.setState({From: text});
                          this.searchLocationFunction(To, text);
                        } else {
                          this.setState({
                            From: '',
                            searchedItem: '',
                            searchedFrom: '',
                          });
                        }
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
          {loader && (
            <ActivityIndicator
              size="large"
              color="#D2691Eff"
              animating={loader}
              style={{marginTop: 20}}
            />
          )}
          {loader == false && (
            <View style={{flex: 1, width: '100%', backgroundColor: '#fff'}}>
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
                  <Text style={Styles.catBtnText}>
                    {ArabicText?.MovingCamel}
                  </Text>
                </TouchableOpacity>
                <AddButton onPress={() => onAddButtonClick()} />
              </View>
              <FlatList
                style={{flex: 1}}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: width * 0.1,
                }}
                ListEmptyComponent={() => <EmptyComponent />}
                key={key}
                data={
                  searchedItem || To || From ? filterPosts : this.state?.posts
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
    width: '100%',
    backgroundColor: '#D2691Eff',
  },
  btnContainer: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    marginVertical: 20,
    backgroundColor: '#d2691e',
  },
  searchInput: {
    color: 'black',
    alignSelf: 'center',
    textAlign: 'right',
    width: '90%',
    height: '100%',
    zIndex: 20,
    position: 'absolute',
    fontFamily: family.Neo_Regular,
  },
});
