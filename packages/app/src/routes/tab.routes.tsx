import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import Home from '../screens/home';
import Search from '../screens/search';
import Play from '../screens/play';
import Library from '../screens/library';
import Profile from '../screens/profile';
import ScalableButton from '../components/scalable-button';
import {MainNavProps, TabParamList} from './types';
import {usePlayer} from '../hooks/usePlayer';
import {useColorScheme} from '../hooks/useColorScheme';

const Tab = createBottomTabNavigator<TabParamList>();

const TabRoutes: React.FC<MainNavProps> = () => {
  const {isDarkMode} = useColorScheme();
  const focusedColor = isDarkMode ? '#f4f4f5' : '#18181b';
  const unfocusedColor = isDarkMode ? '#a1a1aa' : '#71717a';
  const disabledColor = isDarkMode ? '#4c4c30' : '#d4d4d8';
  const {currentBook} = usePlayer();

  const playDisabled = !currentBook;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#18181b' : '#fff',
          borderTopColor: isDarkMode ? '#2c2c30' : '#a1a1aa',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarButton: (props) => <ScalableButton bottomTabProps={props} />,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={focused ? focusedColor : unfocusedColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarButton: (props) => <ScalableButton bottomTabProps={props} />,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="search"
              size={28}
              color={focused ? focusedColor : unfocusedColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Play"
        component={Play}
        options={{
          tabBarButton: (props) => (
            <ScalableButton disabled={playDisabled} bottomTabProps={props} />
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'play-circle' : 'play-circle-outline'}
              size={28}
              color={
                playDisabled
                  ? disabledColor
                  : focused
                  ? focusedColor
                  : unfocusedColor
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          tabBarButton: (props) => <ScalableButton bottomTabProps={props} />,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'library' : 'library-outline'}
              size={28}
              color={focused ? focusedColor : unfocusedColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarButton: (props) => <ScalableButton bottomTabProps={props} />,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={28}
              color={focused ? focusedColor : unfocusedColor}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
