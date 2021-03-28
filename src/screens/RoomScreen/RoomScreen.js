import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '../../firebase/config'

import styles from './styles';

const db = firebase.firestore()
const entityRef = db.collection('rooms')

const RoomScreen = ({ navigation, route }) => {
    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: ''
    })
    const [messages, setMessages] = useState([])


    useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', async () => {

        // });

        // return unsubscribe;
        setTimeout(async () => {
            const roomID = route.params.roomID
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => { return { ...prev, roomID, userID: user.id, userName: user.fullName } })

            entityRef
                .doc(`${roomID}`)
                .collection('messages')
                .onSnapshot((querySnapshot) => {
                    const messagesFireStore = querySnapshot
                        .docChanges()
                        .filter(({ type }) => type === 'added')
                        .map(({ doc }) => {
                            const message = doc.data()
                            console.log('message', message)
                            return {
                                ...message,
                                createdAt: message.createdAt.toDate(),
                                user: { _id: message.user._id, name: message.user.name, }
                            }
                        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    console.log('messagesFireStore', messagesFireStore)
                    appendMessages(messagesFireStore)
                    // querySnapshot.forEach(doc => {
                    //     const entity = doc.data()
                    //     debugger
                    //     console.log('entity', entity)
                    // });
                }, (error) => {
                    Alert.alert(error)
                });
        });
    }, [navigation])

    const appendMessages = useCallback((messages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [messages])

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