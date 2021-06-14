import React, { useRef, useState, useEffect } from 'react'
import {
    View, Text, Image, StyleSheet, Animated,
} from 'react-native'

const BG_IMG = 'https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
const SPACING = 20
const AVATAR_SIZE = 70
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3

const FlatListAnimation = ({ result }) => {

    const [data, setData] = useState([])
    const scrollY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        setData(!!result ? result : [])
    }, [result])

    const renderItem = ({ item, index }) => {

        const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2),
        ]
        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
        })

        const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 1),
        ]
        const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0]
        })

        return (
            <Animated.View style={{
                flexDirection: 'row', borderRadius: SPACING / 2,
                padding: SPACING, marginBottom: SPACING,
                backgroundColor: '#fff9',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: SPACING / 2
                },
                shadowOpacity: .3,
                shadowRadius: SPACING,
                transform: [{ scale }],
                opacity
            }}>
                <Image
                    source={{ uri: item.image }}
                    style={{
                        width: AVATAR_SIZE, height: AVATAR_SIZE,
                        borderRadius: AVATAR_SIZE,
                        marginRight: SPACING / 2
                    }}
                />
                <View>
                    <Text style={{ fontSize: 22, fontWeight: '600', lineHeight: 30 }}>{item.name}</Text>
                    <Text style={{ fontSize: 18, opacity: 0.7, fontStyle: 'italic', lineHeight: 20 }}>{item.jobTitle}</Text>
                    <Text style={{ fontSize: 14, opacity: 0.8, color: '#00f' }}>{item.email}</Text>
                </View>
            </Animated.View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Image
                source={{ uri: BG_IMG }}
                style={StyleSheet.absoluteFill}
                blurRadius={50}
            />
            <Animated.FlatList
                data={data}
                extraData={data}
                keyExtractor={({ key }) => key}
                renderItem={renderItem}
                contentContainerStyle={{ padding: SPACING }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            />
        </View>
    )
}

export default FlatListAnimation