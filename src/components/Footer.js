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
import Stack from '../routes/Stack';
import * as ArabicText from '../language/EnglishToArabic';

import ChatTopTab from '../screens/chat/ChatTopTab';
import {Platform} from 'react-native';
import {family} from '../constants/Family';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={ArabicText.home}
      screenOptions={{
        backgroundColor: '#f8f8ff',
        unmountOnBlur: true,
        tabBarLabelStyle: {
          fontSize: 12,
          tabBarInactiveTintColor: '#D2691E',
          marginBottom: Platform.OS == 'ios' ? 0 : 4,
          fontFamily: family.Neo_Medium,
        },
        tabBarStyle: {
          height: Platform.OS == 'ios' ? 90 : 60, // Adjust the height as needed
        },
        tabBarIconStyle: {
          marginTop: Platform.OS == 'ios' ? 6 : 2, // Adjust icon margin as needed
        },
      }}>
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
              size={28}
              color="#D2691E"
            />
          ),
          headerShown: false,
          tabBarInactiveTintColor: '#D2691E',
        }}
      />

      <Tab.Screen
        name={ArabicText.addnew}
        component={Addnew}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="plus" size={32} color="#D2691E" />
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
              size={28}
              color="#D2691E"
            />
          ),
          headerShown: false,
          tabBarInactiveTintColor: '#D2691E',
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name={ArabicText.profilee}
        component={Profile}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="user" size={23} color="#D2691E" />
          ),
          headerShown: false,
          tabBarInactiveTintColor: '#D2691E',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
