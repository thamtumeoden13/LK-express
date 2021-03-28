import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import styles from './styles';
import { firebase } from '../../firebase/config'

const HomeScreen = (props) => {
    const [messages, setMessages] = useState([]);

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('entities')
    // const userID =props.route.params.user.id
    useEffect(() => {
        // entityRef
        //     .where("authorID", "==", userID)
        //     .orderBy('createdAt', 'desc')
        //     .onSnapshot(
        //         querySnapshot => {
        //             const newEntities = []
        //             querySnapshot.forEach(doc => {
        //                 const entity = doc.data()
        //                 entity.id = doc.id
        //                 newEntities.push(entity)
        //             });
        //             setEntities(newEntities)
        //         },
        //         error => {
        //             console.log(error)
        //         }
        //     )
        // setMessages([
        //     {
        //         // _id: 1,
        //         text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
        //         createdAt: new Date(),
        //         quickReplies: {
        //             type: 'radio', // or 'checkbox',
        //             keepIt: true,
        //             values: [
        //                 {
        //                     title: '😋 Yes',
        //                     value: 'yes',
        //                 },
        //                 {
        //                     title: '📷 Yes, let me show you with a picture!',
        //                     value: 'yes_picture',
        //                 },
        //                 {
        //                     title: '😞 Nope. What?',
        //                     value: 'no',
        //                 },
        //             ],
        //         },
        //     },
        // ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            text: messages,
            authorID: userID,
            createdAt: timestamp,
        };
        entityRef
            .add(data)
            .then(_doc => {
                // setEntityText('')
                // Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            });
    }, [])

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
            };
            entityRef
                .add(data)
                .then(_doc => {
                    setEntityText('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    return (
        // <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
        // </SafeAreaView>
    )

    const renderEntity = ({ item, index }) => {
        return (
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {index}. {item.text}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new entity'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEntityText(text)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            { entities && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={entities}
                        renderItem={renderEntity}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}


export default HomeScreen