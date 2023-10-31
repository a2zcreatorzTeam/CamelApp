import React, {Component} from 'react';
import {View, Text,  TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
import BidPost from '../components/BidPost';
import Bids from '../components/BidsOnPost';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
const Tab = createMaterialTopTabNavigator();
import * as ArabicText from '../language/EnglishToArabic';
export default class BidTab extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{width: width, height: hight, backgroundColor: '#D2691Eff'}}>
          <View
            style={{
              width: width,
              backgroundColor: '#D2691Eff',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 35,
              }}>
              {ArabicText?.Bids}
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 30,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 20,
              }}>
              <Ionicons name="md-arrow-redo" size={30} color="brown" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: width,
              height: hight,
              alignSelf: 'center',
              backgroundColor: 'white',
              marginTop: 20,
              borderTopRightRadius: 50,
              borderTopLeftRadius: 50,
            }}>
            <Tab.Navigator
              style={{
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                marginTop: 10,
              }}
              screenOptions={{
                tabBarIndicatorStyle: {backgroundColor: '#D2691Eff'},
              }}>
              <Tab.Screen
                name="Bid Post"
                component={Bids}
                options={{
                  tabBarLabel: () => (
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#D2691Eff',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}>
                      {ArabicText?.Bids_on_my_posts}
                    </Text>
                  ),
                }}
              />
              <Tab.Screen
                name="Bid On Post"
                component={BidPost}
                options={{
                  tabBarLabel: () => (
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#D2691Eff',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}>
                      {ArabicText?.offer_Up}
                    </Text>
                  ),
                }}
              />
            </Tab.Navigator>
          </View>
        </View>
      </View>
    );
  }
}