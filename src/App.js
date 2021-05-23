import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer, useRef } from 'react'
import { Alert, LogBox, AppState, Platform } from 'react-native'
import { decode, encode } from 'base-64'
import codePush from "react-native-code-push";
import { PERMISSIONS, request, openSettings, checkNotifications } from 'react-native-permissions';
import RNExitApp from 'react-native-exit-app';
import Toast from 'react-native-toast-message';

import AppContainer from './navigators'

import { ModalCenterAlert } from "./components/common/modal/ModalCenterAlert";
import OpenSetting from './components/app/modalInputForm/OpenSetting';

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

const App = (props) => {
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

    const [state, setState] = useState({
        locationPermissionDenied: false,
        notificationPermissionDenied: false,
    })

    useEffect(() => {
        notificationManager.configure(onRegister, onNotification, onOpenNotification)
        const appLocationState = AppState.addEventListener('change', requestLocationPermission)
        const appPermission = AppState.addEventListener('change', checkMultiPermission)
        return () => {
            appLocationState
            appPermission
            // handlerOpenURL
            // unsubscribe
        };

    }, [])

    useEffect(() => {
        if (!!state.locationPermissionDenied || !!state.notificationPermissionDenied) {
            preOpenSettingPermission()
        }
    }, [state.locationPermissionDenied, state.notificationPermissionDenied])

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (response !== 'granted') {
                preOpenSettingPermission()
            }
            else {
                onCloseModalAlert()
            }
        }
        else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (response !== 'granted') {
                preOpenSettingPermission()
            }
            else {
                onCloseModalAlert()
            }
        }
    }

    const checkMultiPermission = async () => {
        if (Platform.OS === 'ios') {
            const response1 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            const response2 = await checkNotifications();
            console.log(response1, response2)
            if (response1 !== 'granted' || response2.status !== 'granted') {
                setState(prev => {
                    return {
                        ...prev,
                        locationPermissionDenied: response1 !== 'granted' ? true : false,
                        notificationPermissionDenied: response2 !== 'granted' ? true : false,
                    }
                })
                preOpenSettingPermission()
            }
        }
        else {
            // checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.CAMERA]).then((statuses) => {
            //     console.log('ACCESS_FINE_LOCATION', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
            //     console.log('CAMERA', statuses[PERMISSIONS.ANDROID.CAMERA]);
            // });
            // checkNotifications().then(({ status }) => {
            //     console.log('NOTIFICATION', status);
            // });
        }
    }

    const preOpenSettingPermission = () => {
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
                        locationPermissionDenied={state.locationPermissionDenied}
                        notificationPermissionDenied={state.notificationPermissionDenied}
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
            <AppContainer />
        </>
    );
}

// export default App
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default codePush(codePushOptions)(App)