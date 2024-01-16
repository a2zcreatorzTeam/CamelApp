import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Post from '../components/MovingPost';
import camelapp from '../api/camelapp';
import AddButton from '../components/AddButton';
import * as ArabicText from '../language/EnglishToArabic';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import Header from '../components/Header';
import EmptyComponent from '../components/EmptyComponent';
import {Styles} from '../styles/globlestyle';

class CamelFemaleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      filterPosts: [],
      searchText: '',
      refreshing: false,
      searchedItem: '',
    };
  }
  searchFunction(searchtext) {
    console.log('searchtext', searchtext);
    if (searchtext != undefined && searchtext?.length != 0) {
      this.setState({searchedItem: searchtext});
      let tempPost = this.state.posts.filter(item => {
        return (
          item.user_name.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.name.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.user_phone.toLowerCase().indexOf(searchtext) > -1 ||
          item.id == this.searchtext ||
          item.title.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.location.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 ||
          item.camel_type.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.category_name.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.user_phone.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.description.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.camel_type.toLowerCase().indexOf(searchtext.toLowerCase()) >
            -1 ||
          item.camel_type.toLowerCase().indexOf(searchtext.toLowerCase()) > -1
        );
      });
      // console.log('tempPost.length--femaleList', tempPost.length);

      this.setState({filterPosts: tempPost});
    }
  }
  search(text) {
    this.setState({searchText: text});
  }
  async viewPosts() {
    const {key} = this.state;
    let {user} = this.props;
    user = user?.user?.user;
    try {
      return await camelapp
        .post('/get/camel_female', {
          user_id: user?.id,
        })
        .then(res => {
          console.log('res', res.data.Posts);
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
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.viewPosts();
    });
  };
  render() {
    const {
      filterPosts,
      posts,
      searchedItem,
      key,
      loader,
      refreshing,
      searchText,
    } = this.state;
    let {user} = this.props;
    user = user?.user?.user;
    const renderItem = ({item}) => {
      console.log(item, 'itemmmm');
      return (
        <Post
          date={item?.date}
          item={item}
          title={item.title}
          location={item.location}
          color={item.color}
          type={item.camel_type}
          image={item.img[0]}
          thumbnail={item?.thumbnail}
          detailBUTTON={ArabicText.PLACEHOLDER_DETAIL}
          onDetailsClick={(viewCount, setViewCount) => {
            console.log('workingggg');
            onDetailsClick(item, viewCount, setViewCount);
          }}
        />
      );
    };
    const onDetailsClick = (item, viewCount, setViewCount) => {
      // if (user != undefined) {
      this.props.navigation.navigate('DetailsFemaleCamel', {
        itemFromDetails: item,
      });
      // }
    };
    const onAddButtonClick = () => {
      let {user} = this.props;
      if (user?.user?.status == true) {
        this.props.navigation.navigate('CamelFemaleForm');
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    return (
      <View style={styles.container}>
        <Header
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: '', searchText: ''});
            }
          }}
          onPressSearch={() => this.searchFunction(searchText)}
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
          <View style={{flex: 1}}>
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
                <Text style={Styles.catBtnText}>{ArabicText?.FemaleCamel}</Text>
              </TouchableOpacity>
              <AddButton onPress={() => onAddButtonClick()} />
            </View>
            <FlatList
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
              contentContainerStyle={{paddingBottom: '20%'}}
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelFemaleList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
