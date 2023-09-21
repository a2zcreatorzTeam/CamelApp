import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import 'react-native-gesture-handler';
import {Styles} from '../styles/globlestyle';

import HTML from 'react-native-render-html';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import {useState} from 'react';
import PostItem from './CompetitionPostItem';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
class BeautyOfCompetition extends Component {
  constructor(props) {
    super(props);
    // console.log(
    //   props.route.params.competition_item[0]?.competition_posts,
    //   'props.route.params.competition_item[0].competition_posts',
    // );
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

      modal: false,
      particpateModal: false,
      generalRulesModal: false,
      refreshing: false,
      loading: false,
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
          const arr = res?.data;
          this.setState({
            posts: res?.data?.competition_posts,
          });
        });
    } catch (error) {
      console.log('Error Message get competition List', error);
    }
  }
  componentDidMount() {
    this.competitionDetails();

    let date = new Date();

    // console.log('DAte', date.getDate());
    // console.log('month', date.getMonth());
    // console.log('year', date.getFullYear());

    let tempDate =
      date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

    // console.log('tempDate', Date.parse(tempDate));
    // console.log(
    //   'this.props.route.params.competition_item[0].competition.end_date',
    //   this.props.route.params.competition_item[0],
    // );
    // console.log(
    //   'this.props.route.params.competition_item[0].competition.start_date',
    //   this.props.route.params.competition_item,
    // );

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
  postViewed = async item => {
    this.setState({loading: false});
    let {user} = this.props;
    user = user?.user?.user;
    let post_id = item?.id;
    if (user != undefined) {
      await camelapp
        .post('/add/view', {
          user_id: user?.id,
          post_id: post_id,
        })
        .then(response => {
          console.log('response.data', response.data);
        })
        .catch(error => {
          console.log('error', error);
          this.setState({loading: false});
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };
  render() {
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
      if (user != undefined) {
        await camelapp
          .post('/get/comment', {
            post_id: post_id,
            user_id: user.id,
          })
          .then(res => {
            this.props.navigation.navigate('Comments', {
              commentsForPost: res,
              user: user,
              post: item,
            });
            this.viewPosts();
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    // LIKE
    onLikesClick = async (item, setIsLiked, setLikeCount) => {
      this.setState({loading: false});
      let {user} = this.props;
      user = user.user.user;
      let post_id = item.id;
      // console.log(user.id, post_id, item?.competition_id);
      if (user != undefined) {
        await camelapp
          .post('/add/like', {
            user_id: user.id,
            post_id: post_id,
            competition_id:
              this.props.route.params.competition_item[0].competition[0].id,
          })
          .then(response => {
            console.log(response?.data, 'response123');
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
            console.log('error', error);
            this.setState({loading: false});
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    };
    const renderPostItem = ({item}) => {
      return (
        <PostItem
          item={item}
          image={[item?.img]?.length ? item?.img[0] : ''}
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
      // console.log(item, 'itemmmm');
      return <SponsorItem item={item} name={item.name} image={item.image} />;
    };
    return (
      <View style={Styles.containerBeauty}>
        <View style={{flexDirection: 'row', marginTop: 20, gap: 5}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modal}
            onRequestClose={() => {
              this.setState({modal: false});
            }}>
            <TouchableWithoutFeedback
            // onPress={() => this.setState({ modal: false })}
            >
              <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                  <Pressable onPress={modal => this.setState({modal: !modal})}>
                    <Ionicons name="close" size={30} color="brown" />
                  </Pressable>
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
                    onPress={() => this.setState({modal: false})}>
                    <View style={Styles.btnform}>
                      <Text style={Styles.textbtn}>{ArabicText.close}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Pressable onPress={() => this.setState({modal: true})}>
            <Text style={Styles.ButtonBeauty}>{ArabicText.Reward}</Text>
          </Pressable>

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

          <Pressable onPress={() => this.setState({particpateModal: true})}>
            <Text style={Styles.ButtonBeauty}>
              {ArabicText.How_to_Participate}
            </Text>
          </Pressable>

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

          <Pressable onPress={() => this.setState({generalRulesModal: true})}>
            <Text style={Styles.ButtonBeauty}>{ArabicText.General_Rule}</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (this?.state?.posts?.length > 0) {
                this.props.navigation.navigate('WinnerBeauty', {
                  competitionItem: this.state.competition_winner,
                });
              } else {
                alert('No one has participated yet!');
              }
            }}>
            <Text style={Styles.ButtonBeauty}>{ArabicText.winner}</Text>
          </Pressable>
        </View>

        <View style={Styles.BeautyOfComp}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.sponsors}
            renderItem={renderSponserItem}
            horizontal={true}
            // initialNumToRender={5}
            // maxToRenderPerBatch={5}
          />
        </View>

        {this.state.today >= this.state.start_date &&
          this.state.today <= this.state.end_date && (
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
              style={{flex: 1, flexGrow: 1}}
              contentContainerStyle={{flexGrow: 1}}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
