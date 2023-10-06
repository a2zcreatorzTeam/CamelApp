import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Styles} from '../styles/globlestyle';
import Carousel from 'react-native-snap-carousel';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import {bindActionCreators} from 'redux';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import * as ArabicText from '../language/EnglishToArabic';
import VideoModal from './VideoModal';
import HorizontalCarousel from './HorizontalCarousel';
import BackBtnHeader from './headerWithBackBtn';

class DetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemFromDetails: props.route.params.itemFromDetails,
      user: {
        id: this.props.route.params.itemFromDetails.user_id,
        name: this.props.route.params.itemFromDetails.user_name,
        image: this.props.route.params.itemFromDetails.user_images,
        whatsapp_status:
          this.props.route.params.itemFromDetails.user_whatsapp_status,
        whatsapp_no: this.props.route.params.itemFromDetails.user_chat_status,
      },
      imagesArray: [],
      videoModal: false,
      pausedCheck: true,
      modalItem: '',
      loadVideo: false,
    };
  }

  componentDidMount() {
    let array = this.state.itemFromDetails.img;
    let imagesArray = [];

    array.forEach(element => {
      imagesArray.push({type: 'image', source: element});
    });
    imagesArray.push({type: 'video', source: this.state.itemFromDetails.video});

    this.setState({imagesArray: imagesArray});
  }
  onCommentsClick = () => {
    let item = this.state.itemFromDetails;

    let {user} = this.props;
    user = user.user.user;
    let post_id = item.id;
    if (user != undefined) {
      camelapp
        .post('/get/comment', {
          post_id: post_id,
        })
        .then(res => {
          this.props.navigation.navigate('Comments', {
            commentsForPost: res,
            user: user,
            post: item,
          });
        });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  sendWhatsAppMessage() {
    let {user} = this.props;

    console.log('user', user.user.user);

    if (user?.user?.user?.id != this.state?.itemFromDetails?.user_id) {
      if (user.user.user != undefined) {
        console.log(
          'this.state.itemFromDetails.user_whatsapp_status',
          this.state.itemFromDetails.user_whatsapp_status,
        );

        //console.log("user", this.state.user)

        if (
          this.state.itemFromDetails.user_whatsapp_status == true ||
          this.state.itemFromDetails.user_whatsapp_status == '1'
        ) {
          let msg = 'Hello';
          let mobile = this.state.itemFromDetails?.user_whatsapp_no;

          if (mobile?.length != 0) {
            if (msg) {
              let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
              Linking.openURL(url)
                .then(data => {
                  //console.log("WhatsApp Opened successfully " + data);
                })
                .catch(() => {
                  alert('Make sure WhatsApp installed on your device');
                });
            } else {
              alert('Please enter message to send');
            }
          } else {
            alert('This user has disabled chat');
          }
        } else {
          alert('This user has disabled chat');
        }
      } else {
        this.props.navigation.navigate('Login');
      }
    } else {
      alert('This is your post');
    }
  }

  sendMessage() {
    let {user} = this.props;
    if (user.user.user != undefined) {
      if (user?.user?.user?.id != this.state?.itemFromDetails?.user_id) {
        if (
          this.state.itemFromDetails.user_chat_status == true ||
          this.state.itemFromDetails.user_chat_status == '1'
        ) {
          this.props.navigation.navigate('MessageViewScreen', {
            messageData: this.state.user,
          });
        } else {
          alert('This user has disabled chat');
        }
      } else {
        alert('This is your post');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }
  render() {
    const {loadVideo, pausedCheck, modalItem, videoModal} = this.state;

    return (
      <ScrollView style={{backgroundColor: '#ffff'}}>
        <BackBtnHeader />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            marginTop: 15,
          }}>
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: '700',
                marginRight: 20,
              }}>
              {this.state.itemFromDetails.name}
            </Text>
            <Text style={{color: '#000', fontSize: 14, marginRight: 20}}>
              {this.state.itemFromDetails.user_location}
            </Text>
          </View>

          <View
            style={{
              height: 63,
              width: 63,
              borderRadius: 50,
              backgroundColor: '#f3f3f3',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri:
                  'http://www.tasdeertech.com/images/profiles/' +
                  this.state.itemFromDetails.user_images,
              }}
              style={{
                height: 55,
                width: 55,
                resizeMode: 'center',
                borderRadius: 50,
              }}
            />
          </View>
        </View>
        {/* IMAGE VIDEO Carousel */}
        <View style={Styles.containerDetails}>
          <HorizontalCarousel
            price={
              this.state.itemFromDetails?.price
                ? this.state.itemFromDetails?.price
                : ''
            }
            imagesArray={this.state.imagesArray}
            onPress={mediaSource => {
              this.setState({
                pausedCheck: false,
                videoModal: true,
                modalItem: mediaSource,
              });
            }}
            pausedCheck={pausedCheck}
            pauseVideo={() => {
              this.setState({pausedCheck: true});
            }}
          />
          <View style={{textAlign: 'right'}}>
            <Text style={Styles.textHeadingg}>{ArabicText.Title}</Text>
            <TextInput
              value={this.state.itemFromDetails.title}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.title}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.Car_Name}</Text>
            <TextInput
              value={this.state.itemFromDetails.car_model}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.car_model}
              editable={false}></TextInput>

            <Text style={Styles.textHeadingg}>{ArabicText.car_type}</Text>
            <TextInput
              value={this.state.itemFromDetails.car_type}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.car_type}
              editable={false}></TextInput>
            <Text style={Styles.textHeadingg}>{ArabicText.Price}</Text>
            <TextInput
              value={this.state.itemFromDetails.price}
              style={Styles.forminputsDetails}
              placeholder={this.state.itemFromDetails.price}
              editable={false}></TextInput>

            <View style={{flexDirection: 'row', margin: 5}}>
              <View>
                <Text style={Styles.textHeadingg}>{ArabicText.To}</Text>
                <TextInput
                  value={this.state.itemFromDetails.to_location}
                  style={Styles.mforminputs}
                  placeholder={this.state.itemFromDetails.to_location}
                  editable={false}></TextInput>
              </View>

              <View>
                <Text style={Styles.textHeadingg}>{ArabicText.From}</Text>
                <TextInput
                  value={this.state.itemFromDetails.location}
                  style={Styles.mforminputs}
                  placeholder={this.state.itemFromDetails.location}
                  editable={false}
                  // onChangeText={(text) => this.setState({ location: text })}
                ></TextInput>
              </View>
            </View>

            <Text style={Styles.textHeadingg}>{ArabicText.Description}</Text>
            <TextInput
              value={this.state.itemFromDetails.description}
              style={Styles.inputdecrp}
              placeholder={this.state.itemFromDetails.description}
              editable={false}></TextInput>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.sendMessage()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <Feather name="send" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>{ArabicText.message}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onCommentsClick()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <Feather name="message-square" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>{ArabicText.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.sendWhatsAppMessage()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <FontAwesome name="whatsapp" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>واتساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <AntDesign name="mobile1" size={30} color="#CD853F" />
              <Text style={Styles.fontDetails}>{ArabicText.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* VIDEO MODAL */}
        <VideoModal
          onLoadStart={() => {
            this.setState({loadVideo: true});
          }}
          onReadyForDisplay={() => {
            this.setState({loadVideo: false});
          }}
          onPress={() => {
            !loadVideo && this.setState({pausedCheck: !pausedCheck});
          }}
          closeModal={() => {
            this.setState({videoModal: false, pausedCheck: true});
          }}
          pausedCheck={pausedCheck}
          loadVideo={loadVideo}
          videoModal={videoModal}
          modalItem={modalItem}
        />
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailsComponent);
const styles = StyleSheet.create({
  video: {width: '100%', height: 400, borderWidth: 1, backgroundColor: 'black'},
  imageCarousal: {
    width: width,
    height: height / 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
