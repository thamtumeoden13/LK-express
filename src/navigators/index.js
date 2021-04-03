import React, { useReducer, useEffect, useRef, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';

import {
    LoginScreen, RegistrationScreen, AuthLoadingScreen,
    HomeScreen, RoomScreen, ChatScreen, RoomChatScreen
} from '../screens'

const StackAuth = createStackNavigator();

function AuthStack() {
    return (
        <StackAuth.Navigator initialRouteName={"Login"}>
            <StackAuth.Screen name="Login" component={LoginScreen} />
            <StackAuth.Screen name="Registration" component={RegistrationScreen} />
        </StackAuth.Navigator>
    )
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator >
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="HomeDetail" component={ChatScreen} />
        </HomeStack.Navigator>
    );
}

const PublicRoomStack = createStackNavigator();

function PublicRoomStackScreen() {
    return (
        <PublicRoomStack.Navigator>
            <PublicRoomStack.Screen name="PublicRoom" component={RoomScreen} />
            <PublicRoomStack.Screen name="PublicRoomDetail" component={RoomChatScreen} />
        </PublicRoomStack.Navigator>
    );
}

const PrivateRoomStack = createStackNavigator();

function PrivateRoomStackScreen() {
    return (
        <PrivateRoomStack.Navigator>
            <PrivateRoomStack.Screen name="PrivateRoom" component={RoomScreen} />
            <PrivateRoomStack.Screen name="PrivateRoomDetail" component={ChatScreen} />
        </PrivateRoomStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
function TabStack() {
    const isTabBarVisible = (route) => {
        return !['HomeDetail', 'PublicRoomDetail', 'PrivateRoomDetail'].includes(route.name);
    };
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarVisible: isTabBarVisible(route)
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}

        >
            <Tab.Screen name="Home" component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen name="PublicRoom" component={PublicRoomStackScreen}
                options={{
                    tabBarLabel: 'PublicRoom',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                    ),
                    tabBarBadge: 3,
                }}
            />
            <Tab.Screen name="PrivateRoom" component={PrivateRoomStackScreen}
                options={{
                    tabBarLabel: 'PrivateRoom',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const Stack = createStackNavigator();

export default () => {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    )

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('User');
                if (!!userToken) {
                    dispatch({ type: 'RESTORE_TOKEN', token: JSON.stringify(userToken) });
                }
            } catch (e) {
                // Restoring token failed
            }

            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
        };

        bootstrapAsync();
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {state.userToken == null ? (
                    // <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                    <Stack.Screen name="Login" component={AuthStack} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={TabStack} />
                        <Stack.Screen name="RoomChatDetail" component={RoomChatScreen} />
                        <Stack.Screen name="ChatDetail" component={ChatScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer >
    )
}