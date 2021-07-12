import React from 'react';
import { Dimensions, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from '../routs/appStack';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const App = props => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  button: {
    margin: width / 20,
    height: width / 2.5,
    width: width / 2.5,
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
});

export default App;
