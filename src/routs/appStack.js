import React from 'react';
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';
import { Tabs } from './Tabs';
import Login from '../screens/Login';

const Stack = createStackNavigator(

);

const AppStack = () => 
{
    const user = useSelector((state) => state.user);
    console.log(user);
    //const islogged = true;
    return (
        <Stack.Navigator headerMode="none"
        style={{ backgroundColor: "#c1e1c5"}}>
            {
                user ? (
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