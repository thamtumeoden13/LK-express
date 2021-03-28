import * as React from 'react'
import { View, Text, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'

import { firebase } from '../firebase/config'

// const reference = firebase.database().ref('/users/123');
// const messages = firebase.database().ref('/messages')
//     .once('value')
//     .then(snapshot => {
//         console.log('User data: ', snapshot.val());
//     });
// const mess2 = firebase.database().ref('/messages')
//     .on('value', snapshot => {
//         console.log('User data: ', snapshot.val());
//     });
// import Fire from '../Fire'

const ChatScreen = (props) => {
    const [state, setState] = React.useState({
        messages: [],
        user: {}
    })

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            console.log('user', user)
            if (!!user)
                setState(prev => {
                    return {
                        ...prev,
                        user: {
                            _id: user.uid,
                            name: props.route.params.name
                        }
                    }
                })
        })
        // firebase.database().ref('/messages').on('value', snapshot => {
        //     Object.keys(snapshot.val()).map(function (key) {
        //         const { user, text, timestamp } = snapshot.val()[key]
        //         const { _id } = user
        //         const createdAt = new Date(timestamp)

        //         setState(prev => {
        //             return {
        //                 ...prev,
        //                 messages: GiftedChat.append(prev.messages, { _id: key, createdAt, text, user })
        //             }
        //         })
        //     })
        // });
        const onValueChange = firebase.database()
            .ref(`/messages`)
            .on('value', snapshot => {
                console.log('User data: ', snapshot.val());
            });

        const onChildAdd = firebase.database().ref('/messages').on('child_added', snapshot => {
            console.log('A new node has been added', snapshot.val());
            const { user, text, timestamp } = snapshot.val()
            const { key: _id } = snapshot
            const createdAt = new Date(timestamp)
            setState(prev => {
                return {
                    ...prev,
                    messages: GiftedChat.append(prev.messages, { _id, createdAt, text, user })
                }
            })
        });
        // Stop listening for updates when no longer required
        return () => {
            firebase.database().ref('/messages').off('child_added', onChildAdd);
            firebase.database().ref(`/messages`).off('value', onValueChange);
        }
    }, [])
    const onSend = (messages = []) => {
        console.log('onSend', messages)
        messages.forEach(element => {
            const message = {
                text: element.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: element.user
            };
            console.log('forEach', message)
            firebase.database().ref('/messages').push(message);
        });
    }

    const chat = <GiftedChat messages={state.messages} onSend={onSend} user={state.user} />
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

export default ChatScreen