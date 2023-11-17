import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Messages from './Messages';
import Groups from './Groups';
import FriendList from './FriendList';

const ChatTopTab = prop => {
  const TopTab = createMaterialTopTabNavigator();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor: '#D2691E'},
        tabBarLabelStyle: {fontWeight: '600'},
      }}
      initialRouteName="Chat">
      <TopTab.Screen name="Friend list" component={FriendList} />
      <TopTab.Screen name="Groups" component={Groups} />
      <TopTab.Screen name="Chat" component={Messages} />
    </TopTab.Navigator>
  );
};

export default ChatTopTab;

