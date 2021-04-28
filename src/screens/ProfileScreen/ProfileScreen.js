import React, { useEffect, useState, useCallback, useContext } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-community/async-storage';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import { AuthContext } from '../../utils'
import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

import styles from './styles';

const db = firebase.firestore()
const entityRef = db.collection('chats')

const ProfileScreen = (props) => {
   
    const { signOut } = useContext(AuthContext);
    const [state, setState] = useState({
        connectID: '',
        connectUser: '',
    })

    const handlerSignOut = () => {
        signOut()
        notificationManager.cancelAllLocalNotification()
    }

    const renderItem = ({ item }) => {
        const onHandlerPress = () => {
            switch (item.route) {
                case 'LogOut':
                    handlerSignOut()
                    break;
            
                default:
                    break;
            }
        }
        return (
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

                onPress={onHandlerPress}
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
    }

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