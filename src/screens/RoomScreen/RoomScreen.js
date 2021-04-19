import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Container, Tab, Tabs, TabHeading } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale/vi'


import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'

import styles from './styles';
import { scale, verticalScale } from 'utils/scaleSize';

const RoomScreen = (props) => {
    const db = firebase.firestore()
    const entityRef = db.collection('rooms')
    const entityChatRef = db.collection('chats')
    const entityUserRef = db.collection('users')

    const [state, setState] = useState({
        userID: '',
        connectID: '',
        userName: '',
        isActivedLocalPushNotify: false,
        user: {},
        page: 0
    })
    const [rooms, setRooms] = useState([])
    const [usersByChat, setUsersByChat] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                    user: user
                }
            })
            Promise.all([
                getCollectionRoomList(user.id),
                getCollectionChatList(user.id),
                getCollectionUsersList(user.id)
            ])
        });
        return () => focusListener
    }, [])

    useEffect(() => {
        if (!!users && !!usersByChat) {
            usersByChat.map(e => {
                const find = users.find(f => e.connectID == f.id)
                e.userConnect = find
                return e
            })
            setUsersByChat(usersByChat)
            console.log('usersByChat', usersByChat)
        }
    }, [users, usersByChat])

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
                    avatarURL: room.currentAvatar,
                }
            }
        })
        let result = await Promise.all(reads)
        const rooms = result.filter(e => { return !!e && Object.keys(e).length > 0 });
        setRooms(rooms)
        console.log('rooms', rooms)
    }

    const getCollectionChatList = async (userID) => {
        const querySnapshot = await entityChatRef.get()
        let users = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const user = doc.data()
            const docID = doc.id
            const querySnapshot2 = doc.id.split('|')
            if (querySnapshot2.includes(userID)) {
                const connectID = querySnapshot2.find(e => e != userID)
                users.push({
                    ...user,
                    docID: docID,
                    connectID: connectID,
                    name: user.currentUser,
                    subtitle: user.currentMessage,
                    avatarURL: user.currentAvatar,
                })
            }
        });
        console.log('getCollectionChatList', users)
        setUsersByChat(users)
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

    const onHandlerConnectRoom = (docID) => {
        console.log('onHandlerConnectRoom', docID)
        const pushAction = StackActions.push('ChatDetail', { id: docID })
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
                colors: ['#007580', '#007580'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginTop: verticalScale(5) }}
            containerStyle={{ paddingVertical: verticalScale(10) }}
            onPress={() => onHandlerJoinRoom(item.roomID)}
        >
            <Avatar rounded source={{ uri: item.currentAvatar }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#fff', fontWeight: 'bold' }}>
                    {`Phòng: ${item.roomID}`}
                </ListItem.Title>
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(14) }}>
                        {`${item.currentMessage}`}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(10) }}>
                        {` • ${format(item.currentCreatedAt.toDate(), 'yyyy-MM-dd HH:mm', { locale: vi })}`}
                    </ListItem.Subtitle>
                </View>
                {/* <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(12) }}>
                    {`•${formatDistanceToNow(item.currentCreatedAt.toDate(), { locale: vi })}`}
                </ListItem.Subtitle> */}
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
                colors: ['#0278ae', '#0278ae'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginTop: verticalScale(5) }}
            containerStyle={{ paddingVertical: verticalScale(10) }}
            onPress={() => onHandlerConnectRoom(item.docID)}
        >
            <Avatar rounded source={{ uri: item.userConnect.avatarURL }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#fff', fontWeight: 'bold' }}>
                    {item.userConnect.email}
                </ListItem.Title>
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(14) }}>
                        {`${item.currentMessage}`}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: '#999999', fontStyle: 'italic', fontSize: scale(10) }}>
                        {` • ${format(item.currentCreatedAt.toDate(), 'yyyy-MM-dd HH:mm', { locale: vi })}`}
                    </ListItem.Subtitle>
                </View>
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
                colors: ['#fdbaf8', '#fdbaf8'],
                start: { x: 1, y: 0 },
                end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient} // Only if no expo
            style={{ marginTop: verticalScale(5) }}
            containerStyle={{ paddingVertical: verticalScale(10) }}
        // onPress={() => onHandlerJoinRoom(item.roomID)}
        >
            <Avatar rounded source={{ uri: item.avatarURL }} />
            <ListItem.Content>
                <ListItem.Title style={{ color: '#0a043c', fontWeight: 'bold', fontSize: scale(14) }}>
                    {item.email}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: '#0a043c', fontStyle: 'italic', fontSize: scale(12) }}>
                    {`${item.fullName}`}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron name="addusergroup" type='antdesign' color="#0a043c" />
        </ListItem>
    )

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <Container>
                <Tabs
                    locked
                    tabBarUnderlineStyle={{ backgroundColor: '#0a043c' }}
                    // page={2}
                >
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Phòng chat`}</Text>
                                <Badge status='error' value={rooms.length}
                                    containerStyle={{
                                        position: 'absolute', top: scale(5), right: scale(5),
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    badgeStyle={{ backgroundColor: '#007580' }}
                                    textStyle={{ fontSize: scale(8) }}
                                />
                            </TabHeading>
                        }
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#eff1f4' }}
                        textStyle={{ fontSize: scale(12), color: '#000' }}
                        activeTextStyle={{ fontSize: scale(14), color: '#007580' }}
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
                                <Badge 
                                value={usersByChat.length}
                                    containerStyle={{
                                        position: 'absolute', top: scale(5), right: scale(5),
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    badgeStyle={{ backgroundColor: '#0278ae' }}
                                    textStyle={{ fontSize: scale(8) }}
                                />
                            </TabHeading>
                        }
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#eff1f4' }}
                        textStyle={{ fontSize: 12, color: '#000' }}
                        activeTextStyle={{ fontSize: 14, color: '#0278ae' }}
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
                                <Badge
                                    value={users.length}
                                    containerStyle={{
                                        position: 'absolute', top: scale(5), right: scale(5),
                                        justifyContent: 'center', alignItems: 'center',
                                    }}
                                    badgeStyle={{ backgroundColor: '#fdbaf8' }}
                                    textStyle={{ fontSize: scale(8) }}
                                />
                            </TabHeading>
                        }
                        tabStyle={{ backgroundColor: '#fff' }}
                        activeTabStyle={{ backgroundColor: '#eff1f4' }}
                        textStyle={{ fontSize: 12, color: '#000' }}
                        activeTextStyle={{ fontSize: 14, color: '#fdbaf8' }}
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