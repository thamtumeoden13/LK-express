import React, { useReducer, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Keyboard, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';

import {
    LoginScreen, RegistrationScreen, AuthLoadingScreen,
    HomeScreen, ChatScreen, ChatDetailScreen, RoomScreen, RoomChatScreen,
    ProfileScreen,
    CategoryScreen, CategoryDetailScreen, AddCategoryScreen
} from '../screens'

import DrawerIcon from 'components/common/icon/DrawerIcon'
import BackIcon from 'components/common/icon/BackIcon'
import BagIcon from 'components/common/icon/BagIcon'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import DrawerContentComponents from './DrawerContentComponents'

import { AuthContext } from '../utils'
import { firebase } from '../firebase/config'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

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

function HomeStackScreen({ navigation }) {
    return (
        <HomeStack.Navigator initialRouteName="HomeDrawer">
            <HomeStack.Screen
                name="HomeDrawer"
                component={HomeScreen}
                options={{
                    headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Trang chủ`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            {/* <HomeStack.Screen name="HomeDetail" component={ChatScreen} /> */}
        </HomeStack.Navigator>
    );
}

const RoomChatStack = createStackNavigator();

function RoomChatStackScreen({ navigation }) {
    return (
        <RoomChatStack.Navigator initialRouteName="RoomChat">
            <RoomChatStack.Screen
                name="RoomChat"
                component={RoomScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Phòng chat`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <RoomChatStack.Screen
                name="RoomChatDetail"
                component={RoomChatScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <RoomChatStack.Screen
                name="ChatDetail"
                component={ChatDetailScreen}
                options={{
                    headerLeft: () => <BackIcon navigation={navigation} />,
                    // headerTitle: () => <HeaderTitle title={`Phòng chat 111`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
        </RoomChatStack.Navigator>
    );
}

const CategoryStack = createStackNavigator();

function CategoryStackScreen({ navigation }) {
    return (
        <CategoryStack.Navigator initialRouteName="Category">
            <CategoryStack.Screen
                name="Category"
                component={CategoryScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Danh Mục`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <CategoryStack.Screen
                name="CategoryDetail"
                component={CategoryDetailScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Sản phẩm`} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
            <CategoryStack.Screen
                name="AddCategory"
                component={AddCategoryScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Thêm Danh Mục`} />,
                    // headerRight: () => <BagIcon navigation={navigation} />,
                }}
            />
        </CategoryStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen({ navigation }) {
    return (
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    // headerLeft: () => <DrawerIcon navigation={navigation} />,
                    headerRight: () => <BagIcon navigation={navigation} />,
                    headerTitle: () => <HeaderTitle title={`Cá nhân`} />,
                }}
            />
            <ProfileStack.Screen name="ProfileDetail" component={ProfileScreen} />
        </ProfileStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
function TabStack() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
            initialRouteName='Home'
        >
            <Tab.Screen name="Home" component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="home" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/home.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="RoomChat" component={RoomChatStackScreen}
                options={{
                    tabBarLabel: 'Phòng chat',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="battlenet" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/chat.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    tabBarBadge: 3,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="Category" component={CategoryStackScreen}
                options={{
                    tabBarLabel: 'Danh mục',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/products.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                    tabBarBadge: 5,
                    tabBarBadgeStyle: { backgroundColor: 'tomato', color: '#fff' }
                }}
            />
            <Tab.Screen name="Profile" component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ color, size }) => (
                        // <MaterialCommunityIcons name="account-settings-outline" color={color} size={size} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                source={require('@assets/animations/profile.json')}
                                colorFilters={[{
                                    keypath: "button",
                                    color: "#F00000"
                                }, {
                                    keypath: "Sending Loader",
                                    color: "#F00000"
                                }]}
                                style={{ width: scale(30), height: scale(30), justifyContent: 'center' }}
                                autoPlay
                                loop
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const Drawer = createDrawerNavigator();
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

    const authContext = React.useMemo(
        () => ({
            signIn: async ({ email, password }) => {
                console.log('email, password', email, password)
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
                                console.log('JSON.stringify(user)', JSON.stringify(user))
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
            signUp: async (email, password, fullName, avatarURL) => {
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
                            avatarURL: avatarURL,
                            level: 2
                        };
                        const usersRef = firebase.firestore().collection('users')
                        usersRef
                            .doc(uid)
                            .set(data)
                            .then(async () => {
                                // const user = firestoreDocument.data()
                                await AsyncStorage.setItem('User', JSON.stringify(data))
                                dispatch({ type: 'SIGN_IN', token: JSON.stringify(data) });
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
                <Drawer.Navigator
                    screenOptions={{ headerShown: false }}
                    drawerContent={props => <DrawerContentComponents {...props} />}
                >
                    {state.userToken == null ? (
                        // <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                        <Drawer.Screen name="Login" component={AuthStack} />
                    ) : (
                        <>
                            <Drawer.Screen name="Home" component={TabStack} />
                            <Drawer.Screen name="RoomChatDetail" component={RoomChatScreen} />
                            <Drawer.Screen name="ChatDetail" component={ChatScreen} />
                        </>
                    )}
                </Drawer.Navigator>
            </NavigationContainer >
        </AuthContext.Provider>
    )
}