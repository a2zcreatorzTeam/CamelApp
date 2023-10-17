import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import {withdrawBid} from '../context/DataContext';
import * as ArabicText from '../language/EnglishToArabic';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import camelapp from '../api/camelapp';
import EmptyComponent from './EmptyComponent';

import {Dimensions} from 'react-native';
import {RefreshControl} from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
class Bids extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      refreshing: false,
      key: false,
    };
  }
  async viewPosts() {
    try {
      let {user} = this.props;
      const {key} = this.state;
      return await camelapp
        .post('/get/bids', {
          user_id: user.user.user.id,
        })
        .then(res => {
          this.setState({
            posts: res?.data?.bids,
            key: !key,
          });
        });
    } catch (error) {
      Toast.show({
        text1: ArabicText?.Noonehasparticipatedyet,
        type: 'error',
        visibilityTime: 3000,
      });
    }
  }
  componentDidMount() {
    this.viewPosts();
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({refreshing: false});
  }
  onViewPostClick(item) {
    if (item.post.category_id == '1') {
      this.props.navigation.navigate('CamelClubDetailsComponent', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '4') {
      this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '3') {
      this.props.navigation.navigate('DetailsMissingAndTreatingCamel', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '2') {
      this.props.navigation.navigate('DetailsSellingCamel', {
        itemFromDetails: item?.posts[0],
        bid: true,
      });
    }
    if (item.post.category_id == '6') {
      this.props.navigation.navigate('DetailsComponentWithPrice', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '8') {
      this.props.navigation.navigate('DetailsComponentWithPrice', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '5') {
      this.props.navigation.navigate('DetailsMovingCamel', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '9') {
      this.props.navigation.navigate('DetailsMarketingCamel', {
        itemFromDetails: item?.posts[0],
      });
    }
    if (item.post.category_id == '11') {
      this.props.navigation.navigate('DetailsFemaleCamel', {
        itemFromDetails: item?.posts[0],
      });
    }
  }
  onWithdrawBid(item) {
    withdrawBid(item?.id).then(res => {
      if (res?.status == 'Successfully Delete') {
        this.viewPosts();
        Toast.show({
          text1: ArabicText?.Bidsuccessfullywithdrawn,
          type: 'success',
          visibilityTime: 3000,
        });
        // alert('Bid successfully withdrawn!');
      } else {
        Toast.show({
          text1: ArabicText?.Errorinwithdrawingbid,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Error in withdrawing bid!');
      }
    });
  }
  render() {
    const {key} = this.state;
    const BidsItem = ({
      item,
      userName,
      userImage,
      bidPrice,
      onViewPost,
      onWithdrawBid,
    }) => (
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-around',
          width: width,
          backgroundColor: '#eee',
          height: 100,
          alignContent: 'center',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <FastImage
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignSelf: 'center',
          }}
          source={{
            uri: 'https:www.tasdeertech.com/images/profiles/' + userImage,
          }}
          resizeMode={FastImage?.resizeMode.cover}
        />

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
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
          {/* {item?.bit_closed == 1 ? (
            <TouchableOpacity
              activeOpacity={0.99}
              style={Styles.bidsButtonAccept}
              onPress={() => {}}>
              <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
                {ArabicText?.bidClosed}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={Styles.bidsButtonAccept}
              onPress={onWithdrawBid}>
              <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
                {ArabicText?.WithDraw}
              </Text>
            </TouchableOpacity>
          )} */}

          <TouchableOpacity
            style={Styles.bidsButtonAccept}
            onPress={onViewPost}>
            <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
              {ArabicText?.View_Post}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    const renderBidItem = item => {
      return (
        <BidsItem
          item={item}
          userName={item?.item?.user?.name}
          userImage={item?.item?.user?.image}
          bidPrice={item?.item.price}
          onViewPost={() => this.onViewPostClick(item?.item)}
          onWithdrawBid={() => this.onWithdrawBid(item?.item)}
        />
      );
    };
    return (
      <View style={Styles.containerBids}>
        <FlatList
          ListEmptyComponent={() => <EmptyComponent />}
          key={key}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.ScrollToRefresh()}
            />
          }
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: width * 0.5}}
          data={this.state?.posts}
          renderItem={renderBidItem}
        />
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
