
import React, { useContext, useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Keyboard, Alert } from 'react-native'
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
    const entityUserRef = db.collection('users')
    const entityChatRef = db.collection('chats')

    const { signOut } = useContext(AuthContext);
    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: '',
        avatarURL: '',
        connectUser: '',
        level: '',
        user: {},
        userConnect: {}
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
                    level: user.level,
                    email: user.email,
                    user: user
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

    const handlerContinue = async (typeRoomName) => {
        if (typeRoomName == 'roomID') {
            if (!state.roomID || state.roomID.length <= 0) {
                Alert.alert('Vui lòng nhập tên phòng')
                return
            }
            if (state.level == 1) {
                onCreateNewGoup()
                props.navigation.navigate(`RoomChat`, { page: 0 })
                return
            }
            props.navigation.navigate(`RoomChatDetail`, { 'id': state.roomID })
            return
        }

        if (!state.connectUser || state.connectUser.length <= 0) {
            Alert.alert('Vui lòng nhập tên tài khoản')
            return
        }
        const usersConnect = await getUsersInfo(state.connectUser)
        const userConnect = !!usersConnect ? usersConnect[0] : {}
        setState(prev => { return { ...prev, usersConnect } })
        if (!!userConnect && Object.keys(userConnect).length > 0) {
            let document = `${userConnect.id}|${state.userID}`
            let documentRevert = `${state.userID}|${userConnect.id}`
            const isExistsCollection = await checkExistsCollection(document, documentRevert)
            console.log('isExistsCollection', isExistsCollection)
            if (!isExistsCollection) {
                onCreateNewConnect(state.user, userConnect)
                return
            }
            props.navigation.navigate(`RoomChat`, { page: 1 })
            return
        }
        Alert.alert(`Không tồn tại ${state.connectUser}`)
    }

    const checkExistsCollection = async (document, documentRevert) => {
        // const reads = [document, documentRevert].map(doc => entityChatRef.doc(doc).collection('messages').get())
        // let result = await Promise.all(reads)

        const isExistsCollection = await entityChatRef.doc(document).collection('messages').get()
        const isExistsCollectionRevert = await entityChatRef.doc(documentRevert).collection('messages').get()
        console.log('isExistsCollection', isExistsCollection.docs.length)
        console.log('isExistsCollectionRevert', isExistsCollectionRevert.docs.length)
        return isExistsCollection.docs.length > 0 || isExistsCollectionRevert.docs.length > 0
    }


    const getUsersInfo = async () => {
        const querySnapshot = await entityUserRef.where("email", "==", state.connectUser).get()
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        return users
    }

    const onCreateNewGoup = () => {
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

        entityRef.doc(`${state.roomID}`).collection('users')
            .doc().set(state.user)
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
                props.navigation.navigate(`RoomChat`, { page: 0 })
            })
            .catch((error) => {
                alert(error)
            })
    }

    const onCreateNewConnect = (user, userConnect) => {
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const _id = 1
        const currentValue = {
            currentID: user.id,
            currentUser: user.email,
            currentAvatar: user.avatarURL,
            currentMessage: 'Hello, World!',
            currentMessageID: _id,
            currentCreatedAt: new Date()
        }
        const document = `${user.id}|${userConnect.id}`
        entityChatRef.doc(document).set(currentValue)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

        entityChatRef.doc(document).collection('users')
            .doc().set(user)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

        entityChatRef.doc(document).collection('users')
            .doc().set(userConnect)
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

        entityChatRef.doc(document).collection('messages')
            .doc().set(data)
            .then((doc) => {
                Keyboard.dismiss()
                props.navigation.navigate(`RoomChat`, { page: 1 })
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
                {/* <Text style={{ alignSelf: 'center' }}>{state.userID}</Text> */}
                <Text style={{ alignSelf: 'center' }}>{state.email}</Text>
            </View>
            {state.level == 1 && <View style={{ marginHorizontal: moderateScale(32) }}>
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
            }

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
                            placeholder={'Nhập tên bạn bè'}
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