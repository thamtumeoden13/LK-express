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
        signUp(state.email, state.password, state.fullName, state.avatarURL)
    }
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={state.avatarURL ? { uri: state.avatarURL } : require('../../../assets/bootsplash_logo.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
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
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    // secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => handlerChangeText('password', text)}
                    value={state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    // secureTextEntry
                    placeholder='Confirm Password'
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