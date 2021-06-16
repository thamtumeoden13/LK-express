import React from 'react'
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

const DATA = [
    {
        key: 1,
        price: 200000,
        quantity: 1,
        title: 'Headphone',
        thumbnail: 'https://images.pexels.com/photos/2578370/pexels-photo-2578370.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 2,
        price: 300000,
        quantity: 1,
        title: 'SmartPhone 1',
        thumbnail: 'https://images.pexels.com/photos/3973557/pexels-photo-3973557.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 3,
        price: 250000,
        quantity: 3,
        title: 'SmartPhone 2',
        thumbnail: 'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 4,
        price: 400000,
        quantity: 1,
        title: 'SmartPhone 3',
        thumbnail: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 5,
        price: 400000,
        quantity: 1,
        title: 'SmartPhone 3',
        thumbnail: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 6,
        price: 400000,
        quantity: 1,
        title: 'SmartPhone 3',
        thumbnail: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 7,
        price: 400000,
        quantity: 1,
        title: 'SmartPhone 3',
        thumbnail: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
    {
        key: 8,
        price: 400000,
        quantity: 1,
        title: 'SmartPhone 3',
        thumbnail: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
    },
]

const { width, height } = Dimensions.get('screen')
const SPACING = 20
const IMAGE_SIZE = 64
const ITEM_SIZE = IMAGE_SIZE + SPACING * 3

const ShoppingCartScreen = () => {

    const scrollY = React.useRef(new Animated.Value(0)).current

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>

            <Animated.FlatList
                data={DATA}
                keyExtractor={({ key }) => key.toString()}
                contentContainerStyle={{ width, paddingHorizontal: 10 }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                renderItem={({ item, index }) => {

                    const inputRange = [
                        -1,
                        0,
                        ITEM_SIZE * index,
                        ITEM_SIZE * (index + 2)
                    ]
                    const scale = scrollY.interpolate({
                        inputRange,
                        outputRange: [1, 1, 1, 0]
                    })

                    const inputRangeOpacity = [
                        -1,
                        0,
                        ITEM_SIZE * index,
                        ITEM_SIZE * (index + 1)
                    ]
                    const opacity = scrollY.interpolate({
                        inputRange: inputRangeOpacity,
                        outputRange: [1, 1, 1, 0]
                    })

                    return (
                        <Animated.View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: ITEM_SIZE,
                            borderRadius: SPACING / 2,
                            marginVertical: 5,
                            marginHorizontal: 10,
                            padding: 10,
                            shadowColor: '#0003',
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            backgroundColor: '#FDFAF0',
                            transform: [{ scale }],
                            opacity
                        }}>
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={{
                                    width: IMAGE_SIZE, height: IMAGE_SIZE,
                                    borderRadius: IMAGE_SIZE / 2,
                                    justifyContent: 'center',
                                }}
                                resizeMode='cover'
                            />
                            <View style={{ flex: 1, }}>
                                <View style={{
                                    width: '100%', height: IMAGE_SIZE / 2,
                                    justifyContent: 'center', alignItems: 'center',
                                    paddingLeft: 5
                                }}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#00f' }}>{item.title}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: width / 5, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '300' }}>{'Đơn giá'}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.price}</Text>
                                    </View>
                                    <View style={{ width: width / 5, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '300' }}>{'Số lượng'}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '500' }}>{item.quantity}</Text>
                                    </View>
                                    <View style={{ width: width / 5, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '300', }}>{'Thành tiền'}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#f00' }}>{item.quantity * item.price}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'flex-end' }}>
                                <AntDesignIcon name='delete' size={20} color={'#6a6a6a'} />
                            </TouchableOpacity>
                        </Animated.View>
                    )
                }}
            />
        </View>
    )
}

export default ShoppingCartScreen