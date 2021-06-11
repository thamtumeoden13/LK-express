import React, { useRef, useState } from 'react'
import {
    View, Text, Image, StyleSheet,
    SafeAreaView, ScrollView, FlatList,
    Dimensions, StatusBar, Animated,
} from 'react-native'
import TouchableScale from 'react-native-touchable-scale';

import faker from 'faker'

const { width, height } = Dimensions.get('screen')
faker.seed(10)

const DATA = [
    'https://images.pexels.com/photos/2578370/pexels-photo-2578370.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/3973557/pexels-photo-3973557.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/5478144/pexels-photo-5478144.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/2904176/pexels-photo-2904176.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/2265247/pexels-photo-2265247.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/6272196/pexels-photo-6272196.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/605223/pexels-photo-605223.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
]

const IMAGE_WIDTH = width * .7
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.54

const FlatListAnimationCarousel = () => {

    const scrollX = useRef(new Animated.Value(0)).current

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={[StyleSheet.absoluteFill]}>
                {DATA.map((image, index) => {
                    const inputRange = [
                        width * (index - 1),
                        width * index,
                        width * (index + 1)
                    ]
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, 1, 0]
                    })

                    return (
                        <Animated.Image
                            key={`image-${index.toString()}`}
                            source={{ uri: image }}
                            style={[StyleSheet.absoluteFill, { opacity: opacity }]}
                            blurRadius={50}
                        />
                    )
                })}
            </View>
            <Animated.FlatList
                data={DATA}
                horizontal
                pagingEnabled
                keyExtractor={(_, index) => index.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableScale activeScale={1.1}>
                                <Image
                                    source={{ uri: item }}
                                    style={{
                                        width: IMAGE_WIDTH, height: IMAGE_HEIGHT,
                                        resizeMode: 'cover',
                                        borderRadius: 16
                                    }}
                                />
                            </TouchableScale>
                        </View>
                    )
                }}
            />

        </View>
    )
}
export default FlatListAnimationCarousel