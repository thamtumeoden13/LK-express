import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

import styles from './styles';

const db = firebase.firestore()
const entityRef = db.collection('chats')

const ProfileScreen = (props) => {
    // // const focusedOptions = props.descriptors[props.state.routes[state.index].key].options;

    // if (props.tabBarVisible === false) {
    //     return null;
    // }

    const [state, setState] = useState({
        connectID: '',
        connectUser: '',
        userID: '',
        userName: '',
        avatarURL: '',
        isActivedLocalPushNotify: false,
        isExistsUser: false,
        document: ''
    })
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setTimeout(async () => {
            const connectUser = props.route.params.id
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    connectUser,
                    userID: user.id,
                    userName: user.fullName,
                    avatarURL: user.avatarURL
                }
            })
        })
    }, [])

    useEffect(() => {
        if (!!state.connectUser) {
            getUsersInfo()
        }
    }, [state.connectUser])

    useEffect(() => {
        if (!!state.userID && !!state.connectID) {
            let document = `${state.connectID}|${state.userID}`
            setTimeout(async () => {
                const isExistsCollectionRevert = await checkExistsCollectionConvert(document)
                console.log('isExistsCollectionRevert', isExistsCollectionRevert)
                if (!isExistsCollectionRevert) {
                    document = `${state.userID}|${state.connectID}`
                }
                setState(prev => { return { ...prev, document } })
                const query = entityRef
                    .doc(`${document}`)
                    .collection('messages')
                const unsubscribe = query.onSnapshot(getRealtimeCollection, err => Alert.alert(error));
                return () => {
                    unsubscribe();
                }
            });
        }
    }, [state.userID, state.connectID])

    const checkExistsCollectionConvert = async (document) => {
        let isExistsCollectionRevert = false
        await entityRef.doc(`${document}`).collection('messages')
            .get()
            .then((querySnapshot) => {
                const docs = querySnapshot.docs
                console.log('checkExistsCollection =>', docs)
                if (!!docs && docs.length > 0) {
                    isExistsCollectionRevert = true
                }
            }).catch((error) => {
                alert(error)
            })
        return isExistsCollectionRevert
    }

    const getRealtimeCollection = (querySnapshot) => {
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
        appendMessages(messagesFireStore, state.userID, state.connectID)
    }

    const getUsersInfo = () => {
        db.collection('users')
            .where("email", "==", state.connectUser)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        console.log("getUsersCollection=>Exists", doc.data());
                        const user = doc.data()
                        setState(prev => { return { ...prev, connectID: user.id } })
                        return
                    } else {
                        console.log("No such document!");
                    }
                });
            }, (error) => {
                Alert.alert(error)
            });
    }

    const appendMessages = useCallback((messages, userID, connectID) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log('appendMessages', messages)
        if (!!messages && messages.length > 0 && userID != messages[0].authorID) {
            handlerLocalPushNotify(messages[0], connectID)
        }
    }, [messages])

    const handlerLocalPushNotify = (message, connectID) => {
        const options = {
            soundName: "default",
            playSound: true,
            vibrate: true
        }
        notificationManager.showNotification(
            Math.random(),
            `${connectID}`,
            `${message.text}`,
            {}, // data
            options //options
        )
    }

    const onSend = (messages = []) => {
        const { text, _id, createdAt } = messages[0]
        // const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        const currentValue = {
            connectID: state.connectID,
            currentUser: state.userName,
            currentAvatar: state.avatarURL,
            currentMessage: text,
            currentMessageID: _id,
            currentCreatedAt: createdAt
        }
        entityRef.doc(`${state.document}`).set(currentValue)
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
            entityRef.doc(`${state.document}`).collection('users')
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
        entityRef.doc(`${state.document}`).collection('messages')
            .doc().set(data)
            .then((doc) => {
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            })
    }
    const renderItem = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#f9f7f7', '#f9f7f7'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginVertical: 5 }}
            containerStyle={{ paddingVertical: 10 }}

        // onPress={() => onHandlerJoinRoom(item.roomID)}
        >
            <Icon name={item.icon} color='#112d4e' />
            <Avatar rounded source={{ uri: item.avatar_url }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#112d4e', fontWeight: 'bold' }}>
                    {item.title}
                </ListItem.Title>
                {/* <ListItem.Subtitle style={{ color: '#fff' }}>
                    {item.subtitle}
                </ListItem.Subtitle> */}
            </ListItem.Content>
            <ListItem.Chevron color="#112d4e" />
        </ListItem>
    )

    const keyExtractor = (item, index) => index.toString()

    const otherSetting = [
        {
            title: 'Đăng xuất',
            icon: 'logout',
            type: "antdesign",
            route: 'LogOut'
        },
        {
            title: 'Cài đặt',
            icon: 'settings',
            type: "feather",
            route: 'Setting'
        },
        {
            title: 'Hướng dẫn sử dụng',
            icon: 'help',
            type: "feather",
            route: 'Help'
        },
    ]
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <FlatList
                keyExtractor={keyExtractor}
                data={otherSetting}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}

export default ProfileScreen