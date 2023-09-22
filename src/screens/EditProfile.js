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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ArabicText from '../language/EnglishToArabic';
import AntDesign from 'react-native-vector-icons/AntDesign';
import camelapp from '../api/camelapp';
import {connect} from 'react-redux';
import * as userActions from '../redux/actions/user_actions';
import * as ImageCropPicker from 'react-native-image-crop-picker';
import {bindActionCreators} from 'redux';
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      firstName: '',
      lastName: '',
      userName: '',
      phone: {},
      image: this.props.user.user.user.image,
      location: '',
      imageShow: undefined,
      imageFlage: true,
      flagforImagePicker: false,
      imageForUpdate: undefined,
      pickedImage: undefined,
      modalVisible: false,
      optVal: {},
      btnLoader: false,
    };
  }

  logOut() {
    try {
      let {user, actions} = this.props;
      actions.userActions({});
      AsyncStorage.removeItem('@UserPhone');
      AsyncStorage.removeItem('@UserPassword');
      this.props.navigation.navigate('Home');
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
            imageShow: images.path,
            pickedImage: 'data:image/png;base64,' + images.data,
            image: undefined,
          });
        } else {
          alert('Only 1 image allowed');
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
    this.setState({
      btnLoader: true,
    });

    let {actions} = this.props;
    if (this.state.imageShow == undefined) {
      console.log('99999');
      await camelapp
        .post('/update', {
          user_id: this.props.user.user.user.id,
          name: this.state.userName,
          location: this.state.location,
          // phone: this.state.phone,
        })
        .then(res => {
          if (res.data.status == true) {
            this.setState({
              btnLoader: false,
            });
            // alert('User Updated Successfully');
            actions.userData(res?.data);
            this.props.navigation.replace('Profile');
          } else {
            this.setState({
              btnLoader: false,
            });
            alert('User Update failed');
          }
        });
    }

    if (this.state.image == undefined) {
      console.log('12666');
      console.log('user', this.props.user.user.user.id);
      await camelapp
        .post('/update', {
          user_id: this.props.user.user.user.id,
          name: this.state.name,
          location: this.state.location,
          image: this.state.pickedImage,
        })
        .then(res => {
          console.log('response', res.data);
          if (res.data.status == true) {
            actions.userData(res.data);
            this.setState({
              imageShow: undefined,
              pickedImage: undefined,
              image: this.props.user.user.user.image,
            });
            alert('User Updated Successfully');
            this.props.navigation.replace('Profile');
          } else {
            this.setState({
              btnLoader: false,
            });
            alert('User Update failed');
          }
        })
        .catch(error => {
          this.setState({
            btnLoader: false,
          });
          console.log('error', error);
        });
    }
  };

  render() {
    console.log(this.state.optVal);

    return (
      // <ScrollView
      //   showsVerticalScrollIndicator={false}
      //   contentContainerStyle={{ paddingTop: 10, backgroundColor: "#fff" }}>
      <View style={Styles.container}>
        {this.state.flagforImagePicker && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => this.openGallery()}>
            <Image
              source={{
                uri: this.state.image,
              }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 100,
              }}></Image>
          </TouchableOpacity>
        )}
        {this.state.imageFlage && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => this.openGallery()}>
            <Image
              source={{
                uri:
                  this.state.image === undefined
                    ? this.state.imageShow
                    : 'http://www.tasdeertech.com/public/images/profiles/' +
                      this.state.image,
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
              }}></Image>
          </TouchableOpacity>
        )}
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
            value={this.state.location}
            onChangeText={text => this.setState({location: text})}
            placeholder={ArabicText.Location}
            placeholderTextColor="#b0b0b0"
          />
        </View>

        {/* <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }} onPress={() => this.updateProfile()}>
            <View style={Styles.btn}><Text style={Styles.textbtn}>{ArabicText.Update_Profile}</Text></View>
          </TouchableOpacity>

          <View style={[Styles.profileQuestioncard, { marginTop: 10 }]}>
            <TextInput
              style={Styles.inputs}
              value={this.state.phone}
              keyboardType='numeric'
              onChangeText={(text) => this.setState({ phone: text })}
              placeholder={ArabicText.ENTER_PHONE_NUMBER}
              placeholderTextColor="#b0b0b0"
            />
          
          </View>
          <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }} onPress={() => this.setState({ modalVisible: true })}>
            <View style={Styles.btn}><Text style={Styles.textbtn}>Update Number</Text></View>
          </TouchableOpacity> */}

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
