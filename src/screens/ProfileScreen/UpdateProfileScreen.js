import React, { useState, useEffect } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'

import ButtonOutline from 'components/common/button/ButtonOutline';

import { firebase } from '../../firebase/config'
import { listDataElement } from '../../constants/dataTest'
import { scale, verticalScale, calcHeight, calcWidth } from 'utils/scaleSize'

import styles from './styles';

const db = firebase.firestore()
const entityUserRef = db.collection('users')

const UpdateProfileScreen = (props) => {

    const [user, setUser] = useState({})

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            getUsersInfo(user.id)
        });
        return () => {
            focusListener
        }
    }, [])

    const getUsersInfo = async (userID) => {
        const querySnapshot = await entityUserRef.where("id", "==", userID).get()
        const users = querySnapshot.docs.map((doc) => {
            const user = doc.data()
            return {
                ...user,
                doc: doc.id,
                userID: user.id,
                userName: user.fullName,
                avatarURL: user.avatarURL,
                user: user
            }
        })
        console.log('users', users)
        setUser({ ...users }[0])
    }

    const handlerChangeText = (name, text) => {
        setUser(prev => { return { ...prev, [name]: text } })
    }

    const onUpdateProfile = () => {

        const result = {
            avatarBase64: user.avatarBase64,
            address: user.address,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber
        }

        entityUserRef.doc(user.userID).update(result)
            .then(_doc => {
                Keyboard.dismiss()
                props.navigation.goBack()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const onChooseUploadFile = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
            },
            (response) => {
                if (response.didCancel) {
                    // console.log('User cancelled photo picker');
                } else if (response.error) {
                    // console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    setUser(prev => { return { ...prev, avatarBase64: response.base64 } })
                    // uploadImage(response)
                }
            },
        )
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
            // keyboardShouldPersistTaps="always"
            >
                <TouchableOpacity
                    style={{
                        width: '100%',
                        flexDirection: 'column', alignItems: 'center',
                    }}
                    onPress={() => onChooseUploadFile()}
                >
                    <Image
                        style={styles.logo}
                        source={!!user.avatarBase64 ? { uri: `data:image/png;base64,${user.avatarBase64}` } : { uri: user.avatarURL }}
                    />
                    <View style={{ position: 'absolute', bottom: 0 }}>
                        <FeatherIcon name='edit' size={20} />
                    </View>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder='Họ tên'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('fullName', text)}
                    value={user.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('email', text)}
                    value={user.email}
                    keyboardType={'email-address'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Số điện thoại'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('phoneNumber', text)}
                    value={user.phoneNumber}
                    keyboardType={'number-pad'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Địa chỉ giao/nhận hàng'
                    onChangeText={(text) => handlerChangeText('address', text)}
                    value={user.address}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onUpdateProfile()}>
                    <Text style={styles.buttonTitle}>{`Update Profile`}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}
export default UpdateProfileScreen