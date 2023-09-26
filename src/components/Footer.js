import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Notification from '../screens/Notification';
import Header from './Header';
import Addnew from '../screens/Addnew';
import Profile from '../screens/Profile';
import Stack from './Stack';
import * as ArabicText from '../language/EnglishToArabic';

import ChatTopTab from '../screens/chat/ChatTopTab';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Tab.Navigator
      screenOptions={{backgroundColor: '#f8f8ff', unmountOnBlur: true}}>
      <Tab.Screen
        name={ArabicText.home}
        component={Stack}
        options={{
          tabBarIcon: () => <Entypo name="home" size={28} color="#D2691E" />,
          headerShown: false,
          tabBarInactiveTintColor: '#D2691E',
        }}
      />

      <Tab.Screen
        name={ArabicText.notification}
        component={Notification}
        options={{
          tabBarIcon: () => (
            <MaterialIcons
              name="notifications-none"
              size={35}
              color="#D2691E"
            />
          ),
          header: () => <Header />,
          tabBarInactiveTintColor: '#D2691E',
        }}
      />

      <Tab.Screen
        name={ArabicText.addnew}
        component={Addnew}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="plus" size={33} color="#D2691E" />
          ),
          headerShown: false,
          tabBarInactiveTintColor: '#D2691E',
        }}
      />

      <Tab.Screen
        name={ArabicText.message}
        component={ChatTopTab}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="email-outline"
              size={35}
              color="#D2691E"
            />
          ),
          header: () => <Header />,
          tabBarInactiveTintColor: '#D2691E',
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name={ArabicText.profilee}
        component={Profile}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="user" size={25} color="#D2691E" />
          ),
          headerShown: false,
          tabBarInactiveTintColor: '#D2691E',
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
