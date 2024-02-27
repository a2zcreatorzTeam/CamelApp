/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import HTML from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import * as ArabicText from '../language/EnglishToArabic';
import camelapp from '../api/camelapp';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;
class AboutUs extends Component {
  state = {
    html: '',
    loader: true,
  };

  componentDidMount() {
    this.setState({loader: true});
    async function renderHtml() {
      let response;
      response = await camelapp.get('/getAbout');
      if (response) {
        const backendHtmlString = await response?.data;
        return backendHtmlString;
      } else {
        Toast.show({
          text1: ArabicText?.somethingwentwrong,
          type: 'error',
          visibilityTime: 3000,
        });
      }
    }
    renderHtml().then(result =>
      this.setState({html: result.data[0].details, loader: false}),
    );
  }
  render() {
    const {loader, html} = this.state;
    const source = {
      html: `<p >${html}</p>`,
    };
    const tagsStyles = {
      body: {
        color: 'black',
        alignItems: 'center',
        width: '100%',
      },
      a: {
        color: 'green',
      },
    };
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff'}}>
        <View style={{backgroundColor: '#fff', marginRight: 5}}>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 5,
              fontSize: 18,
              color: '#D2691Eff',
              marginBottom: 15,
              fontFamily: family.Neo_Medium,
            }}>
            {ArabicText.AboutUs}
          </Text>
          <View style={{padding: 10}}>
            {loader && (
              <ActivityIndicator
                size="large"
                color="#D2691Eff"
                animating={loader}
                style={{marginTop: 20}}
              />
            )}
            <HTML
              source={source}
              contentWidth={width}
              tagsStyles={tagsStyles}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default AboutUs;
