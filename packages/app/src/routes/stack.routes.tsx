import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabRoutes from './tab.routes';
import Book from '../screens/book';
import {RootParamList} from './types';

const Stack = createNativeStackNavigator<RootParamList>();

const StackRoutes: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="main" component={TabRoutes} />
      <Stack.Screen name="Book" component={Book} />
    </Stack.Navigator>
  );
};

export default StackRoutes;
