import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Styles} from '../styles/globlestyle';
import * as ArabicText from '../language/EnglishToArabic';
import {DataContext} from '../context/DataContext';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      imageFlage: false,
      title: '',
      description: '',
      location: '',

      images: {uri: '', name: '', type: ''},
      localUrii: '',
      fileName: '',
    };
  }

  createPost = async (createPostCamelClub, user_id) => {
    createPostCamelClub(
      user_id,
      this.state.description,
      this.state.title,
      this.state.location,
      this.state.image,
    );
  };

  pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let localUri = result.uri;
      let filename = localUri.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      this.setState({
        image: result.uri,
        imageFlage: true,
        images: {
          uri: localUri,
          name: filename,
          type: type,
        },
        localUrii: localUri,
        fileName: filename,
      });
    }
  };
  render() {
    return (
      <DataContext.Consumer>
        {context => (
          <View style={Styles.container}>
            <View style={Styles.surveyQuestioncard}>
              {this.state.imageFlage && (
                <Image
                  source={{
                    uri: this.state.image,
                  }}
                  style={{width: 320, height: 200}}></Image>
              )}

              <TextInput
                style={Styles.inputs}
                placeholder={ArabicText.Title}
                onChangeText={text => this.setState({title: text})}
              />

              <TextInput
                style={Styles.inputs}
                placeholder={ArabicText.Description}
                onChangeText={text =>
                  this.setState({description: text})
                }></TextInput>

              <TextInput
                style={Styles.inputs}
                placeholder={ArabicText.Location}
                onChangeText={text =>
                  this.setState({location: text})
                }></TextInput>
              <TouchableOpacity onPress={() => this.pickImage()}>
                <Text>{ArabicText.Please_select_Image}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignSelf: 'center'}}>
                <View style={Styles.btn}>
                  <Text
                    style={Styles.textbtn}
                    onPress={() =>
                      this.createPost(
                        context.createPostCamelClub,
                        context.data.profile.user.id,
                      )
                    }>
                    {ArabicText.Adding_post}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </DataContext.Consumer>
    );
  }
}
export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
