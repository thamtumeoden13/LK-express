import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'

import styles from './styles';

const db = firebase.firestore()
const entityRef = db.collection('rooms')

const RoomChatScreen = (props) => {
    // // const focusedOptions = props.descriptors[props.state.routes[state.index].key].options;

    // if (props.tabBarVisible === false) {
    //     return null;
    // }

    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: '',
        avatarURL: '',
        isActivedLocalPushNotify: false,
        isExistsUser: false
    })
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setTimeout(async () => {
            const roomID = props.route.params.roomID
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    roomID, userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL
                }
            })
        })
    }, [])

    useEffect(() => {
        if (!!state.userID && !!state.roomID) {
            getRealtimeCollection()
            getUsersCollection()
        }
    }, [state.userID, state.roomID])

    const getRealtimeCollection = () => {
        entityRef
            .doc(`${state.roomID}`)
            .collection('messages')
            .onSnapshot((querySnapshot) => {

                let messagesFireStore = []
                querySnapshot.docChanges().forEach(change => {
                    const message = change.doc.data()
                    if (change.type === "added") {
                        console.log("New message: ", change.doc.data());
                        messagesFireStore.push({
                            ...message,
                            createdAt: message.createdAt.toDate(),
                            user: {
                                _id: message.user._id,
                                name: message.user.name,
                                avatar: message.user.avatar,
                            }
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

    const getUsersCollection = () => {
        entityRef
            .doc(`${state.roomID}`)
            .collection('users')
            .where("userID", "==", state.userID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        console.log(doc.id, "=>Exists", doc.data());
                        setState(prev => { return { ...prev, isExistsUser: true } })
                        return
                    } else {
                        console.log("No such document!");
                    }
                });
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
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        const currentValue = {
            roomID: state.roomID,
            currentUser: state.userName,
            currentAvatar: state.avatarURL,
            currentMessage: text,
            currentMessageID: _id,
            currentCreatedAt: createdAt
        }
        entityRef.doc(`${state.roomID}`).set(currentValue)
            .then(_doc => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

        if (!state.isExistsUser) {
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

        }

        const data = {
            _id: _id,
            authorID: state.userID,
            createdAt: createdAt,
            text: text,
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

    const chat = <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
            _id: state.userID,
            name: state.userName,
            avatarURL: state.avatarURL
        }} />
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

export default RoomChatScreen