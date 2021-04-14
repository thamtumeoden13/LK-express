import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react'
import {
    FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity,
    View, KeyboardAvoidingView, Alert, ScrollView
} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet, {
    addHasReachedTopListener,
    removeHasReachedTopListener,
} from "react-native-actions-sheet";

import { firebase } from '../../firebase/config'
import { notificationManager } from 'utils/NotificationManager'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import ActionSheetIcon from 'components/common/icon/ActionSheetIcon'

import styles from './styles';

const items = [
    100,
    60,
    150,
    200,
    170,
    80,
    41,
    101,
    61,
    151,
    202,
    172,
    82,
    43,
    103,
    64,
    155,
    205,
    176,
    86,
    46,
    106,
    66,
    152,
    203,
    173,
    81,
    42,
];
const RoomChatScreen = ({ route, navigation }) => {

    const db = firebase.firestore()
    const entityRef = db.collection('rooms')

    const actionSheetRef = useRef();
    const scrollViewRef = useRef();

    const onHasReachedTop = hasReachedTop => {
        if (hasReachedTop)
            scrollViewRef.current?.setNativeProps({
                scrollEnabled: hasReachedTop,
            });
    };

    const onClose = () => {
        scrollViewRef.current?.setNativeProps({
            scrollEnabled: false,
        });
    };

    const onOpen = () => {
        scrollViewRef.current?.setNativeProps({
            scrollEnabled: false,
        });
    };
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
            const roomID = route.params.id
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
        addHasReachedTopListener(onHasReachedTop);
        return () => {
            removeHasReachedTopListener(onHasReachedTop);
        };
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTitle title={`${state.roomID}`} />,
            headerRight: () => <ActionSheetIcon navigation={navigation} onOpen={() => actionSheetRef.current?.show()} />,
        });
    }, [navigation, state.roomID])

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

    const handlerLongPressMessage = (action, message) => {
        console.log('handlerLongPressMessage', message)
        actionSheetRef.current?.show()
    }

    const options = [
        'Cancel',
        'Apple',
        <Text style={{ color: 'yellow' }}>Banana</Text>,
        'Watermelon',
        <Text style={{ color: 'red' }}>Durian</Text>
    ]

    const chat = <GiftedChat
        messages={messages}
        user={{
            _id: state.userID,
            name: state.userName,
            avatarURL: state.avatarURL
        }}
        onSend={onSend}
        onLongPress={handlerLongPressMessage}
        onPressAvatar={() => Alert.alert('yyy')}
    />
    // if (Platform.OS === 'android') {
    //     return (
    //         <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' KeyboardAvoidingView={30} enabled>
    //             {chat}
    //         </KeyboardAvoidingView>
    //     )
    // }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            {chat}
            <ActionSheet
                initialOffsetFromBottom={0.6}
                ref={actionSheetRef}
                onOpen={onOpen}
                statusBarTranslucent
                bounceOnOpen={true}
                bounciness={4}
                gestureEnabled={true}
                onClose={onClose}
                defaultOverlayOpacity={0.3}>
                <ScrollView
                    ref={scrollViewRef}
                    nestedScrollEnabled={true}
                    onScrollEndDrag={() =>
                        actionSheetRef.current?.handleChildScrollEnd()
                    }
                    onScrollAnimationEnd={() =>
                        actionSheetRef.current?.handleChildScrollEnd()
                    }
                    onMomentumScrollEnd={() =>
                        actionSheetRef.current?.handleChildScrollEnd()
                    }
                    style={styles.scrollview}>
                    <View style={styles.container}>
                        {['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'].map(
                            color => (
                                <TouchableOpacity
                                    onPress={() => {
                                        actionSheetRef.current?.hide();
                                    }}
                                    key={color}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 100,
                                        backgroundColor: color,
                                    }}
                                />
                            ),
                        )}
                    </View>

                    <TextInput
                        style={styles.input}
                        multiline={true}
                        placeholder="Write your text here"
                    />

                    <View>
                        {items.map(item => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => {
                                    actionSheetRef.current?.hide();
                                }}
                                style={styles.listItem}>
                                <View
                                    style={{
                                        width: item,
                                        height: 15,
                                        backgroundColor: '#f0f0f0',
                                        marginVertical: 15,
                                        borderRadius: 5,
                                    }}
                                />

                                <View style={styles.btnLeft} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/*  Add a Small Footer at Bottom */}
                    <View style={styles.footer} />
                </ScrollView>
            </ActionSheet>
        </SafeAreaView>
    )
}

export default RoomChatScreen