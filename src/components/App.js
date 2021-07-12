import React from 'react';
import { Dimensions, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from '../routs/appStack';

const App = props => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default App;
