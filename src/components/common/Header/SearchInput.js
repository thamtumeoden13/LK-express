
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native'
import { SearchBar, Input, Icon } from 'react-native-elements';

export const SearchInput = () => {
    const [input, setInput] = useState('')

    return (
        <View style={styles.searchBar}>
            <Input
                value={input}
                onChangeText={input => setInput(input)}
                placeholder="Nhập dịch vụ"
                returnKeyType="go"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                autoFocus={false}
                autoCapitalize="none"
                keyboardAppearance="light"
                autoCorrect={false}
                blurOnSubmit={false}
                placeholderTextColor="#fff"
                leftIcon={<Icon name="search" type="font-awesome" color="#fff" size={18} />}
                rightIcon={
                    input.length > 0 ?
                        <TouchableOpacity onPress={() => setInput('')}>
                            <Icon name="remove" type="font-awesome" color="#fff" size={18} right={10} />
                        </TouchableOpacity>
                        : <View></View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        paddingLeft: 8,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fff',
        height: 40,
        marginVertical: 10,
    },
    inputStyle: {
        flex: 1,
        marginLeft: 10,
        color: '#fff',
        fontSize: 16,
    }
})