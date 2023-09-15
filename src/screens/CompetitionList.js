// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   View,
//   TouchableOpacity,
//   Image,
//   Text,
//   Dimensions,
//   RefreshControl,
// } from 'react-native';
// import camelapp from '../api/camelapp';
// // import Item from '../components/CompetitonListItem'
// import {Styles} from '../styles/globlestyle';

// import * as ArabicText from '../language/EnglishToArabic';

// import {connect} from 'react-redux';
// import * as userActions from '../redux/actions/user_actions';
// import {bindActionCreators} from 'redux';
// import Ads from '../components/Ads';
// import Header from '../components/Header';
// import Item from '../components/CompetitionItem';
// const width = Dimensions.get('screen').width;
// const height = Dimensions.get('screen').height;

// class CamelClubList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       posts: [],
//       loader: true,
//       refreshing: false,
//       filterPosts: [],
//       searchText: '',
//       searchedItem: '',
//     };
//   }

//   ScrollToRefresh() {
//     this.viewPosts();
//     this.setState({refreshing: false});
//   }

//   async viewPosts() {
//     try {
//       return await camelapp.get('/get/competition').then(res => {
//         //console.log("res", res.data.status)
//         this.setState({
//           posts: res.data.status,
//           loader: false,
//         });
//       });
//     } catch (error) {
//       //console.log("Error Message get competition List", error);
//     }
//   }

//   searchHandler = value => {
//     console.log(value, 'valueeee');
//     if (!value?.length) {
//       this.setState({filterPosts: this.state.posts});
//     } else {
//       this.setState({searchedItem: value});
//       // Data Filtration
//       const filteredData = this.state.posts.filter(item => {
//         console.log(item, 'itemmmm');
//         const {name, procedure, rules} = item;
//         return (
//           name?.toLowerCase().includes(value.toLowerCase()) ||
//           rules?.toLowerCase().includes(value.toLowerCase()) ||
//           procedure?.toLowerCase().includes(value.toLowerCase())
//         );
//       });
//       if (filteredData.length > 0) {
//         this.setState({filterPosts: filteredData});
//       } else {
//         this.setState({filterPosts: []});
//       }
//     }
//   };
//   search(text) {
//     this.setState({searchText: text});
//   }

//   componentDidMount() {
//     const {navigation} = this.props;
//     this.focusListener = navigation.addListener('focus', () => {
//       this.viewPosts();
//     });
//   }
// //   componentWillUnmount() {
// //     // this.focusListener();
// //   }
//   render() {
//     const {searchedItem, filterPosts, posts, loader} = this.state;
//     const onItemClick = async item => {
//       try {
//         await camelapp
//           .post('get/competition_details', {
//             competition_id: item.id,
//           })
//           .then(res => {
//             if (res) {
//               // //console.log("response at competitionItem", res.data)
//               let temp = res.data;
//               this.props.navigation.navigate('BeautyOfCompetition', {
//                 competition_item: temp,
//               });
//             }
//           });
//       } catch (error) {
//         //console.log("Error Message get competition List", error);
//       }
//     };
//     // const Item = ({name, start_date, end_date, onItemClick, image}) => (
//     //   <View
//     //     style={{
//     //       backgroundColor: '#fff',
//     //       alignSelf: 'center',
//     //       justifyContent: 'space-evenly',
//     //       flex: 1,
//     //       marginHorizontal: this.state.loader == false ? 3 : 0,
//     //       marginVertical: this.state.loader == false ? 3 : 0,
//     //       elevation: 0.5,
//     //     }}>
//     //     <TouchableOpacity
//     //       onPress={onItemClick}
//     //       style={{
//     //         padding: 10,
//     //         justifyContent: 'center',
//     //         alignItems: 'center',
//     //         alignSelf: 'center',
//     //       }}>
//     //       <Image
//     //         source={{
//     //           uri: 'https:www.tasdeertech.com/images/competition/' + image,
//     //         }}
//     //         style={Styles.BeautyImages}
//     //         resizeMode="cover"></Image>

