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
  RefreshControl
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import camelapp from '../api/camelapp';
import Loader from '../components/PleaseWait';
import {Card} from 'react-native-paper';
import {
  likeComment,
  DataContext,
  commentReply,
  addnewComment,
} from '../context/DataContext';
import * as ArabicText from '../language/EnglishToArabic';
import {set} from 'react-native-reanimated';
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
      isRefreshing:false

    };
    this.getCommentsOnPost();

    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state.',
    ]);
  }
  componentDidMount() {
    // this.interval =
    //     setInterval(() => {
    //         this.getCommentsOnPost();
    //     }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addReplyToComment = () => {
    //console.log("comment id", this.state.commentId)
    if (this.state.newReply != '') {
      camelapp
        .post('/add/reply', {
          user_id: this.state.user.id,
          comment_id: this.state.commentId,
          reply: this.state.newReply,
        })
        .then(response => {
          //console.log("response", response.data);
          this.setState({
            flagForNewComment: true,
            flagForReplyComment: false,
          });
          this.getCommentsOnPost();
        })
        .catch(error => {
          clearInterval(this.interval);
        });
    }
  };
  onCommentsClick = item => {
    //console.log("item at reply comment", item.id);

    this.setState({
      commentId: item.id,
      flagForNewComment: false,
      flagForReplyComment: true,
    });

    //console.log("comment id", this.state.commentId)
  };

  onLikesClick = item => {
    this.setState({loading: true});
    let user = this.state.user;
    let post_id = this.props.route.params.post.id;
    if (user != undefined) {
      camelapp
        .post('/comment/like', {
          user_id: user.id,
          comment_id: item.id,
        })
        .then(response => {
          console.log('response.data', response.data);
          if (response.data.status == true) {
            this.setState({loading: false});
            alert(ArabicText.Succesfully_liked);
          }
          if (response.data.status == false) {
            this.setState({loading: false});
            alert(ArabicText.Successfully_Unliked);
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
    await camelapp
      .post('/get/comment', {
        post_id: this.props.route.params.post.id,
      })
      .then(res => {
        console.log('response', res.data);

        response = res.data;

        this.setState({commentsList: res.data});
      });
  };
  onRefresh = () => {
    // this.setState({isRefreshing:true})
    this.getCommentsOnPost()
    // this.setState({isRefreshing:false})
      };
  addNewComment = () => {
    if (this.state.newComment != '') {
      this.setState({loading: true});

      camelapp
        .post('/add/comment', {
          user_id: this.state.user.id,
          post_id: this.state.post.id,
          comment: this.state.newComment,
        })
        .then(response => {
          //console.log("response", response.data);

          if (response.data) {
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
  render() {
    const Item = ({
      userName,
      comment,
      userImage,
      commentsCount,
      onCommentsClick,
      onLikesClick,
      likes,
      time,
    }) => (
      <Card style={{margintop: 5, marginBottom: 5, height: 80}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                right: 60,
                top: 10,
                position: 'absolute',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  paddingRight: 5,
                  color: 'black',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}>
                {userName}
              </Text>

              <View
                style={{
                  marginVertical: 30,
                  alignItems: 'center',
                  // right: 130,
                  // top: 10,
                  // position: 'absolute',

                  marginBottom: 10,
                  flex: 1,
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    paddingRight: 5,
                    textAlign: 'right',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  {time}
                </Text>
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                right: 130,
                top: 10,
                position: 'absolute',
                marginBottom: 10,
              }}></View>
            <View
              style={{
                alignItems: 'center',
                right: 60,
                top: 35,
                position: 'absolute',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  paddingRight: 5,
                  color: 'black',
                  textAlign: 'right',
                }}>
                {comment}
              </Text>
            </View>

            <View style={Styles.user_HomeComment}>
              <Image
                source={{
                  uri:
                    'http://www.tasdeertech.com/images/profiles/' + userImage,
                }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 50 / 4,
                }}></Image>
            </View>
          </View>
        </View>
        <Card.Actions style={Styles.posticonCommentLikesSection}>
          <Text
            style={{
              left: 35,
              position: 'absolute',
              bottom: 15,
              color: 'black',
            }}>
            {commentsCount}
          </Text>

          <TouchableOpacity
            style={{left: 20, position: 'absolute', bottom: 15}}
            onPress={onLikesClick}>
            <AntDesign
              name={commentsCount > 0 ? 'heart' : 'hearto'}
              size={14}
              color={commentsCount > 0 ? 'red' : '#CD853F'}
            />
          </TouchableOpacity>
          {/* </View> */}
        </Card.Actions>
      </Card>
    );

    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          comment={item.comment}
          userImage={item.image}
          userName={item.name}
          time={item.created_at}
          commentsCount={item.total_comments_like}
          onCommentsClick={() => this.onCommentsClick(item)}
          onLikesClick={() => this.onLikesClick(item)}
        />
      );
    };

    return (
      <SafeAreaView style={Styles.containerComments}>
        <FlatList

refreshControl={
    <RefreshControl onRefresh={this.onRefresh()} refreshing={this.state.isRefreshing} />
  }
          data={this.state.commentsList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
        <Loader loading={this.state.loading} />

        {this.state.flagForNewComment && (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'space-evenly',
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
              onChangeText={text => this.setState({newComment: text})}
              placeholder={ArabicText.comments}
              placeholderTextColor="#b0b0b0"
              value={this.newComment}></TextInput>
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
              value={this?.newReply}></TextInput>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
export default Comments;
