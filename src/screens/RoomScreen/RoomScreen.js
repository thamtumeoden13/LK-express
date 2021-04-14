import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Container, Tab, Tabs, TabHeading } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';

import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'

import styles from './styles';

const RoomScreen = ({ navigation, route }) => {

    const db = firebase.firestore()
    const entityRef = db.collection('rooms')
    const entityChatRef = db.collection('chats')

    const [state, setState] = useState({
        userID: '',
        userName: '',
        isActivedLocalPushNotify: false
    })
    const [rooms, setRooms] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const focusListener = navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => { return { ...prev, userID: user.id, userName: user.fullName } })
            Promise.all([getCollectionRoomList(user.id), getCollectionChatList(user.id)])
            // getCollectionRoomList(user.id)
            // getCollectionChatList(user.id)
        });
        return () => focusListener
    }, [])

    const getCollectionRoomList = async (userID) => {
        const querySnapshot = await entityRef.get()
        let listFireStore = []
        querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            const room = doc.data()
            const querySnapshot2 = await entityRef
                .doc(`${room.roomID}`)
                .collection('users')
                .where("userID", "==", userID)
                .get()

            if (querySnapshot2.docs.length > 0) {
                listFireStore.push({
                    ...room,
                    name: room.currentUser,
                    subtitle: room.currentMessage,
                    avatar_url: room.currentAvatar,
                })
            }
            console.log('1111111', listFireStore)
            setRooms(listFireStore)
        });
    }

    const getCollectionChatList = async (userID) => {
        const querySnapshot = await entityChatRef.get()
        let listFireStore = []
        querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            const room = doc.data()
            // const querySnapshot2 = await entityChatRef
            //     .doc(`${room.connectID}`)
            //     .collection('users')
            //     .where("userID", "==", userID)
            //     .get()
            const querySnapshot2 = doc.id.split('|')

            if (querySnapshot2.includes(userID)) {
                listFireStore.push({
                    ...room,
                    name: room.currentUser,
                    subtitle: room.currentMessage,
                    avatar_url: room.currentAvatar,
                })
            }
            console.log('222222222', listFireStore)
            setUsers(listFireStore)
        });
    }

    const onHandlerJoinRoom = (roomID) => {
        console.log('onHandlerJoinRoom', roomID)
        const pushAction = StackActions.push('RoomChatDetail', { id: roomID })

        navigation.dispatch(pushAction)
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItem = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#9ede73', '#007580'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginVertical: 5 }}
            containerStyle={{ paddingVertical: 10 }}
            onPress={() => onHandlerJoinRoom(item.roomID)}
        >
            <Avatar rounded source={{ uri: item.avatar_url }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#fff', fontWeight: 'bold' }}>
                    {item.name}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: '#fff' }}>
                    {item.subtitle}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="#fff" />
        </ListItem>
    )

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <Container>
                <Tabs
                    locked
                    tabBarUnderlineStyle={{ backgroundColor: '#00f' }}
                >
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Phòng chat`}</Text>
                                <Badge status='error' value={rooms.length}
                                    containerStyle={{
                                        position: 'absolute', top: 5, right: 5,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    textStyle={{ fontSize: 8 }}
                                />
                            </TabHeading>
                        }
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#eff1f4' }}
                        textStyle={{ fontSize: 12, color: '#000' }}
                        activeTextStyle={{ fontSize: 14, color: '#00f' }}
                    >
                        <FlatList
                            keyExtractor={keyExtractor}
                            data={rooms}
                            renderItem={renderItem}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Bạn bè`}</Text>
                                <Badge status='primary'
                                    value={users.length}
                                    containerStyle={{
                                        position: 'absolute', top: 5, right: 5,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    textStyle={{ fontSize: 8 }}
                                />
                            </TabHeading>
                        }
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#eff1f4' }}
                        textStyle={{ fontSize: 12, color: '#000' }}
                        activeTextStyle={{ fontSize: 14, color: '#00f' }}
                    >
                        <FlatList
                            keyExtractor={keyExtractor}
                            data={users}
                            renderItem={renderItem}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Danh bạ`}</Text>
                                <Badge status='success' value={rooms.length}
                                    containerStyle={{
                                        position: 'absolute', top: 5, right: 5,
                                        justifyContent: 'center', alignItems: 'center',
                                    }}
                                    textStyle={{ fontSize: 8 }}
                                />
                            </TabHeading>
                        }
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#eff1f4' }}
                        textStyle={{ fontSize: 12, color: '#000' }}
                        activeTextStyle={{ fontSize: 14, color: '#00f' }}
                    >
                        <FlatList
                            keyExtractor={keyExtractor}
                            data={rooms}
                            renderItem={renderItem}
                        />
                    </Tab>
                </Tabs>
            </Container>
        </SafeAreaView>
    )
}

export default RoomScreen