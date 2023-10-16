import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet, ScrollView, ActivityIndicator
} from "react-native";

import * as ArabicText from "../language/EnglishToArabic"
import camelapp from "../api/camelapp";
import HTML from 'react-native-render-html';
import { Dimensions } from "react-native";

const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height
class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
      loader: false
    }
  }
  componentDidMount() {
    this.setState({ loader: true })
    async function renderHtml() {

      let response;
      response = await camelapp.get("/getAbout")
      const backendHtmlString = await response.data
      //console.log(backendHtmlString)
      return backendHtmlString
    }
    renderHtml().then((result) => this.setState({ html: result.data[0].details, loader: false }))
  }
  render() {
    //console.log(this.state.html)
    const source = {
      html: `<p >${this.state.html}</p>`
    }
    const tagsStyles = {
      body: {
        //whiteSpace: 'normal',
        color: 'black',
        alignItems: "center",
        width: "100%"

      },
      a: {
        color: 'green'
      }
    };
    return (

      <ScrollView style={{ backgroundColor: '#fff' }} >
        <View style={{ backgroundColor: '#fff', marginRight: 5 }}>
          <Text style={{ marginTop: 5, fontSize: 18, fontWeight: 'bold', color: '#D2691Eff', marginBottom: 15 }}>{ArabicText.AboutUs}</Text>
          <View style={{ padding: 10 }}>
            {this.state.loader && <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} style={{ marginTop: 20 }} />}
            <HTML
              source={source}
              contentWidth={width}
              tagsStyles={tagsStyles}
            />
          </View>
        </View>
      </ScrollView>

    )
  }
}
export default AboutUs;