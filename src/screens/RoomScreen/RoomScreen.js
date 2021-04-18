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

const RoomScreen = (props) => {
    const db = firebase.firestore()
    const entityRef = db.collection('rooms')
    const entityChatRef = db.collection('chats')
    const entityUserRef = db.collection('users')

    const [state, setState] = useState({
        userID: '',
        userName: '',
        isActivedLocalPushNotify: false,
        page: 0
    })
    const [rooms, setRooms] = useState([])
    const [usersByChat, setUsersByChat] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => { return { ...prev, userID: user.id, userName: user.fullName } })
            Promise.all([
                getCollectionRoomList(user.id),
                getCollectionChatList(user.id),
                getCollectionUsersList(user.id)
            ])
        });
        return () => focusListener
    }, [])

    const getCollectionRoomList = async (userID) => {
        const querySnapshot = await entityRef.get()
        const reads = querySnapshot.docs.map(async (doc) => {
            const room = doc.data()
            const querySnapshot2 = await entityRef.doc(doc.id).collection('users').where("id", "==", userID).get()
            if (querySnapshot2.docs.length > 0) {
                return {
                    ...room,
                    name: room.currentUser,
                    subtitle: room.currentMessage,
                    avatar_url: room.currentAvatar,
                }
            }
        })
        let result = await Promise.all(reads)
        const rooms = result.filter(e => { return !!e && Object.keys(e).length > 0 });
        setRooms(rooms)
    }

    const getCollectionChatList = async (userID) => {
        const querySnapshot = await entityChatRef.get()
        let users = []
        querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            const user = doc.data()
            const querySnapshot2 = doc.id.split('|')
            if (querySnapshot2.includes(userID)) {
                users.push({
                    ...user,
                    name: user.currentUser,
                    subtitle: user.currentMessage,
                    avatar_url: user.currentAvatar,
                })
                setUsersByChat(users)
            }
        });
    }

    const getCollectionUsersList = async (userID) => {
        const querySnapshot = await entityUserRef.where("id", "!=", userID).get()
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        console.log('users', users)
        setUsers(users)
    }

    const onHandlerJoinRoom = (roomID) => {
        console.log('onHandlerJoinRoom', roomID)
        const pushAction = StackActions.push('RoomChatDetail', { id: roomID })

        props.navigation.dispatch(pushAction)
    }

    const keyExtractor = (item, index) => index.toString()

    const renderItemRoomChat = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#29bb89', '#007580'],
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
                    {item.roomID}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: '#fff' }}>
                    {`${item.name} - ${item.subtitle}`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="#fff" />
        </ListItem>
    )

    const renderItemChat = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#a5ecd7', '#0278ae'],
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
                    {`${item.subtitle}`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="#fff" />
        </ListItem>
    )

    const renderItemUser = ({ item }) => (
        <ListItem
            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
                colors: ['#fdbaf8', '#ffaaa7'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginVertical: 5 }}
            containerStyle={{ paddingVertical: 10 }}
            // onPress={() => onHandlerJoinRoom(item.roomID)}
        >
            <Avatar rounded source={{ uri: item.avatarURL }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#fff', fontWeight: 'bold' }}>
                    {item.email}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: '#fff' }}>
                    {`${item.fullName}`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron name="addusergroup" type='antdesign' color="#fff" />
        </ListItem>
    )

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <Container>
                <Tabs
                    locked
                    tabBarUnderlineStyle={{ backgroundColor: '#00f' }}
                    page={state.page}
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
                            extraData={rooms}
                            renderItem={renderItemRoomChat}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Bạn bè`}</Text>
                                <Badge status='primary'
                                    value={usersByChat.length}
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
                            data={usersByChat}
                            extraData={usersByChat}
                            renderItem={renderItemChat}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Danh bạ`}</Text>
                                <Badge status='success' value={users.length}
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
                            data={users}
                            extraData={users}
                            renderItem={renderItemUser}
                        />
                    </Tab>
                </Tabs>
            </Container>
        </SafeAreaView>
    )
}

export default RoomScreen