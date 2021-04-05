import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Container, Tab, Tabs, TabHeading } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';


import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'

import { listDataElement } from '../../constants/dataTest'
import styles from './styles';

const db = firebase.firestore()
const entityRef = db.collection('rooms')

const RoomScreen = ({ navigation, route }) => {
    const [state, setState] = useState({
        userID: '',
        userName: '',
        isActivedLocalPushNotify: false
    })
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        const focusListener = navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => { return { ...prev, userID: user.id, userName: user.fullName } })
            getCollectionList()
        });
        return () => focusListener
    }, [navigation])

    const getCollectionList = () => {
        entityRef
            .get()
            .then((querySnapshot) => {
                const listFireStore = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const room = doc.data()
                    console.log("querySnapshot=> ", room);
                    listFireStore.push({
                        ...room,
                        name: room.currentUser,
                        subtitle: room.currentMessage,
                        avatar_url: room.currentAvatar,
                    })
                });
                console.log("listFireStore => ", listFireStore);
                setRooms(listFireStore)
            });
    }

    const onHandlerJoinRoom = (roomID) => {
        console.log('onHandlerJoinRoom', roomID)
        navigation.navigate('RoomChatDetail', { roomID: roomID, tabBarVisible: false })
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
                                <Badge status='error' value={listDataElement.length}
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
                            data={!!rooms ? rooms : listDataElement}
                            renderItem={renderItem}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Bạn bè`}</Text>
                                <Badge status='primary'
                                    value={listDataElement.length}
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
                            data={!!rooms ? rooms : listDataElement}
                            renderItem={renderItem}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={{ backgroundColor: '#fff' }}>
                                <Text style={{ color: '#000' }}>{`Danh bạ`}</Text>
                                <Badge status='success' value={listDataElement.length}
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
                            data={!!rooms ? rooms : listDataElement}
                            renderItem={renderItem}
                        />
                    </Tab>
                </Tabs>
            </Container>
        </SafeAreaView>
    )
}

export default RoomScreen