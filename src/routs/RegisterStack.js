import React, { Component } from 'react';
import Register from '../screens/Register';
import { createStackNavigator } from '@react-navigation/stack';

const HomeStack = createStackNavigator();

export const RegisterStackScreen = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Register" component={Register}/>
        </HomeStack.Navigator>
    )
}