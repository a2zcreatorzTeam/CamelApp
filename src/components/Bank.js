import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet, FlatList, ActivityIndicator, TextInput, ScrollView, Dimensions, LogBox
} from "react-native";
import Item from "./BankItem";
import camelapp from "../api/camelapp";

const width = Dimensions.get('screen').width
const hight = Dimensions.get('screen').height



class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      text: 0

    };

    this.viewPosts();
  }


  async viewPosts() {

    try {

      return await camelapp
        .get(
          "/getBank"
        )
        .then((response) => {

          //console.log('response', response.data.status)
          this.setState({
            posts: response.data.status,
            loader: false
          });

        });
    } catch (error) {
      this.setState({
        posts: [],
        loader: false
      });
      //console.log("Error Message camel club List", error.response);
    }
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }

  render() {

    const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          name={item.bank_name}
          address={item.account_holder_name}
          userImage={item.banks_logo}
          phone={item.account_holder_number}
        />
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView
          nestedScrollEnabled={true}
          style={{ flex: 1 }}>

          {this.state.loader && <ActivityIndicator size="large" color='#D2691Eff' animating={this.state.loader} style={{ marginTop: 30 }} />}

          {this.state.loader == false &&
            <View>
              <View style={{ marginBottom: 20, }}>


                <View
                  style={{
                    // marginRight: 20,

                    alignSelf: "center",
                    width: width - 30,
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#D2691E',
                      marginTop: 20,
                      marginBottom: 20
                    }}
                  >نسبة العمولة</Text>

                  <Text
                    style={{
                      fontSize: 20,
                      color: '#D2691E',
                      marginTop: 10,
                      textAlign: "center",
                      // alignSelf:"center"
                    }}>هي النسبة المطلوب دفعها للتطبيق نظير الاستفادة من بيع الحلال بمقدار 2% من مبلغ البيع وصاحب الحلال له احقية اختيار المسؤول عن دفع المبلغ.</Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#D2691E',
                      marginTop: 10,
                      textAlign: "center",
                    }}>كما نود التنويه انه لا يوجد نسبة من الخدمات الأخرى المقدمة الا خدمات الاشتراك في نقل الحلال والاعلانات.</Text>
                </View>
                <View
                  style={{ marginTop: 25 }}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#D2691E',
                        marginTop: 15,
                        marginBottom: 10
                      }}>لمعرفة نسبة التطبيق</Text>
                    <TextInput
                      style={{
                        borderColor: '#D2691E',
                        borderWidth: 3,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        height: 40,
                        color: 'black',
                        width: 270,
                        textAlign: 'right',
                      }}
                      keyboardType={'numeric'}
                      onChangeText={(newText) => this.setState({ text: newText })}
                      value={this.state.text}
                    />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#D2691E',
                        marginTop: 15,
                        marginBottom: 10
                      }}>نسبة التطبيق</Text>
                    <Text
                      style={{
                        borderColor: '#D2691E',
                        borderWidth: 3,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        height: 40,
                        width: 270,
                        fontSize: 20,
                        padding: 6,
                        color: 'black',

                        justifyContent: 'center',
                        textAlign: 'right'
                      }}>{parseFloat(this.state.text / 10).toFixed(2)}</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#D2691E', marginTop: 15 }}>الحسابات البنكية:</Text>
                  </View>
                </View>
              </View>

              <FlatList
                data={this.state.posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}
export default Bank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    // backgroundColor: 'red'
  }
});