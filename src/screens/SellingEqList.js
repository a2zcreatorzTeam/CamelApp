import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Card} from 'react-native-paper';
import {DataContext, likePost} from '../context/DataContext';
import * as ArabicText from '../language/EnglishToArabic';
import EmptyComponent from '../components/EmptyComponent';
import {imageBaseUrl, profileBaseUrl} from '../constants/urls';
import {family} from '../constants/Family';

const Item = ({
  userName,
  userCity,
  image,
  likes,
  comments,
  shares,
  views,
  userImage,
  onCommentsClick,
  onLikesClick,
  category,
  price,
}) => (
  <Card>
    <View style={Styles.homesec}>
      <View style={{left: 5, position: 'absolute'}}>
        <View style={Styles.btnHome2}>
          <Text
            style={{
              color: '#D2691Eff',
              fontFamily: family.Neo_Regular,
            }}>
            {category}
          </Text>
        </View>
      </View>
      <View style={Styles.user_detail}>
        <Text
          style={{
            fontSize: 18,
            paddingRight: 5,
            fontFamily: family.Neo_Regular,
          }}>
          {userName}
        </Text>
        <Text
          style={{
            fontSize: 15,
            paddingRight: 5,
            fontFamily: family.Neo_Regular,
          }}>
          {userCity}
        </Text>
      </View>
      <View style={Styles.user_Home}>
        {/* <FontAwesome name="user-o" lineBreakMode='middle' size={24} color="#D2691Eff" /> */}
        <Image
          source={{
            uri:
              // "https://tasdeertech.com/public/images/posts/profile4ffce04d92a4d6cb21c1494cdfcd6dc1913.jpeg"
              profileBaseUrl + userImage,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
          }}
        />
      </View>
    </View>
    <Card.Cover
      // source={require('../../assets/camel.png')}
      source={{uri: imageBaseUrl + image}}
      resizeMode="cover"
      style={Styles.image}
    />
    <View style={Styles.pricetag}>
      <Text
        style={{
          color: '#ffffff',
          fontFamily: family.Neo_Regular,
        }}>
        {ArabicText.Price}
      </Text>
      <Text
        style={{
          color: '#FFFFFF',
          fontFamily: family.Neo_Regular,
        }}>
        {price}
      </Text>
    </View>

    <Card.Actions style={Styles.posticon}>
      <Text
        style={{
          right: 155,
          position: 'absolute',
          fontFamily: family.Neo_Regular,
        }}>
        {views}
      </Text>
      <View style={{right: 133, position: 'absolute'}}>
        <Ionicons name="ios-eye-sharp" size={18} color="#cd853f" />
      </View>
      <Text
        style={{
          right: 120,
          position: 'absolute',
          fontFamily: family.Neo_Regular,
        }}>
        {shares}
      </Text>
      <TouchableOpacity style={{right: 98, position: 'absolute'}}>
        <Ionicons name="share-social-sharp" size={18} color="#cd853f" />
      </TouchableOpacity>
      <Text
        style={{
          right: 85,
          position: 'absolute',
          fontFamily: family.Neo_Regular,
        }}>
        {comments}
      </Text>
      <TouchableOpacity
        style={{right: 60, position: 'absolute'}}
        onPress={onCommentsClick}>
        <Feather name="message-square" size={18} color="#cd853f" />
      </TouchableOpacity>
      <Text
        style={{
          right: 45,
          position: 'absolute',
          fontFamily: family.Neo_Regular,
        }}>
        {likes}
      </Text>
      <TouchableOpacity
        style={{right: 20, position: 'absolute'}}
        onPress={onLikesClick}>
        <AntDesign name="hearto" size={18} color="#cd853f" />
      </TouchableOpacity>
    </Card.Actions>
  </Card>
);

const Home = props => {
  const onCommentsClick = item => {
    //console.log("Post", item)
  };

  const onLikesClick = item => {
    this.setState({loading: true});
    let {user} = this.props;
    user = user?.user?.user;
    let post_id = item.id;
    if (user != undefined) {
      camelapp
        .post('/add/like', {
          user_id: user.id,
          post_id: post_id,
          type: 'abc',
        })
        .then(response => {
          console.log('response.data', response.data);
          // if (response.data.status == true) {
          //   let filterPosts = this.state.filterPosts;

          //   let tempIndex = filterPosts.indexOf(item);

          //   let like_count = item.like_count + 1;
          //   let tempItem = item;
          //   tempItem['like_count'] = like_count;
          //   filterPosts[tempIndex] = tempItem;

          //   this.setState({loading: false, filterPosts: filterPosts});
          //   alert(ArabicText.Succesfully_liked);
          // }
          // if (response.data.status == false) {
          //   let filterPosts = this.state.filterPosts;

          //   let tempIndex = filterPosts.indexOf(item);

          //   let like_count = item.like_count - 1;
          //   let tempItem = item;
          //   tempItem['like_count'] = like_count;
          //   filterPosts[tempIndex] = tempItem;

          //   this.setState({loading: false, filterPosts: filterPosts});
          //   alert(ArabicText.Successfully_Unliked);
          // }
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
        image={item.image}
        likes={item.like_count}
        comments={item.comment_count}
        shares={item.share_count}
        views={item.view_count}
        userName={item.user_name}
        userCity={item.location}
        userImage={item.user_images}
        onCommentsClick={() => onCommentsClick(item)}
        category="equipment"
        price={item.price}
        onLikesClick={(item, setIsLiked, setLikeCount) =>
          onLikesClick(item, setIsLiked, setLikeCount)
        }
      />
    );
  };
  return (
    <DataContext.Consumer>
      {context => (
        <SafeAreaView>
          <FlatList
            ListEmptyComponent={() => <EmptyComponent />}
            data={context.data.camelEquipmentList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
          />
        </SafeAreaView>
      )}
    </DataContext.Consumer>
  );
};

export default Home;
