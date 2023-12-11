import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import 'react-native-gesture-handler';
import {Styles} from '../styles/globlestyle';
import HTML from 'react-native-render-html';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import PostItem from '../components/CompetitionPostItem';
import BackBtnHeader from '../components/headerWithBackBtn';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../components/Header';
import EmptyComponent from '../components/EmptyComponent';

const width = Dimensions.get('screen').width;
class BeautyOfCompetition extends Component {
  constructor(props) {
    super(props);
    let competition_item = props.route.params.competition_item[0];
    this.state = {
      posts: competition_item?.competition_posts,
      competition: props.route.params.competition_item?.length
        ? competition_item?.competition
        : [],
      sponsors: competition_item?.sponsors,
      filteredSponsors: [],
      participants: competition_item?.competition_participant,
      filteredParticipants: [],
      searchParticipants: '',
      searchParticipantsText: '',
      modal: false,
      particpateModal: false,
      generalRulesModal: false,
      refreshing: false,
      loading: false,
      key: false,
      participantsModal: false,
      searchedItem: '',
      filterPosts: [],
      searchText: '',
    };
  }
  selectedCompetition() {
    const {competition} = this.state;
    let {user} = this.props;
    user = user.user.user;
    if (user != undefined) {
      this.props.navigation.navigate('BeautyCompetitionForm', {
        competitionItem: competition[0].id,
      });
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  async competitionDetails() {
    const {key} = this.state;
    try {
      let {user} = this.props;
      user = user.user.user;
      return await camelapp
        .post('/get/competition_details', {
          competition_id:
            this.props.route.params.competition_item[0].competition[0].id,
          user_id: user?.id,
        })
        .then(res => {
          const arrayPosts = res?.data?.competition_posts;
          arrayPosts?.map((item, index) => {
            let array = item?.img;
            let imagesArray = [];
            array?.forEach(element => {
              imagesArray?.push({type: 'image', source: element});
            });
            imagesArray?.push({type: 'video', source: item?.video});
            item['imagesArray'] = imagesArray;
            arrayPosts[index] = item;
          });
          this.setState({
            posts: res?.data?.competition_posts,
            key: !key,
          });
        });
    } catch (error) {
      Toast.show({
        text1: ArabicText?.somethingwentwrong,
        type: 'error',
        visibilityTime: 3000,
      });
      console.log('Error Message get competition List', error);
    }
  }
  componentDidMount() {
    this.competitionDetails();
    let date = new Date();
    this.setState({
      start_date: Date.parse(
        this.props.route.params.competition_item?.length
          ? this.props.route.params.competition_item[0].competition[0]
              .start_date
          : '',
      ),
      end_date: Date.parse(
        this.props.route.params.competition_item?.length
          ? this.props.route.params.competition_item[0]?.competition[0].end_date
          : '',
      ),
      today: Date.parse(date),
    });
  }
  ScrollToRefresh() {
    this.competitionDetails();
    this.setState({refreshing: false});
  }
  // SEARCH HANDLER
  searchHandler = value => {
    const {posts, sponsors} = this.state;
    if (!value?.length) {
      this.setState({filterPosts: posts});
    } else {
      this.setState({searchedItem: value});
      // // Data Filtration
      const filteredData = posts.filter(item => {
        const {user_name} = item;
        return user_name?.toLowerCase().includes(value.toLowerCase());
      });
      const filteredSponsers = sponsors?.filter(item => {
        const {name} = item;
        return name?.toLowerCase().includes(value.toLowerCase());
      });
      this.setState({filteredSponsers: filteredSponsers});
      if (filteredData?.length > 0) {
        this.setState({filterPosts: filteredData, dataNotFound: false});
      } else {
        this.setState({filterPosts: [], dataNotFound: true});
      }
    }
  };
  // SEARCH HANDLER
  searchParticipantsHandler = value => {
    const {participants, searchParticipants} = this.state;
    if (!value?.length) {
      this.setState({searchParticipants: participants});
    } else {
      this.setState({searchParticipants: value});
      // // Data Filtration
      const filteredData = participants.filter(item => {
        const {user_name} = item;
        return user_name?.toLowerCase().includes(value.toLowerCase());
      });
      console.log(filteredData, 'filterdataaa');
      if (filteredData?.length > 0) {
        this.setState({filteredParticipants: filteredData});
      } else {
        this.setState({filteredParticipants: []});
      }
    }
  };
  search(text) {
    this.setState({searchText: text});
  }
  render() {
    const {competition, posts, refreshing, searchParticipantsText} = this.state;
    const competition_item = this.props.route.params.competition_item[0];
    const NewDate = moment().format('YYYY-MM-DD');
    const {
      key,
      searchedItem,
      filterPosts,
      filteredSponsers,
      searchText,
      modal,
      generalRulesModal,
      participantsModal,
      particpateModal,
      searchParticipants,
      filteredParticipants,
    } = this.state;
    const tagsStyles = {
      body: {
        color: 'black',
        alignItems: 'center',
        textAlign: 'right',
        width: '95%',
      },
    };
    // COMMENT
    onCommentsClick = async item => {
      let {user} = this.props;
      user = user.user.user;
      let post_id = item.id;
      // if (user != undefined) {
      // await camelapp
      //   .post('/get/comment', {
      //     post_id: post_id,
      //     user_id: user.id,
      //   })
      //   .then(res => {
      //     console.log(res?.data, "response15333");
      this.props.navigation.navigate('Comments', {
        user: user,
        post: item,
        post_id: item?.post_id,
      });
      // this.viewPosts();
      // });
      // }
      // else {
      //   this.props.navigation.navigate('Login');
      // }
    };
    // LIKE
    onLikesClick = async (item, setIsLiked, setLikeCount) => {
      this.setState({loading: false});
      let {user} = this.props;
      user = user.user.user;
      let post_id = item.post_id;
      if (user != undefined) {
        await camelapp
          .post('/add/like', {
            user_id: user.id,
            post_id: post_id,
            competition_id:
              this.props.route.params.competition_item[0].competition[0].id,
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
            Toast.show({
              text1: ArabicText?.somethingwentwrong,
              type: 'error',
              visibilityTime: 3000,
            });
            console.log('error', error);
            this.setState({loading: false});
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    postViewed = async (item, viewCount, setViewCount) => {
      this.setState({loading: false});
      let {user} = this.props;
      user = user?.user?.user;
      let post_id = item?.post_id;
      console.log(item, 'iemmm2055');
      if (user != undefined) {
        await camelapp
          .post('/add/view', {
            user_id: user?.id,
            post_id: post_id,
          })
          .then(response => {
            if (response?.data?.message !== 'Already Viewed') {
              setViewCount(viewCount + 1);
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
    onClickItem = async (item, viewCount, setViewCount) => {
      this.props.navigation.navigate('CompetitionPostDetail', {
        itemFromDetails: item,
      });
      postViewed(item, viewCount, setViewCount);
    };
    const renderPostItem = ({item}) => {
      return (
        <PostItem
          viewCount={item?.view_count}
          onClickItem={(viewCount, setViewCount) =>
            onClickItem(item, viewCount, setViewCount)
          }
          item={item}
          image={item?.img?.length ? item?.img[0] : ''}
          commentCount={item?.comment_count}
          likeCount={item?.like_count}
          postLike={(item, setIsLiked, setLikeCount) =>
            onLikesClick(item, setIsLiked, setLikeCount)
          }
          postComment={() => {
            onCommentsClick(item);
          }}
        />
      );
    };
    const SponsorItem = ({name, image}) => (
      <View style={{alignItems: 'center', width: width - 50, padding: 10}}>
        <Image
          source={{uri: 'https:www.tasdeertech.com/images/profiles/' + image}}
          style={{width: 200, height: 120}}
        />
        <Text
          style={{
            fontSize: 18,
            textAlign: 'right',
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 10,
            color: 'black',
          }}>
          {name ? name : ''}
        </Text>
      </View>
    );
    const renderSponserItem = ({item}) => {
      return <SponsorItem item={item} name={item.name} image={item.image} />;
    };
    // PARTICIPANTS LIST
    const Item = ({userName, userImage, onUserMessageClick}) => (
      // <Card>
      <View
        style={{
          backgroundColor: '#fff', // '#f3f3f3',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '95%',
          height: 70,
          flexDirection: 'row',
          marginBottom: 5,
          borderBottomWidth: 1,
          borderColor: '#D3D3D3',
        }}>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'right',
            color: '#565756',
            fontWeight: '700',
            marginRight: 10,
            marginBottom: 5,
          }}>
          {userName}
        </Text>
        <View
          style={{
            borderRadius: 30,
            // borderWidth: 1,
            // borderColor: '#D3D3D3',
            marginRight: 10,
            overflow: 'hidden',
            marginBottom: 5,
          }}>
          <Image
            source={{
              uri:
                'http://www.tasdeertech.com/public/images/profiles/' +
                userImage,
            }}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </View>
      </View>
      // </Card>
    );
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          userName={item?.user_name}
          userImage={item.user_image}
        />
      );
    };
    return (
      <View style={[Styles.containerBeauty, {position: 'relative'}]}>
        <Header
          navRoute="CamelClubList"
          onChangeText={text => {
            if (text) {
              this.search(text);
            } else {
              this.setState({searchedItem: '', searchText: ''});
            }
          }}
          onPressSearch={() => this.searchHandler(searchText)}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            width: '100%',
            width: '90%',
          }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={styles.scrollView}>
            {/* Reward MODAL  */}
            <Pressable onPress={() => this.setState({modal: true})}>
              <Text style={Styles.ButtonBeauty}>{ArabicText.Reward}</Text>
            </Pressable>
            {/* HOW TO PARTICIPATE */}
            <Pressable onPress={() => this.setState({particpateModal: true})}>
              <Text style={Styles.ButtonBeauty}>
                {ArabicText.How_to_Participate}
              </Text>
            </Pressable>
            {/* Rules Modal  */}
            <Pressable onPress={() => this.setState({generalRulesModal: true})}>
              <Text style={Styles.ButtonBeauty}>{ArabicText.General_Rule}</Text>
            </Pressable>
            {/* WINNER  */}
            <Pressable
              onPress={() => {
                if (this?.state?.posts?.length > 0) {
                  if (competition_item.competition_winner?.length) {
                    this.props.navigation.navigate('WinnerBeauty', {
                      competitionItem: competition_item.competition_winner,
                    });
                  } else {
                  }
                } else {
                  Toast.show({
                    text1: ArabicText?.Noonehasparticipatedyet,
                    type: 'error',
                    visibilityTime: 3000,
                  });
                  // alert('No one has participated yet!');
                }
              }}>
              <Text
                style={[
                  Styles.ButtonBeauty,
                  {
                    backgroundColor: competition_item.competition_winner?.length
                      ? '#D2691Eff'
                      : '#808080',
                  },
                ]}>
                {ArabicText.winner}
              </Text>
            </Pressable>
            {/* PARTICIPANTS  */}
            <Pressable onPress={() => this.setState({participantsModal: true})}>
              <Text style={Styles.ButtonBeauty}>{ArabicText.PARTICIPANTS}</Text>
            </Pressable>
          </ScrollView>
        </View>
        {/* PRIZE MODAL  */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modal}
          onRequestClose={() => {
            this.setState({modal: false});
          }}>
          <TouchableWithoutFeedback>
            <View style={Styles.centeredView}>
              <View style={Styles.modalView}>
                <Text style={{margin: 5, color: 'black'}}>
                  {ArabicText.Reward}
                </Text>
                {competition_item?.competition_prize && (
                  <Image
                    style={{width: 250, height: 250}}
                    source={{
                      uri:
                        'http://www.tasdeertech.com/images/prizes/' +
                        competition_item?.competition_prize[0]?.image,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={{marginTop: 'auto'}}
                  onPress={() => this.setState({modal: false})}>
                  <View style={Styles.btnform}>
                    <Text style={Styles.textbtn}>{ArabicText.close}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* particpateModal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={particpateModal}
          onRequestClose={() => {
            this.setState({particpateModal: false});
          }}>
          <View style={Styles.centeredView}>
            <View style={[Styles.modalView]}>
              {competition?.length && (
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  style={{
                    width: '90%',
                    height: '50%',
                    flexGrow: 1,
                  }}>
                  <Pressable
                    style={{position: 'absolute', top: 0}}
                    onPress={particpateModal =>
                      this.setState({particpateModal: !particpateModal})
                    }>
                    <Ionicons name="close" size={30} color="brown" />
                  </Pressable>
                  <Text style={{margin: 5, color: 'black'}}>
                    {ArabicText.How_to_Participate}
                  </Text>
                  <View style={{padding: 10}}>
                    <HTML
                      tagsStyles={tagsStyles}
                      source={{
                        html: `<p>${this.state.competition[0]?.procedure}</p>`,
                      }}
                      contentWidth={width}
                    />
                  </View>

                  <TouchableOpacity
                    style={{marginTop: 'auto'}}
                    onPress={() => this.setState({particpateModal: false})}>
                    <View style={Styles.btnform}>
                      <Text style={Styles.textbtn}>{ArabicText.close}</Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        {/* General_Rule */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={generalRulesModal}
          onRequestClose={() => {
            this.setState({generalRulesModal: false});
          }}>
          <View style={Styles.centeredView}>
            <View style={[Styles.modalView]}>
              {competition?.length && (
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  style={{width: '90%', height: '50%', flexGrow: 1}}>
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: 0,
                    }}
                    onPress={generalRulesModal =>
                      this.setState({
                        generalRulesModal: !generalRulesModal,
                      })
                    }>
                    <Ionicons
                      name="close"
                      size={30}
                      color="brown"
                      // style={{ marginLeft: width - 140 }}
                    />
                  </Pressable>
                  <Text style={{margin: 5, color: 'black'}}>
                    {ArabicText.General_Rule}
                  </Text>

                  <View style={{padding: 10}}>
                    <HTML
                      tagsStyles={tagsStyles}
                      source={{
                        html: `<p>${this.state.competition[0].rules}</p>`,
                      }}
                      contentWidth={width}
                    />
                  </View>
                  {/* <Text style={{ margin: 5 }}>{this.state.competition[0].rules}</Text> */}

                  <TouchableOpacity
                    style={{marginTop: 'auto'}}
                    onPress={() => this.setState({generalRulesModal: false})}>
                    <View style={Styles.btnform}>
                      <Text style={Styles.textbtn}>{ArabicText.close}</Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        {/* PARTICIPATES MODAL  */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={participantsModal}
          onRequestClose={() => {
            this.setState({participantsModal: false});
          }}>
          <View style={Styles.centeredView}>
            <View
              style={[Styles.modalView, {paddingTop: 0, paddingHorizontal: 0}]}>
              <Header
                hideCircle
                customStyle={{width: width - 100}}
                onChangeText={text => {
                  if (text) {
                    // this.search(text);
                    this.setState({searchParticipantsText: text});
                  } else {
                    this.setState({
                      searchParticipants: '',
                      searchParticipantsText: '',
                    });
                  }
                }}
                onPressSearch={() =>
                  this.searchParticipantsHandler(searchParticipantsText)
                }
              />
              {/* <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => this.setState({participantsModal: false})}>
                <AntDesign name="closecircle" size={30} color="#CD853F" />
              </TouchableOpacity> */}
              {competition?.length && (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => this.ScrollToRefresh()}
                    />
                  }
                  contentContainerStyle={{flexGrow: 1}}
                  style={{height: '70%'}}
                  ListEmptyComponent={() => <EmptyComponent />}
                  data={
                    searchParticipants
                      ? filteredParticipants
                      : competition_item.competition_participant
                  }
                  renderItem={renderItem}
                  keyExtractor={item => item?.user_id?.toString()}
                />
              )}
              <TouchableOpacity
                style={{marginTop: 'auto'}}
                onPress={() => this.setState({participantsModal: false})}>
                <View style={Styles.btnform}>
                  <Text style={Styles.textbtn}>{ArabicText.close}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {(
          searchedItem
            ? filteredSponsers?.length
            : competition_item?.sponsors?.length
        ) ? (
          <View style={Styles.BeautyOfComp}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={
                searchedItem ? filteredSponsers : competition_item?.sponsors
              }
              renderItem={renderSponserItem}
              horizontal={true}
            />
          </View>
        ) : null}

        {NewDate >= competition[0]?.start_date &&
          NewDate <= competition[0]?.end_date && (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 20,
              }}
              onPress={() => this.selectedCompetition()}>
              <Text style={[Styles.ButtonBeauty, {width: width - 20}]}>
                {ArabicText.Click_to_Participate}
              </Text>
            </TouchableOpacity>
          )}

        <View style={{flex: 1}}>
          {posts?.length ? (
            <FlatList
              key={key}
              style={{flex: 1, flexGrow: 1}}
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'flex-end',
                width: width,
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              data={searchedItem ? filterPosts : posts}
              renderItem={renderPostItem}
              numColumns={2}
              // initialNumToRender={5}
              // maxToRenderPerBatch={5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const ActionCreators = Object.assign({});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeautyOfCompetition);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 10,
  },
});
