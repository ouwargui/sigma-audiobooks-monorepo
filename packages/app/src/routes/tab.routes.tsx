import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import Home from '../screens/home';
import Search from '../screens/search';
import Play from '../screens/play';
import Library from '../screens/library';
import Profile from '../screens/profile';
import ScalableButton from '../components/scalable-button';
import {useNavigation} from '@react-navigation/native';
import {TabParamList} from './types';
import {usePlayer} from '../hooks/usePlayer';

const Tab = createBottomTabNavigator<TabParamList>();

const TabRoutes: React.FC = () => {
  const {currentBook} = usePlayer();
  const navigation = useNavigation();
  const navigateTo = (screenName: string) => {
    navigation.navigate(screenName as never);
  };

  const playDisabled = !currentBook;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarButton: (props) => (
            <ScalableButton {...props} onPress={() => navigateTo('Home')} />
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarButton: (props) => (
            <ScalableButton {...props} onPress={() => navigateTo('Search')} />
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="search"
              size={28}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Play"
        component={Play}
        options={{
          tabBarButton: (props) => (
            <ScalableButton
              disabled={playDisabled}
              {...props}
              onPress={() => navigateTo('Play')}
            />
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'play-circle' : 'play-circle-outline'}
              size={28}
              color={playDisabled ? 'lightgray' : focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          tabBarButton: (props) => (
            <ScalableButton {...props} onPress={() => navigateTo('Library')} />
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'library' : 'library-outline'}
              size={28}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarButton: (props) => (
            <ScalableButton {...props} onPress={() => navigateTo('Profile')} />
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={28}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
