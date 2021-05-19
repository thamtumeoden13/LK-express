import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react'
import {
    FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity,
    View, KeyboardAvoidingView, Alert, ScrollView, Platform
} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet, {
    addHasReachedTopListener,
    removeHasReachedTopListener,
} from "react-native-actions-sheet";
import TouchableScale from 'react-native-touchable-scale';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { firebase } from '../../firebase/config'
import { notificationManager } from 'utils/NotificationManager'
import HeaderTitle from 'components/common/Header/HeaderTitle'
import ActionSheetIcon from 'components/common/icon/ActionSheetIcon'

import styles from './styles';
import { scale } from 'utils/scaleSize';

function Difference(arr = [], oarr = []) {
    return arr.reduce((t, v) => oarr.find(e => { return e.email == v.email }) ? t : [...t, v], []);
}

const RoomChatScreen = ({ route, navigation }) => {

    const db = firebase.firestore()
    const entityRef = db.collection('rooms')
    const entityUserRef = db.collection('users')

    const actionSheetRef = useRef();
    const scrollViewRef = useRef();

    const [state, setState] = useState({
        roomID: '',
        userID: '',
        userName: '',
        avatarURL: '',
        isActivedLocalPushNotify: false,
        level: '',
        actionSheetType: 0,
        latitude: null,//10.851836,
        longitude: null,//106.797520
        geolocation: '',
    })
    const [usersExists, setUsersExists] = useState([])
    const [users, setUsers] = useState([])
    const [otherUsers, setOtherUsers] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const options = {
            soundName: "default",
            playSound: true,
            vibrate: true
        }
        notificationManager.showNotificationSchedule(
            Math.random(),
            `Alert`,
            `Time to launch`,
            `${new Date()}`,
            {}, // data
            options //options
        )
        setTimeout(async () => {
            const roomID = route.params.id
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    roomID,
                    userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL,
                    level: user.level,
                }
            })
        })
        localCurrentPosition()
        addHasReachedTopListener(onHasReachedTop);
        return () => {
            removeHasReachedTopListener(onHasReachedTop);
        };
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTitle title={`${state.roomID}`} />,
            headerRight: () => null,
        });
    }, [navigation, state.roomID])

    useEffect(() => {
        console.log('state.level', state.level)
        if (state.level == 1) {
            navigation.setOptions({
                headerRight: () => <ActionSheetIcon navigation={navigation} onOpen={() => actionSheetRef.current?.show()} />,
            });
        }
    }, [state.level])

    useEffect(() => {
        if (!!state.userID && !!state.roomID) {
            Promise.all([getCollectionUsersExistsList(), getCollectionUsersList()])
            const query = entityRef
                .doc(`${state.roomID}`)
                .collection('messages')
            const unsubscribe = query.onSnapshot(getRealtimeCollection, err => Alert.alert(error));
            return () => {
                unsubscribe();
            }
        }
    }, [state.userID, state.roomID])

    useEffect(() => {
        if (!!users && !!usersExists) {
            const newArray = Difference(users, usersExists)
            setOtherUsers(newArray)
        }
    }, [users, usersExists])

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

    const getRealtimeCollection = (querySnapshot) => {
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
    }

    const getCollectionUsersExistsList = async () => {
        const querySnapshot = await entityRef.doc(state.roomID).collection('users').get()
        const reads = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        console.log('reads', reads)
        setUsersExists(reads)
    }

    const getCollectionUsersList = async (userID) => {
        const querySnapshot = await entityUserRef.get()
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        console.log('users', users)
        setUsers(users)
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

        const data = {
            _id: _id,
            authorID: state.userID,
            createdAt: createdAt,
            text: text,
            geolocation: state.geolocation,
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

    const onAddUser = (user) => {
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        entityRef.doc(`${state.roomID}`).collection('users')
            .doc().set(user)
            .then(_doc => {
                getCollectionUsersExistsList()
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })

    }

    const onRemoveUser = (user) => {
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        entityRef.doc(`${state.roomID}`).collection('users')
            .doc(user.doc).delete()
            .then(_doc => {
                getCollectionUsersExistsList()
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

    const localCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setState(prev => {
                    return {
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        geolocation: `${position.coords.latitude},${position.coords.longitude}`,
                    }
                })
                console.log('geolocation', `${position.coords.latitude},${position.coords.longitude}`)
            },
            (error) => {
                setState(prev => {
                    return {
                        ...prev,
                        latitude: null,//10.851836,
                        longitude: null,//106.797520
                        geolocation: state.geolocation,
                    }
                })
                console.log('geolocation-error', error)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
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
    const actionSheet = <ActionSheet
        initialOffsetFromBottom={0.6}
        ref={actionSheetRef}
        onOpen={onOpen}
        statusBarTranslucent
        bounceOnOpen={true}
        bounciness={4}
        gestureEnabled={true}
        onClose={onClose}
        defaultOverlayOpacity={0.3}
    >
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
            style={styles.scrollview}
        >
            <View style={styles.containerActionSheet}>
                {usersExists.map((item, index) => (
                    <TouchableScale
                        // style={style.button}
                        // onPress={() => selectPhotoTapped(item, index)}
                        activeScale={0.9}
                        key={`${item.email.toString()}-${index.toString()}`}
                    >
                        <View style={{
                            backgroundColor: '#fe8a71', width: '100%',
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                            paddingVertical: scale(10),
                            marginVertical: scale(5),
                            borderRadius: scale(10)
                        }}>
                            <Text style={{ color: '#0e9aa7', padding: scale(5), width: '80%' }}>{item.email}</Text>
                            <TouchableScale
                                activeScale={2}
                                key={index}
                                style={{
                                    // width: scale(20),
                                    // height: scale(20),
                                    // borderRadius: scale(10),
                                    // backgroundColor: '#fe8a71',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    actionSheetRef.current?.hide();
                                    onRemoveUser(item)
                                }}
                            >
                                <AntDesignIcon
                                    name='minus'
                                    size={scale(16)}
                                    color='#0e9aa7'
                                />
                            </TouchableScale>
                        </View>
                    </TouchableScale>
                ))}
                {otherUsers.map((item, index) => (
                    <TouchableScale
                        // style={style.button}
                        // onPress={() => selectPhotoTapped(item, index)}
                        activeScale={0.9}
                        key={`${item.email.toString()}-${index.toString()}`}
                    >
                        <View style={{
                            backgroundColor: '#f6cd61',
                            width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                            paddingVertical: scale(10),
                            marginVertical: scale(5),
                            borderRadius: scale(10)
                        }}>
                            <Text style={{ width: '80%', color: '#4a4e4d', padding: scale(5) }}>{item.email}</Text>
                            <TouchableScale
                                activeScale={2}
                                onPress={() => {
                                    actionSheetRef.current?.hide();
                                    onAddUser(item)
                                }}
                                key={index}
                                style={{
                                    // width: scale(20),
                                    // height: scale(20),
                                    // borderRadius: scale(10),
                                    backgroundColor: '#f6cd61',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <AntDesignIcon
                                    name='plus'
                                    size={scale(16)}
                                    color='#0e9aa7'
                                />
                            </TouchableScale>
                        </View>
                    </TouchableScale>
                ))}
            </View>
            {/*  Add a Small Footer at Bottom */}
            <View style={styles.footer} />
        </ScrollView>
    </ActionSheet>
    // if (Platform.OS === 'android') {
    //     return (
    //         <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' KeyboardAvoidingView={30} enabled>
    //             {chat}
    //             {actionSheet}
    //         </KeyboardAvoidingView>
    //     )
    // }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            {chat}
            {actionSheet}
        </SafeAreaView>
    )
}

export default RoomChatScreen