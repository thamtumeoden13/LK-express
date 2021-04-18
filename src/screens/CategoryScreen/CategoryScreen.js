import React, { Component } from 'react';
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
import { moderateScale, verticalScale, calcWidth } from 'utils/scaleSize';
class CategoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onPressItem = (item, index) => {
        Alert.alert('CarouselMainLayout', `You've clicked ${item.title}`);
    }

    render() {
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
                            onPressItem={this.onPressItem}
                        />
                        <CarouselTinderLayout
                            data={ENTRIES2}
                            title={`Tinder Layout `}
                            subtitle={`Tinder of cards layout | Loop`}
                            onPressItem={this.onPressItem}
                        />
                        <View style={{ flex: 2 }}>
                            <CarouselMainLayout
                                data={ENTRIES1}
                                title={`Main Layout`}
                                subtitle={`Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots`}
                                onPressItem={this.onPressItem}
                            />
                        </View>
                        <CarouselCustomLayout
                            data={ENTRIES2}
                            title={`Custom Layout `}
                            subtitle={`Animation of cards layout | Loop`}
                            onPressItem={this.onPressItem}
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