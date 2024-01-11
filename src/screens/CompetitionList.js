import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Dimensions} from 'react-native';
import Header from '../components/Header';
import Item from '../components/CompetitionItem';
import EmptyComponent from '../components/EmptyComponent';
const width = Dimensions.get('screen').width;
class CamelClubList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      isRefreshing: false,
      searchText: '',
      searchedItem: '',
      filterPosts: [],
      key: false,
    };
  }
  async viewPosts() {
    const {key} = this.state;
    try {
      return await camelapp.get('/get/competition').then(res => {
        //console.log("res", res.data.status)
        this.setState({
          posts: res.data.status,
          loader: false,
          key: !key,
        });
      });
    } catch (error) {
      //console.log("Error Message get competition List", error);
    }
  }
  searchHandler = value => {
    if (!value?.length) {
      this.setState({filterPosts: this.state.posts});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = this.state.posts.filter(item => {
        console.log();
        const {name, procedure, rules} = item;
        return (
          name?.toLowerCase().includes(value.toLowerCase()) ||
          rules?.toLowerCase().includes(value.toLowerCase()) ||
          procedure?.toLowerCase().includes(value.toLowerCase())
        );
      });
      if (filteredData.length > 0) {
        this.setState({filterPosts: filteredData});
      } else {
        this.setState({filterPosts: []});
      }
    }
  };
  search(text) {
    this.setState({searchText: text});
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({isRefreshing: false});
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.viewPosts();
    });
  }
  componentWillUnmount() {
    this.focusListener();
  }
  render() {
    const onItemClick = async item => {
      try {
        await camelapp
          .post('get/competition_details', {
            competition_id: item?.id,
          })
          .then(res => {
            if (res) {
              console.log(res, 'response');
              let temp = res?.data;
              this.props.navigation.navigate('BeautyOfCompetition', {
                competition_item: [temp],
              });
            }
          });
      } catch (error) {
        console.log('Error Message get competition List', error?.response);
      }
    };
    const {
      posts,
      filterPosts,
      searchedItem,
      loader,
      key,
      isRefreshing,
      searchText,
    } = this.state;
    const renderItem = ({item}) => {
      console.log(item?.image);
      return (
        <Item
          item={item}
          name={item.name}
          start_date={item.start_date}
          end_date={item.end_date}
          onItemClick={() => onItemClick(item)}
          image={item.image}
          loader={loader}
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
          onPressSearch={() => this.searchHandler(searchText)}
        />

        {loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={loader}
            style={{marginTop: 20}}
          />
        )}

        {loader == false && (
          <View>
            <FlatList
              style={{flex: 1}}
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              numColumns={2}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item?.id}
              contentContainerStyle={{
                marginTop: 20,
                width: width,
                paddingBottom: '8%',
                alignItems: 'flex-end',
              }}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
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
export default connect(mapStateToProps, mapDispatchToProps)(CamelClubList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});
