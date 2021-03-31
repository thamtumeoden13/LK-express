
import React, { useContext } from 'react';
import { useState } from 'react';

import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { firebase } from '../../firebase/config'
import styles from './styles';
import { AuthContext } from '../../utils'
import { notificationManager } from '../../utils/NotificationManager'

const HomeScreen = (props) => {

    const [state, setState] = useState({
        roomID: ''
    })
    const { signOut } = useContext(AuthContext);

    const handlerSignOut = () => {
        signOut()
        // notificationManager.cancelAllLocalNotification()
    }

    const handlerContinue = () => {
        props.navigation.navigate('PublicRoom', { roomID: state.roomID })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cirle} />
            <View style={{ margintop: 64 }}>
                <Image
                    source={require('../../../assets/bootsplash_logo.png')}
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