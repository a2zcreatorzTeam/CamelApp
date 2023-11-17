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
import EmptyComponent from '../components/EmptyComponent';
import {Dimensions} from 'react-native';
const width = Dimensions.get('screen').width;
import Toast from 'react-native-toast-message';
class Bids extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };

    this.viewPosts();
  }

  async viewPosts() {
    try {
      let {user} = this.props;
      return await camelapp
        .post('/get/bids', {
          user_id: user.user.user.id,
        })
        .then(res => {
          this.setState({
            posts: res.data.bids,
          });
          //console.log("DATA POST", res.data.bids)
        });
    } catch (error) {
      //console.log("Error Message--- view post", error.response);
    }
  }
  componentDidMount() {
    this.viewPosts();
  }
  onViewPostClick(item) {
    //console.log("item", item)
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
    //console.log("bid item", item)
    withdrawBid(item.id).then(res => {
      if (res.status == 'Successfully Delete') {
        return Toast.show({
          text1: ArabicText?.Bidsuccessfullywithdrawn,
          type: 'success',
          visibilityTime: 3000,
        });
        // alert('Bid successfully withdrawn!');
      } else {
        return Toast.show({
          text1: ArabicText?.Errorinwithdrawingbid,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert('Error in withdrawing bid!');
      }
      //console.log("response", res)
    });
  }
  render() {
    const BidsItem = ({
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
        <Image
          source={{
            uri: 'https:www.tasdeertech.com/images/profiles/' + userImage,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignSelf: 'center',
          }}
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
          <TouchableOpacity
            style={Styles.bidsButtonAccept}
            onPress={onWithdrawBid}>
            <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
              {ArabicText.WithDraw}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Styles.bidsButtonAccept}
            onPress={onViewPost}>
            <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
              {ArabicText.View_Post}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    const renderBidItem = item => {
      return (
        <BidsItem
          item={item}
          userName={item.item.user.name}
          userImage={item.item.user.image}
          bidPrice={item.item.price}
          onViewPost={() => this.onViewPostClick(item.item)}
          onWithdrawBid={() => this.onWithdrawBid(item.item)}
        />
      );
    };
    return (
      <View style={Styles.containerBids}>
        <Text style={{color: '#D2691Eff', fontWeight: 'bold'}}>
          {ArabicText?.MyBids1}
        </Text>
        <FlatList
          ListEmptyComponent={() => <EmptyComponent />}
          data={this.state.posts}
          renderItem={renderBidItem}
          extraData={this.state}
          refeshing={this.state.refreshing}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
