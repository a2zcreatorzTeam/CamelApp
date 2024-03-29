import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import camelapp from '../api/camelapp';
import Ads from '../components/Ads';
import NewsPost from '../components/NewsPost';
import Header from '../components/Header';
import EmptyComponent from '../components/EmptyComponent';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
const {width} = Dimensions.get('window');
class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      refreshing: false,
      searchText: '',
      searchedItem: '',
      filterPosts: [],
      key: false,
    };
  }
  async viewPosts() {
    let {user} = this.props;
    user = user?.user?.user;
    const {key} = this.state;
    try {
      return await camelapp
        .post('/get/news', {
          user_id: user?.id,
        })
        .then(res => {
          this.setState({
            posts: res.data.news,
            loader: false,
            // key: !key,
          });
        });
    } catch (error) {
      //console.log("Error Message News List", error);
    }
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  // =============NEW Updated Search Handler==============
  searchHandler = value => {
    if (!value?.length) {
      this.setState({filterPosts: this.state.posts});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = this.state.posts.filter(item => {
        const {title, user, description} = item;
        return (
          title?.toLowerCase().includes(value.toLowerCase()) ||
          user?.name?.toLowerCase().includes(value.toLowerCase()) ||
          user?.user_name?.toLowerCase().includes(value.toLowerCase()) ||
          description?.toLowerCase().includes(value.toLowerCase())
        );
      });
      if (filteredData?.length > 0) {
        this.setState({filterPosts: filteredData});
      } else {
        this.setState({filterPosts: []});
      }
    }
  };
  search(text) {
    this.setState({searchText: text});
  }
  componentDidMount = () => {
    this.viewPosts();
  };
  // componentWillUnmount() {
  //   // Remove the 'focus' event listener when the component unmounts to prevent memory leaks.
  //   this.focusListener.remove();
  // }
  render() {
    const {posts, filterPosts, searchedItem, key} = this.state;
    const onItemClick = item => {
      try {
        this.props.navigation.navigate('ViewNews', {newsItem: item});
      } catch (error) {
        //console.log("news item", error)
      }
    };
    const renderItem = ({item}) => {
      return (
        <NewsPost
          item={item}
          titleOfArticle={item?.title}
          date={item?.date}
          userName={item?.user?.name}
          userProfile={item?.user?.image}
          image={item?.image}
          rating_count={item?.rating_count}
          rating={item?.rating}
          onItemClick={() => onItemClick(item)}
        />
      );
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
          onPressSearch={() => this.searchHandler(this.state.searchText)}
        />
        <ActivityIndicator
          size="large"
          color="#D2691Eff"
          animating={this.state.loader}
        />

        {this.state.loader == false && (
          <View>
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 20,
                marginBottom: 20,
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
                <Text style={Styles.catBtnText}>{ArabicText?.news}</Text>
              </TouchableOpacity>
            </View>
            {/* <Ads /> */}
            <FlatList
              contentContainerStyle={{paddingBottom: width * 0.3}}
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item?.id}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
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
export default connect(mapStateToProps, mapDispatchToProps)(News);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
