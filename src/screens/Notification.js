import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Post = ({description, date}) => (
  <View
    style={{
      width: width,
      height: 80,
      marginBottom: 5,
      backgroundColor: '#f3f3f3',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
    }}>
    <View
      style={{
        width: width - 60,
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '70%',
        alignSelf: 'center',
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'right',
          justifyContent: 'center',
        }}>
        {description}
        {}
      </Text>
      <Text style={{color: 'black', fontSize: 12, width: width - 100}}>
        {date}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: 50,
          alignSelf: 'flex-end',
          justifyContent: 'flex-end',
        }}></View>
    </View>
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 6,
        borderColor: 'grey',
        marginLeft: 4,
      }}>
      <MaterialIcons name="notifications-none" size={20} color="#D2691E" />
    </View>
  </View>
);

class CamelClubList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
    };
  }

  componentDidMount() {
    this.checkUserLogedIn();
  }
  checkUserLogedIn() {
    let {user} = this.props;
    // //console.log("user", this.props.user.user.user.id)
    if (user.user.user != undefined) {
      this.viewPosts();
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  async viewPosts() {
    let {user} = this.props;
    user = user.user.user.id;
    await camelapp
      .get('/notification/' + user)
      .then(res => {
      
        this.setState({
          posts: res?.data?.notification,
          loader: false,
        });
      })
      .catch(error => {
        console.log('Error notification  List----', error);
        this.setState({
          loader: false,
        });
      });
  }

  render() {
    const renderItem = ({item}) => {
      let d = new Date(item.created_at);
      //console.log("d", d.toLocaleString())

      return (
        <Post
          item={item}
          description={item.description}
          date={d.toLocaleString()}
        />
      );
    };

    return (
      <View style={styles.container}>
        {this.state.loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={this.state.loader}
            style={{marginTop: 20}}
          />
        )}

        {this.state.loader == false && (
          <FlatList
            ListEmptyComponent={() => {
              return (
                <View style={{alignSelf: 'center', marginVertical: 150}}>
                  <Text style={{color: 'black', alignSelf: 'center'}}>
                    No Notification Found
                  </Text>
                </View>
              );
            }}
            data={this.state.posts}
            contentContainerStyle={{paddingBottom: '10%'}}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
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

export default connect(mapStateToProps, mapDispatchToProps)(CamelClubList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
