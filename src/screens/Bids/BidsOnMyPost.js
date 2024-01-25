import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { Styles } from '../../styles/globlestyle';
import { withdrawBid } from '../../context/DataContext';
import * as ArabicText from '../../language/EnglishToArabic';
import { connect } from 'react-redux';
import * as userActions from '../../redux/actions/user_actions';
import { bindActionCreators } from 'redux';
import camelapp from '../../api/camelapp';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import EmptyComponent from '../../components/EmptyComponent';
import { ActivityIndicator } from 'react-native';
import { profileBaseUrl } from '../../constants/urls';
import FastImage from 'react-native-fast-image';
const width = Dimensions.get('screen').width;

class Bids extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      posts: [],
      key: false,
    };
  }
  componentDidMount() {
    this.viewPosts();
  }
  async viewPosts() {
    this.setState({ loader: true });
    try {
      const { key } = this.state;
      let { user } = this.props;
      return await camelapp
        .get(`/get/bids/${user?.user?.user?.id}`)
        .then(res => {
          this.setState({
            posts: res?.data,
            key: !key,
            loader: false,
          });
        });
    } catch (error) {
      this.setState({
        posts: [],
        loader: false,
      });
    }
  }
  onViewPostClick(item) {
    if (item.post.category_id == '1') {
      this.props.navigation.navigate('CamelClubDetailsComponent', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '4') {
      this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '3') {
      this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '2') {
      this.props.navigation.navigate('DetailsSellingCamel', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '6') {
      this.props.navigation.navigate('DetailsComponentWithPrice', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '8') {
      this.props.navigation.navigate('DetailsComponentWithPrice', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '5') {
      this.props.navigation.navigate('DetailsMovingCamel', {
        itemFromDetails: item.post,
      });
    }
    if (item.post.category_id == '9') {
      this.props.navigation.navigate('DetailsMarketingCamel', {
        itemFromDetails: item.post,
      });
    }

    if (item.post.category_id == '11') {
      this.props.navigation.navigate('DetailsFemaleCamel', {
        itemFromDetails: item.post,
      });
    }
  }
  onWithdrawBid(item) {
    withdrawBid(item?.bid_id).then(res => {
      if (res?.status == 'Successfully Delete') {
        this.viewPosts();
        Toast.show({
          text1: ArabicText?.Bidsuccessfullywithdrawn,
          type: 'success',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          text1: ArabicText?.Errorinwithdrawingbid,
          type: 'error',
          visibilityTime: 3000,
        });
      }
    });
  }
  onAcceptBid = async (item) => {
    try {
      return await camelapp
        .post(`/accept/bid/${item?.bid_id}`)
        .then(res => {
          this.viewPosts();
          Toast.show({
            text1: res?.data?.message,
            type: 'success',
            visibilityTime: 3000,
          });
        });
    } catch (error) {

    }
  }
  onProfileClick = item => {
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      if (item?.user_id == user?.id) {
        this.props.navigation.navigate('Profile', { screen: 'حسابي' });
      } else {
        this.props.navigation?.navigate('UserProfile', {
          user_id: item?.user_id,
          userProfile: item,
        });
      }
    } else {
      this.props.navigation?.navigate('UserProfile', {
        user_id: item?.user_id,
        userProfile: item,
      });
    }
  };
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({ refreshing: false });
  }
  render() {
    const { key, loader } = this.state;
    const BidsItem = ({
      item,
      userName,
      userImage,
      bidPrice,
      onViewPost,
      onWithdrawBid,
      onAcceptBid
    }) => (
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-around',
          width: width,
          backgroundColor: '#eee',
          height: 140,
          alignContent: 'center',
          marginTop: 10,
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => this.onProfileClick(item)}>
          <FastImage
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: 'center',
            }}
            source={{
              uri: profileBaseUrl + userImage,
              headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage?.resizeMode.cover}
          />
        </TouchableOpacity>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'right',
              fontWeight: 'bold',
              color: 'black',
            }}>
            {userName}
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'right',
              fontWeight: 'bold',
              color: 'black',
            }}>
            {bidPrice}
          </Text>
          <Text
            style={{
              fontSize: 16,
              // textAlign: 'right',
              fontWeight: 'bold',
              color: 'black',
              width: '99%',
              textAlign: 'center',
            }}>
            {item?.post?.title}
          </Text>
        </View>
        <View style={{}}>
          {item?.post?.bid_status == 1 || item?.post?.bid_status == 'TRUE' ? (
            <TouchableOpacity
              activeOpacity={0.99}
              style={Styles.bidsButtonAccept}
              onPress={() => { }}>
              <Text style={{ color: '#D2691Eff', fontWeight: 'bold' }}>
                {ArabicText?.bidClosed}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={Styles.bidsButtonAccept}
                onPress={onWithdrawBid}>
                <Text style={{ color: '#D2691Eff', fontWeight: 'bold' }}>
                  {ArabicText.WithDraw}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.bidsButtonAccept}
                onPress={onAcceptBid}>
                <Text style={{ color: '#D2691Eff', fontWeight: 'bold' }}>
                  {ArabicText.accept}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {/* View POst  */}
          <TouchableOpacity
            style={Styles.bidsButtonAccept}
            onPress={onViewPost}>
            <Text style={{ color: '#D2691Eff', fontWeight: 'bold' }}>
              {ArabicText.View_Post}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    const renderBidItem = ({ item }) => {
      return (
        <BidsItem
          item={item}
          userName={item?.bid_user_name}
          userImage={item?.user_image}
          bidPrice={item?.price}
          onViewPost={() => this.onViewPostClick(item)}
          onWithdrawBid={() => this.onWithdrawBid(item)}
          onAcceptBid={() => this.onAcceptBid(item)}
        />
      );
    };
    return (
      <View style={Styles.containerBids}>
        {loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={loader}
            style={{ marginTop: 20 }}
          />
        )}
        {!loader && (
          <FlatList
            ListEmptyComponent={() => <EmptyComponent />}
            key={key}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: width * 0.5, flexGrow: 1 }}
            data={this.state.posts}
            renderItem={renderBidItem}
            refeshing={this.state.refreshing}
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
const mapStateToProps = state => ({
  user: state.user,
});
const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Bids);
