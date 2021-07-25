import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from '../routs/appStack';
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "../store/reducers";

const store = createStore(
  reducers,
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


const App = props => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
