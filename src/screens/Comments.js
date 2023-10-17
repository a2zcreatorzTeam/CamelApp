import React, {Component, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  LogBox,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import camelapp from '../api/camelapp';
import Loader from '../components/PleaseWait';
import {Card} from 'react-native-paper';
import * as ArabicText from '../language/EnglishToArabic';
import Header from '../components/Header';
import Item from '../components/commentItem';
const {width} = Dimensions.get('screen');
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsList: [],
      user: this.props.route.params.user,
      post: this.props.route.params.post,
      newComment: '',
      newReply: '',
      commentId: '',
      flagForNewComment: true,
      flagForReplyComment: false,
      loader: true,
      loading: false,
      isRefreshing: false,
      searchText: '',
      searchedItem: '',
      dataNotFound: false,
      filterPosts: [],
      user_id: this.props.route.params.user?.user_id
        ? this.props.route.params.user?.user_id
        : this.props.route.params.user?.id,
    };
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state.',
    ]);
  }
  componentDidMount() {
    this.getCommentsOnPost();
  }
  addReplyToComment = () => {
    if (this.state.newReply != '') {
      camelapp
        .post('/add/reply', {
          user_id: this.state.user_id,
          comment_id: this.state.commentId,
          reply: this.state.newReply,
        })
        .then(response => {
          this.setState({
            flagForNewComment: true,
            flagForReplyComment: false,
            newReply: '',
          });
          this.getCommentsOnPost();
        })
        .catch(error => {
          clearInterval(this.interval);
        });
    }
  };
  onCommentsClick = item => {
    this.setState({
      commentId: item.id,
      flagForNewComment: false,
      flagForReplyComment: true,
    });
  };
  onLikesClick = (item, setIsLiked, setLikeCount) => {
    this.setState({loading: true});
    let user = this.state.user;
    let post_id = this.props.route.params.post.id;
    if (user != undefined) {
      camelapp
        .post('/comment/like', {
          user_id: user?.id,
          comment_id: item.id,
        })
        .then(response => {
          if (response.data.message == 'Successfully liked') {
            setIsLiked(true);
            setLikeCount(response?.data?.total_likes);
            this.setState({loading: false});
          }
          if (response.data.message == 'Successfully Unliked') {
            setIsLiked(false);
            setLikeCount(response?.data?.total_likes);
            this.setState({loading: false});
          }
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  getCommentsOnPost = async () => {
    let {user} = this.props?.route.params;
    const {searchedItem, dataNotFound} = this.state;
    await camelapp
      .post('/get/comment', {
        post_id: this.props.route.params?.post?.id,
        user_id: user?.id,
      })
      .then(res => {
        this.setState({
          commentsList: res?.data,
          loader: false,
          dataNotFound: !dataNotFound,
        });
        searchedItem && this.searchHandler(searchedItem);
      });
  };
  onRefresh = () => {
    this.getCommentsOnPost();
  };
  addNewComment = async () => {
    if (this.state.newComment != '') {
      this.setState({loading: true});
      camelapp
        .post('/add/comment', {
          user_id: this.state.user_id,
          post_id: this.state.post.id,
          comment: this.state.newComment,
        })
        .then(response => {
          if (response?.data) {
            this.getCommentsOnPost();
            this.setState({
              flagForNewComment: true,
              flagForReplyComment: false,
              newComment: '',
              loading: false,
            });
          }
        })
        .catch(error => {
          this.setState({
            flagForNewComment: true,
            flagForReplyComment: false,
            newComment: '',
            loading: false,
          });

          console.log('error', error);
        });
    }
  };
  searchHandler = value => {
    const {dataNotFound} = this.state;
    if (!value) {
      this.setState({filterPosts: this.state.commentsList, searchedItem: ''});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = this.state?.commentsList?.filter(item => {
        const {comment} = item;
        return comment?.toLowerCase().includes(value.toLowerCase());
      });
      if (filteredData?.length > 0) {
        this.setState({filterPosts: filteredData, dataNotFound: !dataNotFound});
      } else {
        this.setState({filterPosts: [], dataNotFound: !dataNotFound});
      }
    }
  };
  search(text) {
    this.setState({searchText: text});
  }
  render() {
    const renderItem = ({item}) => {
      return (
        <Item
          Reply={item => {
            this.setState({
              flagForReplyComment: true,
              flagForNewComment: false,
              commentId: item?.id,
            });
          }}
          item={item}
          date={item?.created_at?.slice(0, 9)}
          comment={item.comment}
          userImage={item.image}
          userName={item.name}
          time={item?.created_at}
          commentsCount={item.total_likes}
          onCommentsClick={() => this.onCommentsClick(item)}
          onLikesClick={(setIsLiked, setLikeCount) =>
            this.onLikesClick(item, setIsLiked, setLikeCount)
          }
        />
      );
    };
    const {
      dataNotFound,
      loader,
      searchText,
      commentsList,
      filterPosts,
      searchedItem,
      newComment,
    } = this.state;
    return (
      <SafeAreaView style={Styles.containerComments}>
        {loader == true && (
          <>
            <Header
              onChangeText={text => {
                if (text) {
                  this.search(text);
                }
              }}
              onPressSearch={() => this.searchFunction(searchText)}
            />
            <ActivityIndicator
              size="large"
              color="#D2691Eff"
              animating={loader}
              style={styles.activityIndicator}
            />
          </>
        )}

        {loader == false && (
          <Header
            onChangeText={text => {
              if (text) {
                this.search(text);
              } else {
                this.setState({searchedItem: '', searchText: ''});
              }
            }}
            onPressSearch={() => this?.searchHandler(this.state.searchText)}
          />
        )}

        {this.state.commentsList?.length && loader == false ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            extraData={commentsList}
            key={dataNotFound}
            refreshControl={
              <RefreshControl
                onRefresh={() => this.onRefresh()}
                refreshing={this?.state?.isRefreshing}
              />
            }
            data={searchedItem ? filterPosts : commentsList}
            renderItem={item => renderItem(item)}
            keyExtractor={item => item?.id}
          />
        ) : (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'black', alignSelf: 'center'}}>
              No Comment Found
            </Text>
          </View>
        )}

        <Loader loading={this.state.loading} />

        {this?.state?.flagForNewComment && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginTop: 'auto',
            }}>
            <TouchableOpacity
              style={{
                transform: [{rotate: '215deg'}],
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginLeft: 5,
              }}
              onPress={() => this.addNewComment()}>
              <Feather name="send" size={30} color="#CD853F" />
            </TouchableOpacity>
            <TextInput
              style={Styles.forminputs}
              onChangeText={text => {
                this.setState({newComment: text}),
                  console.log(text?.length, 'textttttttt', newComment?.length);
              }}
              placeholder={ArabicText.comments}
              placeholderTextColor="#b0b0b0"
              value={this.state?.newComment}></TextInput>
          </View>
        )}
        {this.state.flagForReplyComment && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              style={{transform: [{rotate: '180deg'}]}}
              onPress={() => this.addReplyToComment()}>
              <Ionicons name="send" size={24} color="#D2691E" />
            </TouchableOpacity>

            <TextInput
              style={Styles.forminputs}
              onChangeText={text => this.setState({newReply: text})}
              placeholder={ArabicText.Reply}
              placeholderTextColor="#b0b0b0"
              value={this?.state?.newReply}></TextInput>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: '#eee',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
export default Comments;
