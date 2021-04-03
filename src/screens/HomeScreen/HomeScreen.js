
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
        avatarURL: ''
    })
    const { signOut } = useContext(AuthContext);

    const handlerSignOut = () => {
        signOut()
        // notificationManager.cancelAllLocalNotification()
    }

    const handlerContinue = () => {
        props.navigation.navigate('ChatDetail', { roomID: state.roomID, tabBarVisible: false })
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
                    onChangeText={roomID => setState(prev => { return { ...prev, roomID } })}
                    placeholder={'Input you room'}
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
                        onPress={() => handlerContinue()}
                    >
                        <Ionicons name="md-arrow-forward-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default HomeScreen