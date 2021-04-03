import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer, useRef } from 'react'
import { Alert, LogBox, AppState, Platform } from 'react-native'
import { decode, encode } from 'base-64'
import AsyncStorage from '@react-native-community/async-storage';
import codePush from "react-native-code-push";
import { PERMISSIONS, request, openSettings, checkMultiple } from 'react-native-permissions';
import RNExitApp from 'react-native-exit-app';
import Toast from 'react-native-toast-message';

import AppContainer from './navigators'

import { ModalCenterAlert } from "./components/common/modal/ModalCenterAlert";
import OpenSetting from './components/app/modalInputForm/OpenSetting';

import { AuthContext } from './utils'
import { firebase } from './firebase/config'
import { notificationManager } from './utils/NotificationManager'

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

LogBox.ignoreAllLogs()

const toastConfig = {
    success_custom: (internalState) => (
        <View style={{
            flexDirection: 'row',
            width: calcWidth('90%'), maxHeight: verticalScale(120),
            backgroundColor: '#fff',
            padding: moderateScale(10),
            borderLeftWidth: scale(10),
            borderTopWidth: scale(1),
            borderRightWidth: scale(1),
            borderBottomWidth: scale(1),
            borderColor: 'limegreen',
            borderTopLeftRadius: scale(10),
            borderBottomLeftRadius: scale(10),
        }}>
            <Icon name='checkcircleo' type='antdesign' color='limegreen' size={scale(12)}
                containerStyle={{
                    justifyContent: 'center',
                    marginRight: moderateScale(10)
                }}

                activeOpacity={0.7}
            />
            <View style={{ paddingHorizontal: moderateScale(10) }}>
                <Text style={{ color: '#000', fontSize: scale(14), fontWeight: 'bold' }} numberOfLines={1}>{internalState.text1}</Text>
                <Text style={{ color: '#000', fontSize: scale(12) }} numberOfLines={4}>{internalState.text2}</Text>
            </View>
        </View>
    ),
    info_custom: (internalState) => (
        <View style={{
            flexDirection: 'row',
            width: calcWidth('90%'), maxHeight: verticalScale(120),
            backgroundColor: '#fff',
            padding: moderateScale(10),
            borderLeftWidth: scale(10),
            borderTopWidth: scale(1),
            borderRightWidth: scale(1),
            borderBottomWidth: scale(1),
            borderColor: 'dodgerblue',
            borderTopLeftRadius: scale(10),
            borderBottomLeftRadius: scale(10),
        }}>
            <Icon name='infocirlceo' type='antdesign' color='dodgerblue' size={scale(12)}
                containerStyle={{
                    justifyContent: 'center',
                    marginRight: moderateScale(10)
                }}

                activeOpacity={0.7}
            />
            <View style={{ paddingHorizontal: moderateScale(10) }}>
                <Text style={{ color: '#000', fontSize: scale(14), fontWeight: 'bold' }} numberOfLines={1}>{internalState.text1}</Text>
                <Text style={{ color: '#000', fontSize: scale(12) }} numberOfLines={4}>{internalState.text2}</Text>
            </View>
        </View>
    ),
    error_custom: (internalState) => (
        <View style={{
            flexDirection: 'row',
            width: calcWidth('90%'), maxHeight: verticalScale(120),
            backgroundColor: '#fff',
            padding: moderateScale(10),
            borderLeftWidth: scale(10),
            borderTopWidth: scale(1),
            borderRightWidth: scale(1),
            borderBottomWidth: scale(1),
            borderColor: 'crimson',
            borderTopLeftRadius: scale(10),
            borderBottomLeftRadius: scale(10),
        }}>
            <Icon name='closecircleo' type='antdesign' color='crimson' size={scale(12)}
                containerStyle={{
                    justifyContent: 'center',
                    marginRight: moderateScale(10)
                }}

                activeOpacity={0.7}
            />
            <View style={{ paddingHorizontal: moderateScale(10) }}>
                <Text style={{ color: '#000', fontSize: scale(14), fontWeight: 'bold' }} numberOfLines={1}>{internalState.text1}</Text>
                <Text style={{ color: '#000', fontSize: scale(12) }} numberOfLines={4}>{internalState.text2}</Text>
            </View>
        </View>
    ),
};

const App = () => {
    const [alert, setAlert] = useState({
        isVisible: false,
        disabledIcon: false,
        modalAlert: {
            type: 'error',
            title: '',
            content: '',
        },
        typeModalInputForm: -1
    })

    useEffect(() => {
        notificationManager.configure(onRegister, onNotification, onOpenNotification)
        const appLocationState = AppState.addEventListener('change', requestLocationPermission)

        return () => {
            appLocationState
            // appLocationState2
            // appPermission
            // handlerOpenURL
            // unsubscribe
        };

    }, [])

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (response !== 'granted') {
                preOpenSettingPermission()
            }
        }
        else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (response !== 'granted') {
                preOpenSettingPermission()
            }
        }
    }

    const preOpenSettingPermission = () => {
        // Alert.alert(
        //     "Vui lòng bật định vị để sử dụng ứng dụng",
        //     "Nhấn Cancel để bỏ qua, nhấn OK để vào cài đặt",
        //     [
        //         {
        //             text: "Cancel",
        //             onPress: () => openSettingPermission(false),
        //             style: "cancel"
        //         },
        //         { text: "OK", onPress: () => openSettingPermission(true) }
        //     ],
        //     { cancelable: false },
        // );
        setAlert(prev => {
            return {
                ...prev,
                isVisible: true,
                modalAlert: { type: 'warning' },
                typeModalInputForm: 1,
                disabledIcon: true
            }
        })
    }
    const openSettingPermission = (status) => {
        setTimeout(() => {
            if (!!status) {
                openSettings()
            }
            else {
                RNExitApp.exitApp();
            }
        }, 500);
    }

    const renderModalInputForm = (typeModalInputForm) => {
        let ModalInputForm
        switch (typeModalInputForm) {
            case 1:
                ModalInputForm = (
                    <OpenSetting
                        openSetting={openSettingPermission}
                    />
                )
                break;
            default:
                ModalInputForm = null
                break;
        }
        return ModalInputForm
    }

    const onCloseModalAlert = () => {
        setAlert(prev => {
            return {
                ...prev,
                isVisible: false,
                modalAlert: {
                    type: 'error',
                    content: ''
                },
                typeModalInputForm: -1
            }
        })
    }

    const restartApp = () => {
        // setTimeout(() => {
        //     Platform.select({
        //         ios: RNRestart.Restart(),
        //         android: RNExitApp.exitApp()
        //     })
        // }, 500);
    }

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
                            avatarURL: avatarURL
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

    const { isVisible, disabledIcon, typeModalInputForm, modalAlert } = alert
    return (
        <>
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            <ModalCenterAlert
                isVisible={isVisible}
                disabledIcon={disabledIcon}
                typeModal={modalAlert.type}
                titleModal={modalAlert.title}
                contentModal={modalAlert.content}
                childComponent={renderModalInputForm(typeModalInputForm)}
                onCloseModalAlert={onCloseModalAlert}
            />
            <AuthContext.Provider value={authContext}>
                <AppContainer />
            </AuthContext.Provider>
        </>
    );
}

// export default App
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default codePush(codePushOptions)(App)