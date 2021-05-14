import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    StatusBar,
    Alert
} from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
    CarouselMainLayout,
    CarouselMomentumLayout,
    CarouselStackLayout,
    CarouselTinderLayout,
    CarouselCustomLayout
} from 'components/carousel/layout';
import { ENTRIES1, ENTRIES2 } from 'constants/entries';

import DrawerIcon from 'components/common/icon/DrawerIcon'
import BagIcon from 'components/common/icon/BagIcon'
import HeaderTitle from 'components/common/Header/HeaderTitle'

import ListHorizontal from 'components/common/listCommon/ListHorizontal'
import ListVertical from 'components/common/listCommon/ListVertical'

import { AuthContext } from '../../utils'
import { firebase } from '../../firebase/config'
import { notificationManager } from '../../utils/NotificationManager'
import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';

const db = firebase.firestore()
const entityRef = db.collection('chats')

const CategoryScreen = () => {

    const [state, setState] = useState({ isLoading: true, })
    const [response, setResponse] = React.useState(null);

    const onPressItem = (item, index) => {
        // Alert.alert('CarouselMainLayout', `You've clicked ${item.title}`);
        onChooseUploadFile()
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
                setResponse(response);
                console.log('response', response)
                uploadImage(response)
            },
        )
    }

    const uploadImage = (image) => {
        const data = {
            name: image.fileName,
            type: image.type,
            base64: image.base64
        };
        const imagesRef = firebase.firestore().collection('images')
        imagesRef
            .doc()
            .set(data)
            .then(() => {
                console.log("Document successfully upload!");
            })
            .catch((error) => {
                alert(error)
            });
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="gray" barStyle="dark-content" hidden />
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEventThrottle={16}
                >
                    <CarouselStackLayout
                        data={ENTRIES1}
                        title={`Stack Layout `}
                        subtitle={`Stack of cards layout | Loop`}
                        onPressItem={onPressItem}
                    />
                    <CarouselTinderLayout
                        data={ENTRIES2}
                        title={`Tinder Layout `}
                        subtitle={`Tinder of cards layout | Loop`}
                        onPressItem={onPressItem}
                    />
                    <View style={{ flex: 2 }}>
                        <CarouselMainLayout
                            data={ENTRIES1}
                            title={`Main Layout`}
                            subtitle={`Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots`}
                            onPressItem={onPressItem}
                        />
                    </View>
                    <CarouselCustomLayout
                        data={ENTRIES2}
                        title={`Custom Layout `}
                        subtitle={`Animation of cards layout | Loop`}
                        onPressItem={onPressItem}
                    />
                    <View style={{ flex: 1, paddingTop: verticalScale(20), marginBottom: verticalScale(20), paddingHorizontal: moderateScale(10) }}>
                        <ListHorizontal
                            title={`Categories`}
                            data={ENTRIES1}
                            containerStyle={styles.containerStyleListHorizontal}
                            itemStyle={styles.itemStyleListHorizontal}
                        />
                    </View>
                    <View style={{ flex: 1, paddingTop: verticalScale(20), marginBottom: verticalScale(20), }}>
                        <ListVertical
                            title={`House`}
                            data={ENTRIES2}
                            containerStyle={styles.containerStyleListVertical}
                            itemStyle={styles.itemStyleListVertical}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default CategoryScreen;

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