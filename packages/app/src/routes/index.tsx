import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import StackRoutes from './stack.routes';

const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
};

export default Router;
