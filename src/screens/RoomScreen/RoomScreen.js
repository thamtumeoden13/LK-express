
import React, { useContext } from 'react';
import { useState } from 'react';

import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { firebase } from '../../firebase/config'
import { AuthContext } from '../../utils'

const RoomScreen = (props) => {

    const [state, setState] = useState({
        name: ''
    })
    const { signOut } = useContext(AuthContext);

    const handlerContinue = () => {
        props.navigation.navigate('Chat', { name: state.name })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cirle} />
            <View style={{ margintop: 64 }}>
                <Image
                    source={require('../../../assets/bootsplash_logo.png')}
                    style={{ width: 100, height: 100, alignSelf: 'center' }}
                />
            </View>
            <View style={{ marginHorizontal: 32 }}>
                <Text style={styles.header}>{`Username`}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={name => setState(prev => { return { ...prev, name } })}
                    placeholder={'Input you name'}
                >
                    {state.name}
                </TextInput>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <TouchableOpacity
                        style={styles.continue}
                        // onPress={() => handlerSignOut()}
                        onPress={() => signOut()}
                    >
                        <Ionicons name="md-arrow-back-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.continue}
                        onPress={() => handlerContinue()}
                    >
                        <Ionicons name="md-arrow-forward-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f5f7'
    },
    cirle: {
        width: 500,
        height: 500,
        borderRadius: 500 / 2,
        backgroundColor: '#fff',
        left: -120,
        top: -50,
        position: 'absolute'
    },
    header: {
        fontWeight: '800',
        fontSize: 30,
        color: '#514e5a',
        marginTop: 32
    },
    input: {
        marginTop: 32,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bab7c3',
        borderRadius: 32,
        paddingHorizontal: 16,
        color: '#514e5a',
        fontWeight: '600'
    },
    continue: {
        width: 64,
        height: 64,
        borderRadius: 64 / 2,
        backgroundColor: '#9075e3',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16
    }
})

export default RoomScreen