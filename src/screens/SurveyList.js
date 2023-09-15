import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
import {Styles} from '../styles/globlestyle';
import {Card} from 'react-native-paper';
import {Dimensions} from 'react-native';
import Header from '../components/Header';
const width = Dimensions.get('screen').width;
class SurveyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loader: true,
      isRefreshing: false,
      searchText: '',
      searchedItem: '',
      filterPosts: [],
    };
    this.viewPosts();
  }

  async viewPosts() {
    await camelapp
      .post('/get/survey')
      .then(response => {
        console.log('response-->', response.status);
        if (response?.status == 200) {
          this.setState({
            posts: response.data.survey,
            loader: false,
          });
        }
      })
      .catch(error => {
        //console.log("Error Message camel club List----", error);
      });
  }
  onItemClick = async item => {
    // this.viewPosts();
    let {user} = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      console.log(
        item?.survey_details[0]?.survey_id,
        'item?.survey_details',
        user?.id,
      );
      let tempString = item?.survey_details;
      await camelapp
        .post('/check/survey/by/user_id', {
          user_id: user?.id,
          survey_id: item?.survey_details[0]?.survey_id,
        })
        .then(response => {
          console.log('response', response?.data);
          this.props.navigation.navigate('Survey', {
            surveyId: item,
            arrayAnswers: tempString,
            status: response?.data?.status,
          });
        })
        .catch(error => {
          //console.log("Error Message camel club List----", error);
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  searchHandler = value => {
    if (!value?.length) {
      this.setState({filterPosts: this.state.posts});
    } else {
      this.setState({searchedItem: value});
      // Data Filtration
      const filteredData = this.state.posts.filter(item => {
        const {title} = item;
        return title?.toLowerCase().includes(value.toLowerCase());
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
    const {posts, filterPosts, searchedItem} = this.state;
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          question={item?.title}
          start_date={item?.start_date}
          end_date={item.end_date}
          onItemClick={() => this.onItemClick(item)}
          image={item?.image}
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
              this.setState({searchedItem: ''});
            }
          }}
          onPressSearch={() => this.searchHandler(this.state.searchText)}
        />

        {this.state.loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={this.state.loader}
            style={{marginTop: 20}}
          />
        )}

        {this.state.loader == false && (
          <View>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              // inverted={true}
              contentContainerStyle={{
                marginTop: 20,
                width: width,
                alignSelf: 'center',
                paddingBottom: '8%',
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

export default connect(mapStateToProps, mapDispatchToProps)(SurveyList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
  },
});

const Item = ({
  name,
  start_date,
  end_date,
  rules,
  procedures,
  onItemClick,
  question,
  image,
}) => (
  <Card>
    <TouchableOpacity onPress={onItemClick}>
      <View
        style={[
          Styles.newsbox1,
          {
            flexDirection: 'row-reverse',
            justifyContent: 'flex-end',
            height: 80,
          },
        ]}>
        <View
          style={{
            position: 'absolute',
            left: 20,
            backgroundColor: '#fff',
            borderRadius: 30,
            borderColor: '#d2691e',
            borderWidth: 1,
          }}>
          <Image
            source={require('../../assets/group-survey.png')}
            // source={{ uri: "http://www.tasdeertech.com/images/survey/" + image }}
            style={{
              height: 60,
              width: 60,
            }}
            resizeMode="cover"></Image>
        </View>

        <Text
          numberOfLines={2}
          style={{
            width: width - 120,
            textAlign: 'right',
            fontWeight: '500',
            fontSize: 16,
            color: 'black',
          }}>
          {question}
        </Text>
      </View>
    </TouchableOpacity>
  </Card>
);
