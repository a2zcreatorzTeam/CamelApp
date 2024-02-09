import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Dimensions,
  LogBox,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Item from '../components/BankItem';
import camelapp from '../api/camelapp';
import BackBtnHeader from '../components/headerWithBackBtn';
import * as ArabicText from '../language/EnglishToArabic';
import {family} from '../constants/Family';
const width = Dimensions.get('screen').width;

class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {},
      loader: true,
      text: 0,
    };
    this.viewPosts();
  }
  async viewPosts() {
    try {
      return await camelapp.get('/getBank').then(response => {
        console.log('response', response.data);
        this.setState({
          posts: response.data.status,
          loader: false,
        });
      });
    } catch (error) {
      this.setState({
        posts: [],
        loader: false,
      });
      Toast.show({
        text1: ArabicText?.somethingwentwrong,
        type: 'error',
        visibilityTime: 3000,
      });
      //console.log("Error Message camel club List", error.response);
    }
  }
  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }
  render() {
    const {loader, text, posts} = this.state;
    const renderItem = ({item}) => {
      return (
        <Item
          item={item}
          name={item.bank_name}
          address={item.account_holder_name}
          userImage={item.banks_logo}
          phone={item.account_holder_number}
        />
      );
    };
    return (
      <View style={styles.container}>
        <BackBtnHeader />
        <ScrollView
          contentContainerStyle={{
            backgroundColor: '#fff',
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{flex: 1, width: '100%'}}>
          {loader && (
            <ActivityIndicator
              size="large"
              color="#D2691Eff"
              animating={loader}
              style={{marginTop: 30}}
            />
          )}
          {loader == false && (
            <View>
              <View style={{marginBottom: 20}}>
                <View style={styles.textView}>
                  <Text style={styles.heading}>
                    {ArabicText.Commissionrate}
                  </Text>
                  <Text style={styles.description}>
                    {ArabicText.bankDescription1}
                  </Text>
                  <Text style={styles.description}>
                    {ArabicText.bankDescription2}
                  </Text>
                </View>
                <View style={{marginTop: 25}}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.textHeader}>
                      {ArabicText.Toknowtheapplicationrate}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType={'numeric'}
                      onChangeText={newText => this.setState({text: newText})}
                      value={text}
                    />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.textHeader}>
                      {ArabicText.Applicationrate}
                    </Text>
                    <Text style={styles.ratioText}>
                      {parseFloat((2 / 100) * text).toFixed(2)}
                    </Text>
                    <Text style={styles.textHeader}>
                      {ArabicText.Bankaccounts}
                    </Text>
                  </View>
                </View>
              </View>
              <FlatList
                contentContainerStyle={{
                  flexGrow: 1,
                  marginBottom: width * 0.09,
                }}
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item?.id?.toString()}
              />
            </View>
          )}
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
    backgroundColor: '#D2691Eff',
    width: '100%',
  },
  textView: {
    alignSelf: 'center',
    width: width - 30,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
    marginTop: 20,
    marginBottom: 20,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  description: {
    fontSize: 20,
    color: '#D2691E',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
    marginTop: 15,
    marginBottom: 10,
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
  textInput: {
    borderColor: '#D2691E',
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 40,
    color: 'black',
    width: 270,
    textAlign: 'right',
  },
  ratioText: {
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
    textAlign: 'right',
    fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
  },
});
