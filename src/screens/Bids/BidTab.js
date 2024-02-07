import React, {Component} from 'react';
import {View, Text,  TouchableOpacity, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
import BidPost from './BidsDoneByMe';
import Bids from './BidsOnMyPost';
const width = Dimensions.get('screen').width;
const hight = Dimensions.get('screen').height;
const Tab = createMaterialTopTabNavigator();
import * as ArabicText from '../../language/EnglishToArabic';
import { family } from '../../constants/Family';
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
                fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
                        fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
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
                        fontFamily: Platform.OS == 'ios' ? null : family.Neo_Regular,
                      }}>
                      {ArabicText?.offer_Up_bid}
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