import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer, useRef } from 'react'
import { Alert, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import { decode, encode } from 'base-64'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';

import { LoginScreen, HomeScreen, RegistrationScreen, AuthLoadingScreen, RoomScreen, ChatScreen } from './screens'
import { AuthContext } from './utils'
import { firebase } from './firebase/config'
import { notificationManager } from './utils/NotificationManager'

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

LogBox.ignoreAllLogs()

const StackAuth = createStackNavigator();

function AuthStack(params) {
    return (
        <StackAuth.Navigator initialRouteName={"Login"}>
            <StackAuth.Screen name="Login" component={LoginScreen} />
            <StackAuth.Screen name="Registration" component={RegistrationScreen} />
        </StackAuth.Navigator>
    )
}

const Tab = createBottomTabNavigator();
function TabStack() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="PublicRoom" component={RoomScreen}
                options={{
                    tabBarLabel: 'PublicRoom',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size} />
                    ),
                    tabBarBadge: 3,
                }}
            />
            <Tab.Screen name="PrivateRoom" component={ChatScreen}
                options={{
                    tabBarLabel: 'PrivateRoom',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const Stack = createStackNavigator();

export default function App() {
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

        notificationManager.configure(onRegister, onNotification, onOpenNotification)
    }, [])

    const onRegister = (token) => {
        console.log('[Notification] registered', token)
    }

    const onNotification = (notify) => {
        console.log('[Notification] onNotification', notify)
    }

    const onOpenNotification = (notify) => {
        console.log('[onOpenNotification] registered', notify)
        Alert.alert('Open notification')
    }

    const authContext = React.useMemo(
        () => ({
            signIn: async ({ email, password }) => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `SecureStore`
                // In the example, we'll use a dummy token
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then((response) => {
                        const uid = response.user.uid
                        const usersRef = firebase.firestore().collection('users')
                        usersRef
                            .doc(uid)
                            .get()
                            .then(firestoreDocument => {
                                if (!firestoreDocument.exists) {
                                    alert("User does not exist anymore.")
                                    return;
                                }
                                const user = firestoreDocument.data()
                                AsyncStorage.setItem('User', JSON.stringify(user))
                                dispatch({ type: 'SIGN_IN', token: JSON.stringify(user) });
                            })
                            .catch(error => {
                                alert(error)
                            });
                    })
                    .catch(error => {
                        alert(error)
                    })
            },
            signOut: () => {
                dispatch({ type: 'SIGN_OUT' })
                AsyncStorage.removeItem('User')
            },
            signUp: async (email, password, fullName) => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `SecureStore`
                // In the example, we'll use a dummy token
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((response) => {
                        const uid = response.user.uid
                        const data = {
                            id: uid,
                            email,
                            fullName,
                        };
                        const usersRef = firebase.firestore().collection('users')
                        usersRef
                            .doc(uid)
                            .set(data)
                            .then(async (firestoreDocument) => {
                                const user = firestoreDocument.data()
                                AsyncStorage.setItem('User', JSON.stringify(user))
                                dispatch({ type: 'SIGN_IN', token: JSON.stringify(user) });
                            })
                            .catch((error) => {
                                alert(error)
                            });
                    })
                    .catch((error) => {
                        alert(error)
                    });
            },
        }),
        []
    )

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {state.userToken == null ? (
                        // <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                        <Stack.Screen name="Login" component={AuthStack} />
                    ) : (
                        <Stack.Screen name="Home" component={TabStack} />
                    )}
                </Stack.Navigator>
            </NavigationContainer >
        </AuthContext.Provider>
    );
}