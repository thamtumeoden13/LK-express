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
import { getRandomColor } from 'utils/function'

import AddCategoryCom from 'components/category/AddCategory'

const db = firebase.firestore()
const entityRef = db.collection('categories')
const entityProductsRef = db.collection('products')

const AddCategoryScreen = (props) => {

    const [state, setState] = useState({
        userID: '',
        userName: ''
    })

    const [products, setProducts] = useState([])

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
        getRealtimeCollection()
    }, [])


    const getRealtimeCollection = async () => {
        const querySnapshot = await entityProductsRef.get()
        const products = querySnapshot.docs.map(doc => {
            console.log(doc.data())
            const product = doc.data()
            return {
                ...product,
                docRef: doc.id
            }
        })
        console.log(products)
        setProducts(products)
    }


    const addCategory = (result) => {
        let { categoryName, listImage, listProduct } = result
            console.log('result', result)
        listImage.map(e => {
            e.createdBy = state.userID
            return e
        })
        entityRef.add({
            bg: getRandomColor(),
            color: getRandomColor(),
            createdAt: new Date(),
            createdBy: state.userID,
            createdByName: state.userName,
            name: categoryName,
            productsRef: listProduct,
            subCategories: 'Toys,Trolleys,LEGO®,'
        }).then((docRef) => {
            console.log('docRef', docRef)
            // images.map(element => {
            //     entityRef.doc(`${docRef.id}`).collection('images').add({
            //         imageBase64: !!element.data ? element.data : '',
            //         imageUrl: !!element.url ? element.url : '',
            //         createdAt: new Date(),
            //         createdBy: state.userID,
            //         createdByName: state.userName,
            //     }).then(_doc => {
            //         Keyboard.dismiss()
            //     }).catch((error) => {
            //         console.log("Error adding document image: ", error);
            //     })
            // })
        }).catch((error) => {
            alert(error)
        })
        props.navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            < View style={styles.container} >
                <AddCategoryCom
                    products={products}
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