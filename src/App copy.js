import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import CallScreen from './screens/CallScreen'

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Call" component={CallScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}