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

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      location: '',
      email: '',
      pickedImage: '',
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
          alert('Only 1 image allowed');
        }
        console.log('images', images);
      })
      .catch(error => {
        console.log('error', error);
      });
  }
  createProfile = async () => {
    const {pickedImage, location, email} = this.state;
    console.log(this.props.navigation?.route?.params?.response, 'responseeeee');
    const userdata = this.props.navigation?.route?.params?.response;
    this.setState({
      btnLoader: true,
    });

    let {actions} = this.props;
    if (this.state.imageShow == undefined) {
      await camelapp
        .post('/update', {
          user_id: userdata?.user?.id,
          location: location,
          email: email,
          image: pickedImage,
        })
        .then(res => {
            console.log("res,",res?.data);
          if (res.data.status == true) {
            this.setState({
              btnLoader: false,
            });
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
              image: this?.props?.user?.user?.user?.image,
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
    const {image, pickedImage, location} = this.state;
    console.log(this.props.navigation?.route?.params?.response, 'responseeeee');
    return (
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

        <Text style={[Styles.text, {marginVertical:20}]}>{ArabicText?.Edit_profile}</Text>
        <View style={Styles.profileQuestioncard}>
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
          onPress={this?.updateProfile}
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
