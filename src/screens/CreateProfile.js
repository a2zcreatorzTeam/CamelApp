import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import {bindActionCreators} from 'redux';
import {ImageBackground} from 'react-native';
import * as EmailValidator from 'email-validator';
import {ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      location: '',
      email: '',
      pickedImage: '',
      userName: '',
      phoneNumber: '',
    };
  }
  componentDidMount() {
    let {user} = this.props;
    user = user?.user?.user;
    this.setState({user: user, image: user?.image, location: user?.location});
  }
  imagePick() {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
      selectionLimit: 1,
    })
      .then(async images => {
        if ((images.length = 1)) {
          this.setState({
            image: images.path,
            pickedImage: 'data:image/png;base64,' + images.data,
          });
        } else {
          Toast.show({
            text1: ArabicText.Only1imageallowed,
            type: 'error',
            visibilityTime: 3000,
          });
          // alert(ArabicText?.Only1imageallowed);
        }
        console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createProfile = async () => {
    const {pickedImage, location, email, userName, phoneNumber} = this.state;
    console.log(
      location,
      email,
      userName,
      phoneNumber,
      ' location, email, userName, phoneNumber',
    );
    const userdata = this.props?.route?.params?.response;
    const {screen} = this.props.route?.params;
    if (screen == 'socialLogin') {
      if (!userName) {
        Toast.show({
          text1: ArabicText.usernamecantbeempty,
          type: 'error',
          visibilityTime: 3000,
        });
      } else if (!phoneNumber) {
        Toast.show({
          text1: ArabicText.phonenumbercantbeempty,
          type: 'error',
          visibilityTime: 3000,
        });
      }
    } else {
      if (!email) {
        Toast.show({
          text1: ArabicText.EmailFieldCantBeEmpty,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(ArabicText?.EmailFieldCantBeEmpty);
      } else if (!EmailValidator.validate(email)) {
        Toast.show({
          text1: ArabicText.EmailIsNotValid,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(ArabicText?.EmailIsNotValid);
      } else if (!location) {
        Toast.show({
          text1: ArabicText.LocationFieldCantBeEmpty,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(ArabicText?.LocationFieldCantBeEmpty);
      } else if (!pickedImage) {
        Toast.show({
          text1: ArabicText.ImageCantBeEmpty,
          type: 'error',
          visibilityTime: 3000,
        });
        // alert(ArabicText?.ImageCantBeEmpty);
      }
    }
    console.log(userdata?.user?.id, location, email, pickedImage);
    this.setState({
      btnLoader: true,
    });
    await camelapp
      .post('/update', {
        user_id: userdata?.user?.id,
        location: location,
        email: email,
        image: pickedImage,
        number: phoneNumber ? phoneNumber : null,
      })
      .then(res => {
        console.log('responseeeeeeee', res);
        this.setState({
          btnLoader: false,
        });
        if (res.data.status == true) {
          this.setState({
            btnLoader: false,
          });
          let {actions} = this.props;
          actions.userData(res?.data);
          this.props.navigation.navigate('Home');
        } else {
          this.setState({
            btnLoader: false,
          });
          Toast.show({
            text1: ArabicText.UserUpdateFailed,
            type: 'error',
            visibilityTime: 3000,
          });
          // alert(ArabicText?.UserUpdateFailed);
        }
      })
      .catch(error => {
        console.log(error, 'errorrr');
        this.setState({
          btnLoader: false,
        });
      });
  };
  //   imagePick = () => {
  //     ImageCropPicker.openPicker({
  //       mediaType: 'photo',
  //       multiple: false,
  //       includeBase64: false,
  //       selectionLimit: 1,
  //     })
  //       .then(async images => {
  //         if (images) {
  //           setImage({
  //             // image: undefined,
  //             pickedImage: images?.data,
  //             imageShow: images?.path,
  //             mediaType: images?.mime,
  //             imageName: images?.modificationDate,
  //           });
  //         } else {
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error', error);
  //       });

  //     // setModalVisible(false)
  //   };

  render() {
    const {image, btnLoader, location} = this.state;
    const {screen} = this.props.route?.params;
    console.log(screen, 'screemj');
    return (
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          backgroundColor: '#fff',
          flex: 1,
        }}>
        <View style={Styles.container}>
          <View
            style={{
              backgroundColor: 'lightgrey',
              width: 150,
              height: 150,
              borderRadius: 100,
              marginTop: 100,
              marginBottom: 30,
              // alignSelf: 'center',
            }}>
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
              }}
              source={
                image ? {uri: image} : require('../../assets/dummyImage.jpeg')
              }>
              <TouchableOpacity
                onPress={() => this.imagePick()}
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
          </View>

          <Text style={[Styles.text, {marginVertical: 20}]}>
            {ArabicText?.Edit_profile}
          </Text>

          <View style={Styles.profileQuestioncard}>
            {screen == 'socialLogin' ? (
              <>
                <TextInput
                  style={Styles.inputs}
                  keyboardType="numeric"
                  placeholder={ArabicText.phone}
                  maxLength={11}
                  placeholderTextColor="#000000"
                  onChangeText={text =>
                    this.setState({phoneNumber: text.replace(/[^0-9]/g, '')})
                  }></TextInput>
                <TextInput
                  style={Styles.inputs}
                  value={this?.state?.userName}
                  onChangeText={text => this.setState({userName: text})}
                  placeholder={ArabicText.name}
                  placeholderTextColor="#b0b0b0"
                />
              </>
            ) : null}
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
              value={location}
              onChangeText={text => this.setState({location: text})}
              placeholder={ArabicText.Location}
              placeholderTextColor="#b0b0b0"
            />
          </View>

          {/* Create Profile */}
          <TouchableOpacity
            onPress={() => {
              !btnLoader && this.createProfile();
            }}
            style={{
              backgroundColor: '#8b4513',
              width: 200,
              height: 40,
              borderRadius: 7,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            {this?.state?.btnLoader ? (
              <ActivityIndicator
                size="large"
                color="white"
                animating={this?.state?.btnLoader}
              />
            ) : (
              <Text style={{color: '#fff', fontSize: 16}}>Create Profile</Text>
            )}
          </TouchableOpacity>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile);
