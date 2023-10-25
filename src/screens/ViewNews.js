import React, {Component, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HTML from 'react-native-render-html';
import {Dimensions, LogBox} from 'react-native';
import * as ArabicText from '../language/EnglishToArabic';
const width = Dimensions.get('screen').width;
import {Rating} from 'react-native-ratings';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import camelapp from '../api/camelapp';
import moment from 'moment';
import BackBtnHeader from '../components/headerWithBackBtn';
import Loader from '../components/PleaseWait';
import Toast from 'react-native-toast-message';

class ViewNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      commentList: [],
      newComment: '',
      like: [],
      like_count: [],
      loading: false,
      key: false,
      rated: props?.route?.params?.newsItem?.flagForRating,
    };
  }

  getComments = async () => {
    const {key} = this.state;
    const newsdata = this.props.route.params.newsItem;
    let {user} = this.props;
    user = user?.user?.user;
    await camelapp
      .post('/get/news_comments_like', {
        news_id: newsdata?.id,
        user_id: user?.id,
      })
      .then(res => {
        console.log(res, 'responseeee');
        this.setState({
          commentList: res?.data,
          loader: false,
          key: !key,
        });
      })
      .catch(err => {
        console.log(err, 'errorrrrr711');
      });
  };
  rating = rating => {
    const newsdata = this.props.route.params.newsItem;
    this.setState({loading: true});
    let {user} = this.props;
    user = user.user.user;
    if (user != undefined) {
      camelapp
        .post('/add/rating', {
          user_id: user?.id,
          rating: rating,
          news_id: newsdata?.id,
        })
        .then(response => {
          if (response) {
            Toast.show({
              text1: response?.data?.message,
              type: 'success',
              visibilityTime: 3000,
            });
            this.setState({rated: true});
            // alert(response?.data?.message);
          }
          // if (response.data.status == true) {
          //   alert('Rating added Successfully');
          // } else {
          //   alert('You have already added the rating');
          // }
        });
    }
    this.setState({loading: false});
  };
  newComment() {
    const newsdata = this.props.route.params.newsItem;
    let {user} = this.props;
    user = user.user.user;
    if (user != undefined) {
      if (this.state.newComment != '') {
        camelapp
          .post('/add/news/comment', {
            user_id: user.id,
            news_id: newsdata?.id,
            comment: this.state.newComment,
          })
          .then(res => {
            // Toast.show({
            //   text1: ArabicText.Comment_Added + '',
            //   type: 'success',
            //   visibilityTime: 3000,
            // });
            // alert(ArabicText.Comment_Added + '');
            this.setState({newComment: ''});
            this.getComments();
          });
      } else {
        return Toast.show({
          text1: ArabicText.Please_complete_the_fields + '',
          type: 'error',
          visibilityTime: 3000,
        });
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  componentDidMount() {
    this.getComments();
  }
  render() {
    const {key, rated} = this.state;
    const newsdata = this.props.route.params.newsItem;
    let {user} = this.props;
    user = user?.user?.user;
    const likeCommentHandler = async (item, setIsLiked, setLikeCount) => {
      this.setState({loading: false});
      let {user} = this.props;
      user = user.user.user;
      if (user != undefined) {
        await camelapp
          .post('/news-comment-like', {
            news_comment_id: item?.news_comments_id,
            user_id: user?.id,
          })
          .then(response => {
            if (response.data.message == 'Successfully liked') {
              setIsLiked(true);
              setLikeCount(response?.data?.total_likes);
            }
            if (response.data.message == 'Successfully Unliked') {
              setIsLiked(false);
              setLikeCount(response?.data?.total_likes);
            }
          })
          .catch(error => {
            console.log('error', error);
            this.setState({loading: false});
          });
      } else {
        this.props.navigation.navigate('Login');
      }
      // if (item?.user?.name !== undefined) {
      //   camelapp
      //     .post('/news-comment-like', {
      //       news_comment_id: item?.id,
      //       user_id: item?.user_id,
      //     })
      //     .then(res => {
      //       const likeStatus =
      //         res?.data?.message == 'Successfully liked' ? true : false;

      //       // {"message": "Successfully Unliked", "status": true}
      //       if (likeStatus == true) {
      //         commentList[indexOfItem].comment_like_count =
      //           commentList[indexOfItem]?.comment_like_count + 1;
      //         commentList[indexOfItem].flagForLike = true;

      //         this.setState({
      //           like: item.id,
      //           userID: item.user_id,
      //           commentList: commentList,
      //         });

      //         alert(res?.data?.message);
      //       } else {
      //         commentList[indexOfItem].comment_like_count =
      //           commentList[indexOfItem]?.comment_like_count - 1;
      //         commentList[indexOfItem].flagForLike = false;

      //         this.setState({
      //           like: item.id,
      //           userID: item.user_id,
      //           commentList: commentList,
      //         });

      //         alert(res?.data?.message);
      //       }
      //       // if (likeStatus === true) {

      //       //     alert("liked")

      //       // }

      //       // if (likeStatus === false) {

      //       //     commentList[indexOfItem].comment_like_count = commentList[indexOfItem]?.comment_like_count - 1;
      //       //     commentList[indexOfItem].flagForLike = false;
      //       //     this.setState({ like: item.id, userID: item.user_id, commentList: commentList })

      //       //     this.setState({ userID: item.id })

      //       // }
      //     })
      //     .catch(err => {
      //       console.log(err, '====ERR');
      //     });
      // }
    };
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          image={item?.user_image}
          name={item?.user_name}
          comments={item?.comment}
          date={item?.created_at}
          likeCommentHandler={(setIsLiked, setLikeCount) => {
            likeCommentHandler(item, setIsLiked, setLikeCount);
          }}
          likesCount={item?.comment_like_count}
        />
      );
    };
    const source = {
      html: `<p>${newsdata?.description}</p>`,
    };
    const tagsStyles = {
      body: {
        color: 'black',
        alignItems: 'center',
        textAlign: 'right',
        width: '95%',
      },
    };
    return (
      <View style={Styles.container}>
        <Loader loading={this.state.loading} />
        <BackBtnHeader />
        <ScrollView style={{alignSelf: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <View>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 17}}>
                {newsdata?.user?.name}
              </Text>
              <Text style={{color: 'grey', fontSize: 10}}>
                {newsdata?.date}
              </Text>
            </View>
            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/public/images/profiles/' +
                  newsdata?.user?.image,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View>
          <Text
            style={{
              margin: 10,
              fontWeight: '700',
              color: 'black',
              fontSize: 24,
            }}>
            {newsdata?.title}
          </Text>
          <Image
            source={{
              uri:
                'http://www.tasdeertech.com/public/images/news/' +
                newsdata?.image,
            }}
            style={Styles.image}
            resizeMode="cover"></Image>
          <View style={{padding: 10}}>
            <HTML
              tagsStyles={tagsStyles}
              source={source}
              contentWidth={width}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            {user != undefined && rated == false && (
              <Rating
                onFinishRating={rating => this.rating(rating)}
                ratingCount={5}
                startingValue={this.state.rating}
                imageSize={20}
                style={{paddingVertical: 10}}
                ratingColor={'crimson'}
                type="custom"
                ratingBackgroundColor={'black'}
              />
            )}

            {/* tintColor="white" */}
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 10,
              color: 'black',
            }}>
            <Text style={{color: 'black'}}>{ArabicText?.comments}</Text>
          </View>
          <FlatList
            key={key}
            style={{flex: 1}}
            // inverted
            data={this.state.commentList}
            renderItem={renderItem}
            // initialNumToRender={5}
            // maxToRenderPerBatch={5}
          />
        </ScrollView>

        <View style={Styles.msgbar}>
          <TouchableOpacity
            style={{transform: [{rotate: '180deg'}]}}
            onPress={() => {
              this.newComment();
            }}>
            <Ionicons name="send" size={24} color="#D2691E" />
          </TouchableOpacity>
          <TextInput
            value={this.state.newComment}
            style={Styles.inputNews}
            placeholderTextColor="#b0b0b0"
            onChangeText={text => this.setState({newComment: text})}
            placeholder={ArabicText.comments}></TextInput>
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewNews);
const Item = ({
  item,
  name,
  image,
  comments,
  date,
  likeCommentHandler = () => {},
  likesCount,
}) => {
  const [isLiked, setIsLiked] = useState(item?.flagForLike);
  const [likeCount, setLikeCount] = useState(likesCount);
  return (
    <Card
      style={{
        margintop: 5,
        marginBottom: 5,
        height: 70,
        backgroundColor: '#f3f3f3',
      }}>
      <View>
        {/* LIKE COMMENT>>>>>>> */}
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            top: 5,
            left: 8,
          }}>
          <TouchableOpacity
            onPress={() => likeCommentHandler(setIsLiked, setLikeCount)}
            style={{width: 40}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AntDesign
                name={isLiked == true ? 'heart' : 'hearto'}
                size={16}
                color="#CD853F"
              />
              <Text
                style={{
                  fontSize: 16,
                  paddingLeft: 5,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  color: 'black',
                }}>
                {likeCount}
              </Text>
            </View>
          </TouchableOpacity>

          {/* <Text style={{ color: 'black', fontSize: 15, right: -7 }}>
                        12   {likes}
                    </Text> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
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
                fontSize: 16,
                paddingRight: 5,
                fontWeight: 'bold',
                textAlign: 'right',
                color: 'black',
              }}>
              {name}
            </Text>
            <Text style={{fontSize: 10, textAlign: 'right', color: 'grey'}}>
              {moment(date).format('YYYY-MM-DD')}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'center',
              right: 60,
              top: 40,
              position: 'absolute',
              marginBottom: 10,
            }}>
            <Text
              numberOfLines={4}
              style={{
                flex: 1,
                fontSize: 14,
                paddingRight: 5,
                textAlign: 'right',
                color: 'black',
              }}>
              {comments}
            </Text>
          </View>
          <View style={Styles.user_HomeComment}>
            <Image
              source={{
                uri: 'http://www.tasdeertech.com/images/profiles/' + image,
              }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 30,
              }}></Image>
          </View>
        </View>
      </View>
    </Card>
  );
};
