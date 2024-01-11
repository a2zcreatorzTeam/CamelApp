import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Messages from './Messages';
import Groups from './Groups';
import FriendList from './FriendList';
import * as ArabicText from '../../language/EnglishToArabic';
import BackBtnHeader from '../../components/headerWithBackBtn';

const ChatTopTab = prop => {
  const TopTab = createMaterialTopTabNavigator();

  return (
    <>
      <BackBtnHeader />
      <TopTab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {backgroundColor: '#D2691E'},
          tabBarLabelStyle: {fontWeight: '600'},
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
    </>
  );
};

export default ChatTopTab;
