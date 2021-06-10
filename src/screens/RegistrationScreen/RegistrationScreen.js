import React, { useState, useContext } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../../utils'
import { listDataElement } from '../../constants/dataTest'

import styles from './styles';

const RegistrationScreen = ({ navigation }) => {
    const [state, setState] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        avatarURL: listDataElement[Math.floor(Math.random() * (listDataElement.length - 1))].avatar_url
    })
    const { signUp } = useContext(AuthContext);
    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const handlerChangeText = (name, text) => {
        setState(prev => { return { ...prev, [name]: text } })
    }

    const onRegisterPress = () => {
        if (state.password !== state.confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        signUp(state.email, state.password, state.fullName, state.avatarURL, state.phoneNumber)
    }
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
            // keyboardShouldPersistTaps="always"
            >
                <Image
                    style={styles.logo}
                    source={state.avatarURL ? { uri: state.avatarURL } : require('../../../assets/bootsplash_logo.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Họ tên'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('fullName', text)}
                    value={state.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('email', text)}
                    value={state.email}
                    keyboardType={'email-address'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Số điện thoại'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => handlerChangeText('phoneNumber', text)}
                    value={state.email}
                    keyboardType={'number-pad'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    // secureTextEntry
                    placeholder='Mật khẩu'
                    onChangeText={(text) => handlerChangeText('password', text)}
                    value={state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    // secureTextEntry
                    placeholder='Nhập lại mật khẩu'
                    onChangeText={(text) => handlerChangeText('confirmPassword', text)}
                    value={state.confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    // secureTextEntry
                    placeholder='Avatar URL'
                    onChangeText={(text) => handlerChangeText('avatarURL', text)}
                    value={state.avatarURL}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    editable={false}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}
export default RegistrationScreen