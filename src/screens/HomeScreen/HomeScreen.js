
import React, { useContext, useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native'
import AntDesignIcons from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import { AuthContext } from '../../utils'
import { notificationManager } from '../../utils/NotificationManager'
import { moderateScale, scale, verticalScale } from 'utils/scaleSize';
import { firebase } from '../../firebase/config'

const HomeScreen = (props) => {

    const db = firebase.firestore()
    const entityRef = db.collection('rooms')

    const { signOut } = useContext(AuthContext);
    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: '',
        avatarURL: '',
        connectUser: '',
        level: ''
    })

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL,
                    level: user.level
                }
            })
        })
    }, [])


    const onHandlerInput = (name, value) => {
        setState(prev => { return { ...prev, [name]: value } })
    }

    const handlerSignOut = () => {
        signOut()
        notificationManager.cancelAllLocalNotification()
    }

    const handlerContinue = (typeRoomName) => {
        if (typeRoomName == 'roomID') {
            if (state.level == 1) {
                onSend()
                props.navigation.navigate(`RoomChat`, { 'id': state.roomID })
            } else {
                props.navigation.navigate(`RoomChatDetail`, { 'id': state.roomID })
            }

        } else {
            props.navigation.navigate(`ChatDetail`, { 'id': state.userID })
        }
    }

    const onSend = () => {
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const _id = 1
        const currentValue = {
            roomID: state.roomID,
            currentUser: state.userName,
            currentAvatar: state.avatarURL,
            currentMessage: 'Hello, World!',
            currentMessageID: _id,
            currentCreatedAt: new Date()
        }
        entityRef.doc(`${state.roomID}`).set(currentValue)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

        const user = {
            userID: state.userID,
            userName: state.userName
        }
        entityRef.doc(`${state.roomID}`).collection('users')
            .doc().set(user)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })


        const data = {
            _id: _id,
            authorID: state.userID,
            createdAt: new Date(),
            text: 'Hello, World!',
            user: {
                _id: state.userID,
                name: state.userName,
                avatar: state.avatarURL
            },
        }
        entityRef.doc(`${state.roomID}`).collection('messages')
            .doc().set(data)
            .then((doc) => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })
    }

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
                <Text style={styles.header}>{state.level == 1 ? `Tạo phòng` : `Vào phòng`}</Text>
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
                            placeholder={'Nhập ID phòng'}
                            autoCapitalize='none'
                        >
                            {state.roomID}
                        </TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue('roomID')}
                    >
                        <AntDesignIcons name={state.level == 1 ? "plus" : "arrowright"} size={scale(24)} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginHorizontal: moderateScale(32) }}>
                <Text style={styles.header}>{`Kết nối`}</Text>
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
                            placeholder={'Nhập tên'}
                            autoCapitalize='none'
                        >
                            {state.connectUser}
                        </TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue('connectUser')}
                    >
                        <AntDesignIcons name="sharealt" size={scale(24)} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'column', position: 'absolute', bottom: moderateScale(10), left: moderateScale(10) }} >
                <TouchableOpacity
                    style={styles.continue}
                    onPress={() => handlerSignOut()}
                >
                    <IonIcons name="arrow-undo-outline" size={scale(24)} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen