import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Messages from './Messages';
import Groups from './Groups';
import FriendList from './FriendList';
import * as ArabicText from '../../language/EnglishToArabic';
import BackBtnHeader from '../../components/headerWithBackBtn';
import {View} from 'react-native';
import {family} from '../../constants/Family';

const ChatTopTab = prop => {
  const TopTab = createMaterialTopTabNavigator();

  return (
    <View style={{flex: 1, backgroundColor: '#d2691e'}}>
      <BackBtnHeader />
      <TopTab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {backgroundColor: '#D2691E'},
          tabBarLabelStyle: {
            fontFamily: family.Neo_Medium,
          },
        }}
        initialRouteName="Chat">
        <TopTab.Screen
          options={{tabBarLabel: ArabicText.friendlist}}
          name="Friend list"
          component={FriendList}
        />
        <TopTab.Screen
          options={{tabBarLabel: ArabicText.groups}}
          name="Groups"
          component={Groups}
        />
        <TopTab.Screen
          options={{tabBarLabel: ArabicText.chat}}
          name="Chat"
          component={Messages}
        />
      </TopTab.Navigator>
    </View>
  );
};

export default ChatTopTab;
