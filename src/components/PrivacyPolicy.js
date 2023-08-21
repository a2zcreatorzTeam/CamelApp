import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet, ScrollView,ActivityIndicator
} from "react-native";
import RenderHtml from 'react-native-render-html';
import { Dimensions } from "react-native";
import camelapp from "../api/camelapp";
const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height

const tagsStyles = {
  body: {
    //whiteSpace: 'normal',
    color: 'black',
    alignItems: "center",
    width: "90%",
    alignSelf:"center",

  },
  a: {
    color: 'green'
  }
};

class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
      loader: false,

    }
  }
  componentDidMount() {
    this.setState({loader:true})
    async function renderHtml() {
      let response;

      response = await camelapp.get("/getprivacies")
      const backendHtmlString = await response.data

      //console.log(backendHtmlString)
      return backendHtmlString
    }
    renderHtml().then((result) => this.setState({ html: result.data[0].description,loader:false }))
  }
  render() {
    //console.log(this.state.html)
    const source = {
      html: `<p>${this.state.html}</p>`
    }
    return (
      <ScrollView style={{backgroundColor:'white'}}>
        <View style={{ backgroundColor: '#fff', padding: 10, textAlign: 'right' }}>
        {this.state.loader && <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} style={{ marginTop: 20 }} />}
        <RenderHtml
          contentWidth={width}
          source={source}
          tagsStyles={tagsStyles}
        />
          {/* <HTML
            source={source}
            contentWidth={width}
          /> */}
        </View>
      </ScrollView>
    );
  }
}
export default PrivacyPolicy;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});