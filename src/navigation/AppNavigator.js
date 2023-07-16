import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import UserMain from '../screens/UserMain';
import SecurityMain from '../screens/SecurityMain';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={'Splash'} component={Splash} options={{ headerShown: false }} />
                <Stack.Screen name={'Signup'} component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name={'Login'} component={Login} options={{ headerShown: false }} />
                <Stack.Screen name={'UserMain'} component={UserMain} options={{ headerShown: false }} />
                <Stack.Screen name={'SecurityMain'} component={SecurityMain} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;