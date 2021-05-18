import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    StatusBar,
    Alert,
    Keyboard
} from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import { firebase } from '../../firebase/config'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import AddCategoryCom from 'components/category/AddCategory'

const db = firebase.firestore()
const entityRef = db.collection('categories')

const AddCategoryScreen = (props) => {

    const [state, setState] = useState({
        userID: '',
        userName: ''
    })

    useEffect(() => {
        setTimeout(async () => {
            const userToken = await AsyncStorage.getItem('User');
            const user = JSON.parse(userToken)
            setState(prev => {
                return {
                    ...prev,
                    userID: user.id,
                    userName: user.fullName,
                }
            })
        })
    }, [])

    const addCategory = (result) => {
        let { categoryID, categoryName, listImage } = result
        listImage.map(e => {
            e.createdBy = state.userID
            return e
        })
        listImage.map(element => {
            const currentValue = {
                createdByID: state.userID,
                createdByName: state.userName,
                createdAt: new Date(),
                name: categoryName
            }
            entityRef.doc(`${categoryID}`).set(currentValue)
                .then(_doc => {
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                })

            entityRef.doc(`${categoryID}`).collection('images')
                .doc().set(element)
                .then(_doc => {
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                })
        })
        props.navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            < View style={styles.container} >
                <AddCategoryCom
                    addCategory={addCategory}
                />
            </View >
        </SafeAreaView>
    );
}

export default AddCategoryScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000"
    },
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    containerStyleListHorizontal: {
        height: moderateScale(160),
    },
    itemStyleListHorizontal: {
        width: moderateScale(160)
    },
    containerStyleListVertical: {
        height: moderateScale(520),
    },
    itemStyleListVertical: {
        height: moderateScale(260),
        width: calcWidth(45)
    }
});