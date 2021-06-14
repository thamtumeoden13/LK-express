import React, { Component, useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    StatusBar,
    Alert
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
    CarouselMainLayout,
    CarouselStackLayout,
} from 'components/carousel/layout';
import { ENTRIES1, ENTRIES2 } from 'constants/entries';

import HeaderTitle from 'components/common/Header/HeaderTitle'
import HeadPhoneCarousel from 'components/common/listCommon/HeadPhoneCarousel'

import { firebase } from '../../firebase/config'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

const db = firebase.firestore()
const entityRef = db.collection('categories')

const CategoryDetailScreen = (props) => {

    const [state, setState] = useState({
        isLoading: true,
        categoryID: '',
        categoryName: ''
    })
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const categoryID = props.route.params.id
        const categoryName = props.route.params.name
        setState(prev => {
            return {
                ...prev,
                categoryID,
                categoryName
            }
        })
    }, [])

    useEffect(() => {
        if (!!state.categoryID) {
            props.navigation.setOptions({
                headerTitle: () => <HeaderTitle title={`${state.categoryName}`} />,
                headerRight: () => null,
            });

            const query = entityRef
                .doc(`${state.categoryID}`)
                .collection('images')
            const unsubscribe = query.onSnapshot(getRealtimeCollection, err => Alert.alert(error));
            return () => {
                unsubscribe();
            }
        }
    }, [props.navigation, state.categoryID])

    const getRealtimeCollection = async (querySnapshot) => {
        let categoriesFireStore = []
        querySnapshot.docChanges().forEach(change => {
            const product = change.doc.data()
            if (change.type === "added") {
                console.log("New product: ", change.doc.data());
                categoriesFireStore.push({
                    ...product,
                    createdAt: product.createdAt.toDate(),
                    illustration: product.uri
                })
            }
            if (change.type === "modified") {
                console.log("Modified product: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed product: ", change.doc.data());
            }
        })
        categoriesFireStore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        console.log('categoriesFireStore', categoriesFireStore)
        appendCategories(categoriesFireStore)
    }

    const appendCategories = useCallback((categoriesFireStore) => {
        setCategories(categoriesFireStore)
    }, [categories])

    const onPressItem = (item, index) => {
        Alert.alert('CarouselMainLayout', `You've clicked ${item.title}`);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="gray" barStyle="dark-content" hidden />
            {/* <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEventThrottle={16}
                >
                    <CarouselStackLayout
                        data={categories}
                        // title={state.categoryName}
                        // subtitle={`Stack of cards layout | Loop`}
                        onPressItem={onPressItem}
                    />
                </ScrollView>
            </View> */}
            <HeadPhoneCarousel />
        </SafeAreaView>
    );
}

export default CategoryDetailScreen;

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