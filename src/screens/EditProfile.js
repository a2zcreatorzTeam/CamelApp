import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ArabicText from '../language/EnglishToArabic';
import AntDesign from 'react-native-vector-icons/AntDesign';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import {bindActionCreators} from 'redux';
import * as EmailValidator from 'email-validator';
import Toast from 'react-native-toast-message';
import BackBtnHeader from '../components/headerWithBackBtn';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      firstName: '',
      lastName: '',
      userName: '',
      phone: {},
      image: '',
      location: '',
      imageShow: undefined,
      imageFlage: true,
      flagforImagePicker: false,
      imageForUpdate: undefined,
      pickedImage: '',
      modalVisible: false,
      optVal: {},
      btnLoader: false,
      email: this.props.user.user.user.email,
    };
  }

  logOut() {
    try {
      let {user, actions} = this.props;
      actions?.userLogout({});
      console.log('2');
      AsyncStorage.removeItem('@UserPhone');
      console.log('3');
      AsyncStorage.removeItem('@UserPassword');
      console.log('4');
      AsyncStorage.removeItem('fcmToken');
      this.props.navigation.replace('Home');
    } catch (error) {
      console.log('error', error);
    }
  }
  componentDidMount() {
    let {user} = this.props;
    user = user.user.user;
    this.setState({user: user, userName: user.name, location: user.location});
  }
  openGallery() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      selectionLimit: 1,
    })
      .then(async images => {
        if ((images.length = 1)) {
          this.setState({
            image: images?.path,
            pickedImage: 'data:image/png;base64,' + images.data,
          });
        } else {
          Toast.show({
            text1: ArabicText.Only1imageallowed,
            type: 'error',
            visibilityTime: 3000,
          });
        }
        console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  clearText = () => {
    this.otpInput.clear();
  };
  setText = () => {
    this.otpInput.setValue('1234');
  };
  updateProfile = async () => {
    console.log(pickedImage, this.props.user.user.user?.image);
    const {image} = this.props.user.user.user;
    const {email, location, pickedImage, userName} = this.state;
    if (!pickedImage && !image) {
      Toast.show({
        text1: ArabicText.ImageCantBeEmpty,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!userName) {
      Toast.show({
        text1: ArabicText.UsernameCantBeEmpty,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!email) {
      Toast.show({
        text1: ArabicText.EmailFieldCantBeEmpty,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!EmailValidator.validate(email)) {
      Toast.show({
        text1: ArabicText.EmailIsNotValid,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!location) {
      Toast.show({
        text1: ArabicText.LocationFieldCantBeEmpty,
        type: 'error',
        visibilityTime: 3000,
      });
    } else {
      this.setState({
        btnLoader: true,
      });

      let {actions} = this.props;
      if (this.state.imageShow == undefined) {
        console.log('99999');
        await camelapp
          .post('/update', {
            user_id: this.props.user.user.user.id,
            name: userName,
            location: location,
            email: email,
            image:
              pickedImage !== undefined
                ? pickedImage
                : this.props.user.user.user?.image,
          })
          .then(res => {
            console.log(res?.data, 'dtaaresponseee');
            if (res.data.status == true) {
              this.setState({
                btnLoader: false,
              });
              actions.userData(res?.data);
              this.props.navigation.replace('Profile', {
                screen: ArabicText.profilee,
              });
            } else {
              this.setState({
                btnLoader: false,
              });
              this.props.navigation.replace('Profile', {
                screen: ArabicText.profilee,
              });
            }
          })
          .catch(error => {
            console.log(error, 'errorr');
            this.setState({
              btnLoader: false,
            });
          });
      }
    }
  };
  render() {
    const {image, pickedImage} = this.state;
    return (
      // <ScrollView
      //   showsVerticalScrollIndicator={false}
      //   contentContainerStyle={{ paddingTop: 10, backgroundColor: "#fff" }}>
      <View style={Styles.container}>
        <BackBtnHeader showToolTip style={{justifyContent:'space-around'}}/>
        <ImageBackground
          imageStyle={{
            borderRadius: 100,
            borderColor: 'orange',
            borderWidth: 2,
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            alignSelf: 'center',
            marginTop: 30,
          }}
          source={
            pickedImage?.length
              ? {uri: image}
              : this.props.user.user.user?.image
              ? {
                  uri:
                    'http://www.tasdeertech.com/public/images/profiles/' +
                    this.props.user.user.user?.image,
                }
              : require('../../assets/dummyImage.jpeg')
          }>
          <TouchableOpacity
            onPress={() => this.openGallery()}
            style={{
              marginTop: -30,
              position: 'absolute',
              bottom: 0,
              borderRadius: 100,
              backgroundColor: 'orange',
              // borderColor: Colors.color1,
              // borderWidth: 4,
              alignContent: 'center',
              alignSelf: 'center',
              padding: 10,
            }}>
            <Image
              source={require('../../assets/edit.png')}
              resizeMode="contain"
              style={{
                tintColor: 'white',
                width: 20,
                height: 20,
              }}
              name="upload"
            />
          </TouchableOpacity>
        </ImageBackground>
        <Text style={Styles.text}>{ArabicText.Edit_profile}</Text>

        <View style={Styles.profileQuestioncard}>
          <TextInput
            style={Styles.inputs}
            value={this.state.userName}
            onChangeText={text => this.setState({userName: text})}
            placeholder={ArabicText.Name}
            placeholderTextColor="#b0b0b0"
          />
          <TextInput
            style={Styles.inputs}
            value={this?.state?.email}
            onChangeText={text => this.setState({email: text})}
            placeholder={ArabicText.EMAIL}
            placeholderTextColor="#b0b0b0"
            keyboardType="email-address"
          />

          <TextInput
            style={Styles.inputs}
            value={this.state.location}
            onChangeText={text => this.setState({location: text})}
            placeholder={ArabicText.Location}
            placeholderTextColor="#b0b0b0"
          />
        </View>
        {/* Update Profile */}
        <TouchableOpacity
          onPress={this.updateProfile}
          style={{
            backgroundColor: '#8b4513',
            width: 200,
            height: 40,
            borderRadius: 7,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          {this.state.btnLoader ? (
            <ActivityIndicator
              size="large"
              color="white"
              animating={this.state.btnLoader}
            />
          ) : (
            <Text style={{color: '#fff', fontSize: 16}}>Update Profile</Text>
          )}
        </TouchableOpacity>

        {/* logout button */}
        <TouchableOpacity
          onPress={() => this.logOut()}
          style={{alignSelf: 'center', marginBottom: 20, marginTop: 10}}>
          <AntDesign name="poweroff" size={25} color="red" />
        </TouchableOpacity>
      </View>

      // <Modal
      //   animationType="slide"
      //   visible={this.state.modalVisible}
      //   transparent={true}
      //   onRequestClose={() => this.setState({ modalVisible: false })}
      // >
      //   <TouchableOpacity activeOpacity={1} style={{ height: height }}
      //     onPress={() => this.setState({ modalVisible: false })}
      //   />
      //   <View style={{
      //     height: '20%',
      //     width: width,
      //     marginTop: 'auto',
      //     backgroundColor: '#ccc',
      //     borderTopEndRadius: 20,
      //     borderTopStartRadius: 20,
      //     position: "absolute",
      //     bottom: 0
      //   }}>
      //     <View style={{
      //       height: 30,
      //       borderTopEndRadius: 25,
      //       borderTopStartRadius: 25,
      //       justifyContent: "center",
      //       alignItems: "center"
      //     }}>
      //       <Text style={{ color: "#8b4513", fontSize: 15, fontWeight: "600" }}>Enter OTP Here</Text>
      //     </View>

      //     <OTPTextInput
      //       tintColor="#8b4513"
      //       ref={e => (this.otpInput = e)}
      //       containerStyle={{ width: "90%", alignSelf: "center", bottom: 10 }}
      //       handleTextChange={(e) => this.setState({ optVal: e })} />
      //   </View>
      // </Modal>

      // </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
