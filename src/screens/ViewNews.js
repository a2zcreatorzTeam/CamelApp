/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, {Component, useState} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HTML from 'react-native-render-html';
import {bindActionCreators} from 'redux';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import camelapp from '../api/camelapp';
import BackBtnHeader from '../components/headerWithBackBtn';
import Loader from '../components/PleaseWait';
import {mainImageUrl, profileBaseUrl} from '../constants/urls';
import * as ArabicText from '../language/EnglishToArabic';
import {Styles} from '../styles/globlestyle';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;

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
    user = user?.user?.user;
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
    user = user?.user?.user;
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
    const {key} = this.state;
    const newsdata = this.props.route.params.newsItem;
    let {user} = this.props;
    user = user?.user?.user;
    const likeCommentHandler = async (item, setIsLiked, setLikeCount) => {
      console.log(item, 'itemmmmmmmm');
      this.setState({loading: false});
      let {user} = this.props;
      user = user?.user?.user;
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
            console.log('jkjkjkjkjkj');
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
      <View
        style={[
          Styles.container,
          {flex: 1, height: '100%', backgroundColor: '#D2691Eff'},
        ]}>
        <Loader loading={this.state.loading} />
        <BackBtnHeader />
        <KeyboardAvoidingView
          style={Styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{alignSelf: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginHorizontal: 10,
              }}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 17,
                    fontFamily:family.Neo_Bold,
                  }}>
                  {newsdata?.user?.name}
                </Text>
                <Text
                  style={{
                    color: 'grey',
                    fontSize: 10,
                    fontFamily:
                      family.Neo_Regular,
                  }}>
                  {newsdata?.date}
                </Text>
              </View>
              <Image
                source={{
                  uri:
                    // 'http://www.tasdeertech.com/public/images/profiles/' +
                    profileBaseUrl + newsdata?.user?.image,
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
                color: 'black',
                fontSize: 20,
                textAlign: 'right',
                fontFamily:family.Neo_Bold,
              }}>
              {newsdata?.title}
            </Text>
            <Image
              source={{
                uri: `${mainImageUrl}news/` + newsdata?.image,
              }}
              style={[Styles.image, {backgroundColor: '#D3D3D3'}]}
              resizeMode="contain"
            />
            <View style={{padding: 10}}>
              <HTML
                tagsStyles={tagsStyles}
                source={source}
                contentWidth={width}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10,
                color: 'black',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: family.Neo_Regular,
                }}>
                {ArabicText?.comments}
              </Text>
            </View>
            <FlatList
              // style={{flex: 1}}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: width * 0.1,
              }}
              keyExtractor={item => item.id}
              key={key}
              data={this.state.commentList}
              renderItem={renderItem}
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
              placeholder={ArabicText.comments}
            />
          </View>
        </KeyboardAvoidingView>
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
    <View
      style={{
        width: '100%',
        paddingVertical: 5,
        backgroundColor: '#f3f3f3',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {/* LIKE COMMENT>>>>>>> */}
      <View
        style={{
          width: '20%',
          marginLeft: 10,
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            likeCommentHandler(setIsLiked, setLikeCount);
          }}
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
                textAlign: 'right',
                color: 'black',
                fontFamily: family.Neo_Medium,
              }}>
              {likeCount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingRight: 10,
          paddingVertical: 5,
          width: '80%',
        }}>
        <View
          style={{
            width: '70%',
            overflow: 'hidden',
          }}>
          <Text
            style={{
              fontSize: 16,
              paddingRight: 5,
              textAlign: 'right',
              color: 'black',
              fontFamily: family.Neo_Regular,
            }}>
            {name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'right',
              color: 'grey',
              marginBottom: 5,
              fontFamily: family.Neo_Regular,
            }}>
            {moment(date).format('YYYY-MM-DD')}
          </Text>
          <Text
            // numberOfLines={4}
            style={{
              fontSize: 14,
              paddingRight: 5,
              textAlign: 'right',
              color: 'black',
              fontFamily: family.Neo_Regular,
            }}>
            {comments}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            right: 60,
            top: 45,
            position: 'absolute',
            marginBottom: 10,
          }}
        />
        <View style={[Styles.user_HomeComment]}>
          <Image
            source={{
              uri: profileBaseUrl + image,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
            }}
          />
        </View>
      </View>
    </View>
  );
};
