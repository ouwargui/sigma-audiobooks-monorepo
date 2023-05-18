import React from 'react';
import {Text} from 'react-native';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import StackRoutes from './stack.routes';
import * as Linking from 'expo-linking';
import {RootParamList} from './types';

const Router: React.FC = () => {
  const linking: LinkingOptions<RootParamList> = {
    prefixes: [Linking.createURL('/'), 'https://audiobooks.guisantos.dev/app'],
    config: {
      screens: {
        Book: 'book/:id',
      },
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <StackRoutes />
    </NavigationContainer>
  );
};

export default Router;
