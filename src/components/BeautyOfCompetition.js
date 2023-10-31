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
import PostItem from './CompetitionPostItem';
import BackBtnHeader from './headerWithBackBtn';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('screen').width;
class BeautyOfCompetition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.route.params.competition_item[0]?.competition_posts,
      competition: props.route.params.competition_item?.length
        ? props.route.params.competition_item[0].competition
        : [],
      competition_prize:
        props.route.params.competition_item[0]?.competition_prize,
      competition_winner:
        props.route.params.competition_item[0]?.competition_winner,
      sponsors: props.route.params.competition_item[0]?.sponsors,
      competition_participants:
        props.route.params.competition_item[0]?.competition_participant,
      modal: false,
      particpateModal: false,
      generalRulesModal: false,
      refreshing: false,
      loading: false,
      key: false,
      participantsModal: false,
    };
  }
  selectedCompetition() {
    let {user} = this.props;
    user = user.user.user;
    if (user != undefined) {
      this.props.navigation.navigate('BeautyCompetitionForm', {
        competitionItem: this.state.competition[0].id,
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
  render() {
    const NewDate = moment().format('YYYY-MM-DD');
    const {key} = this.state;
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
      this.props.navigation.navigate('CompetitionDetail', {
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
          {name}
        </Text>
      </View>
    );
    const renderSponserItem = ({item}) => {
      return <SponsorItem item={item} name={item.name} image={item.image} />;
    };
    const {competition} = this.state;
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
        <BackBtnHeader />

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            width: '100%',
            width: '90%',
          }}>
          <ScrollView horizontal style={styles.scrollView}>
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
                  if (this.state.competition_winner?.length) {
                    this.props.navigation.navigate('WinnerBeauty', {
                      competitionItem: this.state.competition_winner,
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
                    backgroundColor: this.state.competition_winner?.length
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
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({modal: false});
          }}>
          <TouchableWithoutFeedback>
            <View style={Styles.centeredView}>
              <View style={Styles.modalView}>
                <Text style={{margin: 5, color: 'black'}}>
                  {ArabicText.Reward}
                </Text>
                {this.state?.competition_prize && (
                  <Image
                    style={{width: 250, height: 250}}
                    source={{
                      uri:
                        'http://www.tasdeertech.com/images/prizes/' +
                        this.state?.competition_prize[0]?.image,
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
          visible={this.state.particpateModal}
          onRequestClose={() => {
            this.setState({particpateModal: false});
          }}>
          <View style={Styles.centeredView}>
            <View style={[Styles.modalView]}>
              {this.state.competition?.length && (
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
                  {/* {console.log(
                      this.state.competition,
                      'this.state.competition[0]?.procedure',
                    )} */}
                  <View style={{padding: 10}}>
                    <HTML
                      tagsStyles={tagsStyles}
                      source={{
                        html: `<p>${this.state.competition[0]?.procedure}</p>`,
                      }}
                      contentWidth={width}
                    />
                  </View>
                  {/* </ScrollView> */}
                  {/* <Text style={{ margin: 5 }}>{this.state.competition[0].procedure}</Text> */}

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
          visible={this.state.generalRulesModal}
          onRequestClose={() => {
            this.setState({generalRulesModal: false});
          }}>
          <View style={Styles.centeredView}>
            <View style={[Styles.modalView]}>
              {this.state.competition?.length && (
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
          visible={this.state.participantsModal}
          onRequestClose={() => {
            this.setState({participantsModal: false});
          }}>
          <View style={Styles.centeredView}>
            <View style={[Styles.modalView]}>
              {/* <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => this.setState({participantsModal: false})}>
                <AntDesign name="closecircle" size={30} color="#CD853F" />
              </TouchableOpacity> */}
              {this.state.competition?.length && (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.ScrollToRefresh()}
                    />
                  }
                  contentContainerStyle={{flexGrow: 1}}
                  style={{height: '70%'}}
                  ListEmptyComponent={() => <EmptyComponent />}
                  data={this.state.competition_participants}
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

        <View style={Styles.BeautyOfComp}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.sponsors}
            renderItem={renderSponserItem}
            horizontal={true}
          />
        </View>

        {NewDate >= competition[0]?.start_date &&
          NewDate <= competition[0]?.end_date && (
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={() => this.selectedCompetition()}>
              <Text style={[Styles.ButtonBeauty, {width: width - 20}]}>
                {ArabicText.Click_to_Participate}
              </Text>
            </TouchableOpacity>
          )}

        <View style={{flex: 1}}>
          {this.state?.posts?.length && (
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
              data={this.state.posts}
              renderItem={renderPostItem}
              numColumns={2}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.ScrollToRefresh()}
                />
              }
            />
          )}
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
  },
});
