import React from 'react';
import {Text} from 'react-native';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import StackRoutes from './stack.routes';
import * as Linking from 'expo-linking';
import {RootParamList} from './types';
import {useUpdates} from '../hooks/useUpdates';

const Router: React.FC = () => {
  const {setIsDeepLinking} = useUpdates();
  const linking: LinkingOptions<RootParamList> = {
    prefixes: [Linking.createURL('/'), 'https://audiobooks.guisantos.dev/app'],
    config: {
      screens: {
        Book: 'book/:id',
      },
      initialRouteName: 'main',
    },
    subscribe(listener) {
      const onReceiveURL = ({url}: {url: string}) => {
        listener(url);
        setIsDeepLinking(true);
      };

      const subscription = Linking.addEventListener('url', onReceiveURL);

      return () => subscription.remove();
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <StackRoutes />
    </NavigationContainer>
  );
};

export default Router;
