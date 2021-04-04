
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';

import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import { AuthContext } from '../../utils'
import { notificationManager } from '../../utils/NotificationManager'
import { moderateScale, scale, verticalScale } from 'utils/scaleSize';

const HomeScreen = (props) => {

    const [state, setState] = useState({
        roomID: '',
        userName: '',
        avatarURL: '',
        connectUser: 'ltv3.mrvu@gmail.com'
    })
    const { signOut } = useContext(AuthContext);

    const onHandlerInput = (name, value) => {
        setState(prev => { return { ...prev, [name]: value } })
    }

    const handlerSignOut = () => {
        signOut()
        notificationManager.cancelAllLocalNotification()
    }

    const handlerContinue = (typeRoomName) => {
        props.navigation.navigate(
            `${typeRoomName == 'roomID' ? 'RoomChatDetail' : 'ChatDetail'}`,
            { [typeRoomName]: `${typeRoomName == 'roomID' ? state.roomID : state.connectUser}`, tabBarVisible: false }
        )
    }

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userName: user.fullName,
                    avatarURL: user.avatarURL
                }
            })
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cirle} />
            <View style={{ margintop: verticalScale(64), paddingVertical: verticalScale(20) }}>
                <Image
                    source={!!state.avatarURL ? { uri: state.avatarURL } : require('../../../assets/bootsplash_logo.png')}
                    style={{ width: moderateScale(100), height: moderateScale(100), alignSelf: 'center' }}
                />
            </View>
            <View style={{ marginHorizontal: moderateScale(32) }}>
                <Text style={styles.header}>{`JOIN ROOM`}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: verticalScale(10)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: moderateScale(10) }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={roomID => onHandlerInput('roomID', roomID)}
                            placeholder={'Input you room'}
                            autoCapitalize='none'
                        >
                            {state.roomID}
                        </TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue('roomID')}
                    >
                        <Ionicons name="md-arrow-forward-outline" size={scale(24)} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: moderateScale(32) }}>
                <Text style={styles.header}>{`CONNECT TO`}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: verticalScale(10)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: moderateScale(10) }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={connectUser => onHandlerInput('connectUser', connectUser)}
                            placeholder={'Input you USER'}
                            autoCapitalize='none'

                        >
                            {state.connectUser}
                        </TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue('connectUser')}
                    >
                        <Ionicons name="md-arrow-forward-outline" size={scale(24)} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'column', position: 'absolute', bottom: moderateScale(10), left: moderateScale(10) }} >
                <TouchableOpacity
                    style={styles.continue}
                    onPress={() => handlerSignOut()}
                >
                    <Ionicons name="arrow-undo-outline" size={scale(24)} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen