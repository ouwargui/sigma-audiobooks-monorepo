import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabRoutes from './tab.routes';
import Book from '../screens/book';
import {RootParamList} from './types';
import {useUpdates} from '../hooks/useUpdates';
import Updater from '../screens/updater';

const Stack = createNativeStackNavigator<RootParamList>();

const StackRoutes: React.FC = () => {
  const {finishedUpdating, isDeepLinking} = useUpdates();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!finishedUpdating && !isDeepLinking ? (
        <Stack.Screen name="loading" component={Updater} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="main" component={TabRoutes} />
          <Stack.Screen name="Book" component={Book} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default StackRoutes;
