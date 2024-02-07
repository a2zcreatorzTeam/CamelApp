import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import camelapp from '../api/camelapp';
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import { bindActionCreators } from 'redux';
import { Styles } from '../styles/globlestyle';
import Header from '../components/Header';
import EmptyComponent from '../components/EmptyComponent';
import * as ArabicText from '../language/EnglishToArabic';
import { family } from '../constants/Family';
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
      key: false,
    };
    this.viewPosts();
  }

  async viewPosts() {
    let { user } = this.props;
    user = user?.user?.user;
    const { key } = this.state;
    await camelapp
      .post('/get/survey', {
        user_id: user?.id,
      })
      .then(response => {
        if (response?.status == 200) {
          this.setState({
            posts: response.data.survey,
            loader: false,
            key: !key,
          });
        }
      })
      .catch(error => {
        //console.log("Error Message camel club List----", error);
      });
  }
  onItemClick = async item => {
    let { user } = this.props;
    user = user?.user?.user;
    if (user != undefined) {
      if (item?.survey_end_status == 0) {
        let tempString = item?.survey_details;
        await camelapp
          .post('/check/survey/by/user_id', {
            user_id: user?.id,
            survey_id: item?.survey_details[0]?.survey_id,
          })
          .then(response => {
            this.props.navigation.navigate('Survey', {
              surveyId: item,
              arrayAnswers: tempString,
              status: response?.data?.status,
            });
          })
          .catch(error => {
            console.log(error, 'errorrrrr');
            Toast.show({
              text1: ArabicText?.somethingwentwrong,
              type: 'error',
              visibilityTime: 3000,
            });
            //console.log("Error Message camel club List----", error);
          });
      } else {
        Toast.show({
          text1: ArabicText?.SurveyIsInactive,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(ArabicText?.SurveyIsInactive);
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  searchHandler = value => {
    if (!value?.length) {
      this.setState({ filterPosts: this.state.posts });
    } else {
      this.setState({ searchedItem: value });
      // Data Filtration
      const filteredData = this.state.posts.filter(item => {
        const { title } = item;
        return title?.toLowerCase().includes(value.toLowerCase());
      });
      if (filteredData?.length > 0) {
        this.setState({ filterPosts: filteredData });
      } else {
        this.setState({ filterPosts: [] });
      }
    }
  };
  search(text) {
    this.setState({ searchText: text });
  }
  ScrollToRefresh() {
    this.viewPosts();
    this.setState({ isRefreshing: false });
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.viewPosts();
    });
  }
  componentWillUnmount() {
    this.focusListener();
  }
  render() {
    const { posts, filterPosts, searchedItem, key } = this.state;
    const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          question={item?.title}
          start_date={item?.start_date}
          end_date={item.end_date}
          onItemClick={() => this.onItemClick(item)}
          image={item?.image}
          todaysDate={moment().format('YYYY-MM-DD')}
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
              this.setState({ searchedItem: '', searchText: '' });
            }
          }}
          onPressSearch={() => this.searchHandler(this.state.searchText)}
        />

        {this.state.loader && (
          <ActivityIndicator
            size="large"
            color="#D2691Eff"
            animating={this.state.loader}
            style={{ marginTop: 20 }}
          />
        )}

        {this.state.loader == false && (
          <View>
            <FlatList
              style={{ flex: 1 }}
              ListEmptyComponent={() => <EmptyComponent />}
              key={key}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
              data={searchedItem ? filterPosts : posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{
                marginTop: 20,
                flexGrow: 1,
                width: width,
                alignSelf: 'center',
                paddingBottom: '20%',
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
  item,
  name,
  start_date,
  end_date,
  rules,
  procedures,
  onItemClick,
  question,
  image,
  todaysDate,
}) => (
  <Card>
    <TouchableOpacity activeOpacity={0.9} onPress={onItemClick}>
      <View
        style={[
          Styles.newsbox1,
          {
            flexDirection: 'row-reverse',
            // justifyContent: 'flex-end',
            height: 80,
            justifyContent: 'flex-start',
            paddingHorizontal: 10,
            alignItems: 'center',
          },
        ]}>
        <View
          style={{
            // position: 'absolute',
            // left: 20,
            backgroundColor: '#fff',
            borderRadius: 30,
            borderColor: '#d2691e',
            borderWidth: 1,
          }}>
          <Image
            source={require('../../assets/group-survey.png')}
            style={{
              height: 60,
              width: 60,
            }}
            resizeMode="cover"></Image>
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 16,
            color: 'black',
            marginHorizontal: 10,
            fontFamily: Platform.OS == 'ios' ? null: family.Neo_Medium,
            // fontWeight: '600',
          }}>
          {question?.length > 30 ? question?.slice(0, 30) : question}
        </Text>
        <View
          style={{
            backgroundColor: '#d2691e',
            padding: 5,
            borderRadius: 10,
            marginLeft: 'auto',
            width: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }}>

          <Text style={{ color: '#fff',  fontFamily: Platform.OS == 'ios' ? null: family.Neo_Regular, }}>
            {item?.survey_end_status == 1
              ? 'غير نشط'
              : todaysDate <= end_date
                ? ArabicText?.Started
                : ArabicText?.Ended}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </Card>
);
