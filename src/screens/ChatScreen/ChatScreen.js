import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'

import styles from './styles';

const db = firebase.firestore()
const entityRef = db.collection('rooms')

const RoomScreen = (props) => {
    // // const focusedOptions = props.descriptors[props.state.routes[state.index].key].options;

    // if (props.tabBarVisible === false) {
    //     return null;
    // }
    
    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: '',
        isActivedLocalPushNotify: false
    })
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setTimeout(async () => {
            const roomID = props.route.params.roomID
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => { return { ...prev, roomID, userID: user.id, userName: user.fullName } })
        })
    }, [])

    useEffect(() => {
        if (!!state.userID && !!state.roomID) {
            getRealtimCollection()
        }
    }, [state.userID, state.roomID])

    const getCollection = () => {
        entityRef
            .doc(`${state.roomID}`)
            .collection('messages')
            .get()
            .then((querySnapshot) => {
                let messagesFireStore = []
                querySnapshot.forEach((doc) => {
                    const message = doc.data()
                    console.log('message', message)
                    console.log('_id: message.user._id', message.user._id)
                    messagesFireStore.push({
                        ...message,
                        createdAt: message.createdAt.toDate(),
                        user: { _id: message.user._id, name: message.user.name, }
                    })
                })

                messagesFireStore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                console.log('messagesFireStore', messagesFireStore)
                appendMessages(messagesFireStore, state.userID)
            }, (error) => {
                Alert.alert(error)
            });
    }

    const getRealtimCollection = () => {
        entityRef
            .doc(`${state.roomID}`)
            .collection('messages')
            .onSnapshot((querySnapshot) => {
                //    const messagesFireStore =  querySnapshot
                //         .docChanges()
                //         .filter(({ type }) => type === 'added')
                //         .map(({ doc }) => {
                //             const message = doc.data()
                //             console.log('message', message)
                //             return {
                //                 ...message,
                //                 createdAt: message.createdAt.toDate(),
                //                 user: { _id: message.user._id, name: message.user.name, }
                //             }
                //         }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                //     console.log('messagesFireStore', messagesFireStore)
                //     appendMessages(messagesFireStore, state.userID)

                let messagesFireStore = []

                querySnapshot.docChanges().forEach(change => {
                    const message = change.doc.data()
                    if (change.type === "added") {
                        console.log("New message: ", change.doc.data());
                        messagesFireStore.push({
                            ...message,
                            createdAt: message.createdAt.toDate(),
                            user: { _id: message.user._id, name: message.user.name, }
                        })
                    }
                    if (change.type === "modified") {
                        console.log("Modified message: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("Removed message: ", change.doc.data());
                    }
                })
                messagesFireStore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                console.log('messagesFireStore', messagesFireStore)
                appendMessages(messagesFireStore, state.userID, state.roomID)
            }, (error) => {
                Alert.alert(error)
            });
    }

    const appendMessages = useCallback((messages, userID, roomID) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log('appendMessages', messages)
        if (!!messages && messages.length > 0 && userID != messages[0].authorID) {
            handlerLocalPushNotify(messages[0], roomID)
        }
    }, [messages])

    const handlerLocalPushNotify = (message, roomID) => {
        const options = {
            soundName: "default",
            playSound: true,
            vibrate: true
        }
        notificationManager.showNotification(
            Math.random(),
            `${roomID}`,
            `${message.text}`,
            {}, // data
            options //options
        )
    }

    const onSend = (messages = []) => {
        const { text, _id, createdAt } = messages[0]
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            _id: _id,
            authorID: state.userID,
            createdAt: createdAt,
            text: text,
            user: {
                _id: state.userID,
                name: state.userName,
            },
        }

        entityRef
            .doc(`${state.roomID}`)
            .collection('messages')
            .doc()
            .set(data)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const chat = <GiftedChat messages={messages} onSend={onSend} user={{ _id: state.userID, name: state.userName }} />
    if (Platform.OS === 'android') {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' KeyboardAvoidingView={30} enabled>
                {chat}
            </KeyboardAvoidingView>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            {chat}
        </SafeAreaView>
    )
}

export default RoomScreen