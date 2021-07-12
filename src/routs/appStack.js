import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Tabs } from './Tabs';
import Login from '../screens/Login';

const Stack = createStackNavigator(

);

const AppStack = () => 
{
    const islogged = true;
    return (
        <Stack.Navigator headerMode="none"
        style={{ backgroundColor: "#c1e1c5"}}>
            {
                islogged ? (
                    <>
                    <Stack.Screen name="AppStack" component={Tabs} />                    
                    </>
                ) : (
                    <>
                    <Stack.Screen name="LogIn" component={Login} />
                    </>
                )
            }
        </Stack.Navigator>
    )
}

export default AppStack;