//     //       <View style={{flexDirection: 'row', alignSelf: 'center'}}>
//     //         <Text
//     //           numberOfLines={2}
//     //           style={{
//     //             height: 40,
//     //             alignSelf: 'center',
//     //             color: 'black',
//     //             textAlign: 'right',
//     //             fontWeight: '600',
//     //             fontSize: 14,
//     //           }}>
//     //           {name}
//     //         </Text>
//     //         {/* <Text style={{ textAlign: 'right', fontWeight: '600', fontSize: 14 }}> {ArabicText.Title} </Text> */}
//     //       </View>
//     //       <View style={{flexDirection: 'row', alignSelf: 'center'}}>
//     //         <Text
//     //           style={{
//     //             color: 'black',
//     //             textAlign: 'right',
//     //             fontWeight: '600',
//     //             fontSize: 12,
//     //           }}>
//     //           {start_date} :{' '}
//     //         </Text>
//     //         <Text
//     //           style={{
//     //             textAlign: 'right',
//     //             color: 'black',
//     //             fontWeight: 'bold',
//     //             fontSize: 12,
//     //           }}>
//     //           {ArabicText.Start_Date}
//     //         </Text>
//     //       </View>
//     //       <View style={{flexDirection: 'row', alignSelf: 'center'}}>
//     //         <Text
//     //           style={{
//     //             color: 'black',
//     //             textAlign: 'right',
//     //             fontWeight: '600',
//     //             fontSize: 12,
//     //           }}>
//     //           {end_date} :{' '}
//     //         </Text>
//     //         <Text
//     //           style={{
//     //             textAlign: 'right',
//     //             color: 'black',
//     //             fontWeight: 'bold',
//     //             fontSize: 12,
//     //           }}>
//     //           {ArabicText.End_Date}
//     //         </Text>
//     //       </View>
//     //     </TouchableOpacity>
//     //   </View>
//     // );
//     const renderItem = ({item}) => {
//       return (
//         <Item
//           item={item}
//           name={item.name}
//           start_date={item.start_date}
//           end_date={item.end_date}
//           onItemClick={() => onItemClick(item)}
//           image={item.image}
//           loader={loader}
//         />
//       );
//     };
//     return (
//       <View style={styles.container}>
//         <Header
//           onChangeText={text => {
//             if (text) {
//               this.search(text);
//             } else {
//               this.setState({searchedItem: ''});
//             }
//           }}
//           onPressSearch={() => this.searchHandler(this.state.searchText)}
//         />
//         <ActivityIndicator
//           size="large"
//           color="#D2691Eff"
//           animating={this.state.loader}
//           style={{marginTop: 20, marginHorizontal: 0, marginVertical: 0}}
//         />
//         {!loader && (
//           <FlatList
//             extraData={searchedItem}
//             data={searchedItem ? filterPosts : posts}
//             renderItem={renderItem}
//             contentContainerStyle={{
//               alignSelf: 'center',
//               justifyContent: 'center',
//             }}
//             keyExtractor={item => item?.id}
//             numColumns={2}
//             initialNumToRender={5}
//             maxToRenderPerBatch={5}
//             ListHeaderComponentStyle={{alignSelf: 'center'}}
//             ListHeaderComponent={() => <Ads />}
//             refreshControl={
//               <RefreshControl
//                 refreshing={this.state.refreshing}
//                 onRefresh={() => this.ScrollToRefresh()}
//               />
//             }
//           />
//         )}
//       </View>
//     );
//   }
// }
// const mapStateToProps = state => ({
//   user: state.user,
// });

// const ActionCreators = Object.assign({}, userActions);
// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(CamelClubList);
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     height: '100%',
//     backgroundColor: '#eee',
//   },
// });

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
import Item from '../components/CompetitionItem';
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
    };
    this.viewPosts();
  }

  async viewPosts() {
    try {
      return await camelapp.get('/get/competition').then(res => {
        //console.log("res", res.data.status)
        this.setState({
          posts: res.data.status,
          loader: false,
        });
      });
    } catch (error) {
      //console.log("Error Message get competition List", error);
    }
  }

  onItemClick = async item => {
    this.viewPosts();
    let {user} = this.props;
    user = user.user.user;
    if (user != undefined) {
      let tempString = item?.survey_details;
      console.log('user?.id=', item?.survey_details[0]?.survey_id);
      await camelapp
        .post('/check/survey/by/user_id', {
          user_id: user?.id,
          survey_id: item?.survey_details[0]?.survey_id,
        })
        .then(response => {
          // console.log('response', response.data);

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
            competition_id: item.id,
          })
          .then(res => {
            if (res) {
              // //console.log("response at competitionItem", res.data)
              let temp = res.data;
              this.props.navigation.navigate('BeautyOfCompetition', {
                competition_item: temp,
              });
            }
          });
      } catch (error) {
        //console.log("Error Message get competition List", error);
      }
    };
    const {posts, filterPosts, searchedItem, loader} = this.state;
    const renderItem = ({item}) => {
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
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              numColumns={2}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
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

// const Item = ({
//   name,
//   start_date,
//   end_date,
//   rules,
//   procedures,
//   onItemClick,
//   question,
//   image,
// }) => (
//   <Card>
//     <TouchableOpacity onPress={onItemClick}>
//       <View
//         style={[
//           Styles.newsbox1,
//           {
//             flexDirection: 'row-reverse',
//             justifyContent: 'flex-end',
//             height: 80,
//           },
//         ]}>
//         <View
//           style={{
//             position: 'absolute',
//             left: 20,
//             backgroundColor: '#fff',
//             borderRadius: 30,
//             borderColor: '#d2691e',
//             borderWidth: 1,
//           }}>
//           <Image
//             source={require('../../assets/group-survey.png')}
//             // source={{ uri: "http://www.tasdeertech.com/images/survey/" + image }}
//             style={{
//               height: 60,
//               width: 60,
//             }}
//             resizeMode="cover"></Image>
//         </View>

//         <Text
//           numberOfLines={2}
//           style={{
//             width: width - 120,
//             textAlign: 'right',
//             fontWeight: '500',
//             fontSize: 16,
//             color: 'black',
//           }}>
//           {question}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   </Card>
// );
