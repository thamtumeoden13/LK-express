
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';

import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage';

import { firebase } from '../../firebase/config'
import styles from './styles';
import { AuthContext } from '../../utils'
import { notificationManager } from '../../utils/NotificationManager'

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
            <View style={{ margintop: 64, paddingVertical: 20 }}>
                <Image
                    source={!!state.avatarURL ? { uri: state.avatarURL } : require('../../../assets/bootsplash_logo.png')}
                    style={{ width: 100, height: 100, alignSelf: 'center' }}
                />
            </View>
            <View style={{ marginHorizontal: 32 }}>
                <Text style={styles.header}>{`JOIN ROOM`}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={roomID => onHandlerInput('roomID', roomID)}
                    placeholder={'Input you room'}
                    autoCapitalize='none'
                >
                    {state.roomID}
                </TextInput>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerSignOut()}
                    >
                        <Ionicons name="arrow-undo-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue('roomID')}
                    >
                        <Ionicons name="md-arrow-forward-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: 32 }}>
                <Text style={styles.header}>{`CONNECT TO`}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={connectUser => onHandlerInput('connectUser', connectUser)}
                    placeholder={'Input you USER'}
                    autoCapitalize='none'

                >
                    {state.connectUser}
                </TextInput>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerSignOut()}
                    >
                        <Ionicons name="arrow-undo-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue('connectUser')}
                    >
                        <Ionicons name="md-arrow-forward-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default HomeScreen