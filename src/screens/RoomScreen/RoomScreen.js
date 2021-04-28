import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { StackActions } from '@react-navigation/native';
import { Container, Tab, Tabs, TabHeading } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat } from 'react-native-gifted-chat'
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { vi } from 'date-fns/locale/vi'

import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import styles from './styles';

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
        page: 0,
        isDataFetchedRoomList: false,
        isDataFetchedChatList: false,
        isDataFetchedUserList: false,
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
        });
        return () => {
            focusListener
        }
    }, [])


    useEffect(() => {
        if (!!state.userID) {
            /////////////////
            const unsubscribeRoomList = entityRef.onSnapshot(getRealtimeCollectionRoomList, err => Alert.alert(error))
            // /////////////////
            // const unsubscribeChatList = entityChatRef.onSnapshot(getRealtimeCollectionChatList, err => Alert.alert(error))
            /////////////////
            const queryUserList = entityUserRef.where("id", "!=", state.userID)
            const unsubscribeUserList = queryUserList.onSnapshot(getRealtimeCollectionUserList, err => Alert.alert(error))
            return () => {
                unsubscribeRoomList()
                // unsubscribeChatList()
                unsubscribeUserList()
            }
        }
    }, [state.userID])

    useEffect(() => {
        if (!!users && users.length > 0) {
            const unsubscribeChatList = entityChatRef.onSnapshot(getRealtimeCollectionChatList, err => Alert.alert(error))
            return () => {
                unsubscribeChatList()
            }
        }
    }, [users])

    const getRealtimeCollectionRoomList = async (querySnapshot) => {
        const reads = querySnapshot.docs.map(async (doc) => {
            const room = doc.data()
            const querySnapshot2 = await entityRef.doc(doc.id).collection('users').where("id", "==", state.userID).get()
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
        setState(prev => { return { ...prev, isDataFetchedRoomList: true } })
    }

    const getRealtimeCollectionChatList = async (querySnapshot) => {
        let UsersByChat = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const user = doc.data()
            const docID = doc.id
            const querySnapshot2 = doc.id.split('|')
            if (querySnapshot2.includes(state.userID)) {
                const connectID = querySnapshot2.find(e => e != state.userID)
                UsersByChat.push({
                    ...user,
                    docID: docID,
                    name: user.currentUser,
                    subtitle: user.currentMessage,
                    avatarURL: user.currentAvatar,
                    userConnect: {},
                    connectID: connectID,
                    connectName: '',
                    connectAvatarURL: '',
                })
            }
        });
        UsersByChat.map(e => {
            console.log('users', users)
            const find = users.find(f => e.connectID == f.id)
            console.log('find', find)
            e.userConnect = find
            e.connectName = find.email
            e.connectAvatarURL = find.avatarURL
            return e
        })
        setUsersByChat(UsersByChat)
        setState(prev => { return { ...prev, isDataFetchedChatList: true } })
    }

    const getRealtimeCollectionUserList = async (querySnapshot) => {
        let users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return { ...user, doc: doc.id }
        })
        console.log('users', users)
        setUsers(users)
        setState(prev => { return { ...prev, isDataFetchedUserList: true } })
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

    const renderItemChat = ({ item }) => {
        console.log('item.userConnect', item.connectAvatarURL)
        return (
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
                <Avatar rounded source={{ uri: item.connectAvatarURL }} />
                <ListItem.Content>
                    <ListItem.Title style={{ color: '#fff', fontWeight: 'bold' }}>
                        {item.connectName}
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
    }

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
                        {!state.isDataFetchedRoomList ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    source={require('@assets/animations/890-loading-animation.json')}
                                    colorFilters={[{
                                        keypath: "button",
                                        color: "#F00000"
                                    }, {
                                        keypath: "Sending Loader",
                                        color: "#F00000"
                                    }]}
                                    style={{ width: calcWidth(30), height: calcWidth(30), justifyContent: 'center' }}
                                    autoPlay
                                    loop
                                />
                            </View>
                            :
                            <>
                                {!!rooms && rooms.length > 0 &&
                                    <FlatList
                                        keyExtractor={keyExtractor}
                                        data={rooms}
                                        extraData={rooms}
                                        renderItem={renderItemRoomChat}
                                    />
                                }
                            </>
                        }
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
                        {!state.isDataFetchedChatList ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    source={require('@assets/animations/890-loading-animation.json')}
                                    colorFilters={[{
                                        keypath: "button",
                                        color: "#F00000"
                                    }, {
                                        keypath: "Sending Loader",
                                        color: "#F00000"
                                    }]}
                                    style={{ width: calcWidth(30), height: calcWidth(30), justifyContent: 'center' }}
                                    autoPlay
                                    loop
                                />
                            </View>
                            :
                            <>
                                {!!usersByChat && usersByChat.length > 0 &&
                                    <FlatList
                                        keyExtractor={keyExtractor}
                                        data={usersByChat}
                                        extraData={usersByChat}
                                        renderItem={renderItemChat}
                                    />
                                }
                            </>
                        }
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
                        {!state.isDataFetchedUserList ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    source={require('@assets/animations/890-loading-animation.json')}
                                    colorFilters={[{
                                        keypath: "button",
                                        color: "#F00000"
                                    }, {
                                        keypath: "Sending Loader",
                                        color: "#F00000"
                                    }]}
                                    style={{ width: calcWidth(30), height: calcWidth(30), justifyContent: 'center' }}
                                    autoPlay
                                    loop
                                />
                            </View>
                            :
                            <>
                                {!!users && users.length > 0 &&
                                    <FlatList
                                        keyExtractor={keyExtractor}
                                        data={users}
                                        extraData={users}
                                        renderItem={renderItemUser}
                                    />
                                }
                            </>
                        }
                    </Tab>
                </Tabs>
            </Container>
        </SafeAreaView>
    )
}

export default RoomScreen