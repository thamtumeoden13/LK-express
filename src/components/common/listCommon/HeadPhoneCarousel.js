import { AddCategory } from 'components/category/modalInputForm';
import React, { useRef } from 'react'
import { View, Text, FlatList, Image, Dimensions, StyleSheet, StatusBar, Animated, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const DATA = [
    {
        type: 'Humlan P',
        imageUri: require('../../../assets/urbanears_blue.png'),
        heading: 'Vibrant colors',
        description: 'Four on-trend colorways to seamlessly suit your style.',
        key: 'first',
        color: '#9dcdfa',
        price: 200
    },
    {
        type: 'Pampas',
        imageUri: require('../../../assets/urbanears_pink.png'),
        heading: 'Redefined sound',
        description: 'A bold statement tuned to perfection.',
        key: 'second',
        color: '#db9efa',
        price: 250
    },
    {
        type: 'Humlan P',
        imageUri: require('../../../assets/urbanears_grey.png'),
        heading: 'Great quality',
        description:
            'An Urbanears classic! Listen-all-day fit. Striking the perfect balance of effortless technology',
        key: 'third',
        color: '#999',
        price: 190
    },
    {
        type: 'Humlan B',
        imageUri: require('../../../assets/urbanears_mint.png'),
        heading: 'From Sweden',
        description:
            'The “Plattan” in Plattan headphones is Swedish for “the slab.”',
        key: 'fourth',
        color: '#a1e3a1',
        price: 200
    },
];

const { width, height } = Dimensions.get('window')
const LOGO_WIDTH = 220
const LOGO_HEIGHT = 40
const DOT_SIZE = 40

const CIRCLE_SIZE = width * 0.6

const Circle = ({ scrollX }) => {
    return (
        <View style={[StyleSheet.absoluteFill, styles.circleContainer]}>
            {DATA.map(({ key, color }, index) => {
                const inputRange = [(index - 0.55) * width, index * width, (index + 0.55) * width]
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp'
                })
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0, 0.2, 0]
                })

                return (
                    <Animated.View key={key} style={[styles.circle,
                    {
                        backgroundColor: color,
                        opacity: opacity,
                        transform: [{ scale }]
                    }]} />
                )
            })}
        </View>
    )
}

const Item = ({ imageUri, heading, description, price, index, scrollX, addToCart}) => {

    const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
    const inputRangeOpacity = [(index - 0.3) * width, index * width, (index + 0.3) * width]

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0]
    })

    const translateHeading = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.1, 0, -width * 0.1]
    })

    const translateDescription = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.6, 0, -width * 0.6]
    })

    const opacity = scrollX.interpolate({
        inputRange: inputRangeOpacity,
        outputRange: [0, 1, 0]
    })

    return (
        <View style={styles.itemStyle}>
            <Animated.Image
                source={imageUri}
                style={[styles.imageStyle, { transform: [{ scale }] }]}
            />
            <View style={styles.textStyles}>
                <Animated.Text style={[styles.heading, {
                    transform: [{ translateX: translateHeading }],
                    opacity
                }]}>{heading}</Animated.Text>
                <Animated.Text style={[styles.description,
                {
                    transform: [{ translateX: translateDescription }],
                    opacity
                }]}> {description}</Animated.Text>
                <Animated.Text style={[styles.price,
                {
                    transform: [{ translateX: translateDescription }],
                    opacity
                }]}> {`${price} $`}</Animated.Text>
                <TouchableOpacity onPress={addToCart}>
                    <MaterialIcons name='add-shopping-cart' size={24} color='#000' />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const Pagination = ({ scrollX }) => {
    const inputRange = [-width, 0, width]
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [-DOT_SIZE, 0, DOT_SIZE]
    })

    return (
        <View style={styles.pagination}>
            <Animated.View
                style={[
                    styles.paginationIndicator,
                    {
                        position: 'absolute',
                        transform: [{ translateX }]
                    }
                ]}
            />
            {DATA.map((item, index) => {
                return (
                    <View key={item.key} style={styles.paginationDotContainer}>
                        <View
                            style={[styles.paginationDot, { backgroundColor: item.color }]}
                        />
                    </View>
                )
            })}
        </View>
    )
}

const HeadPhoneCarousel = () => {
    const scrollX = useRef(new Animated.Value(0)).current
    const addToCart = (item)=>{
        console.log(item)
    }
    return (
        <View style={styles.container}>
            <StatusBar hidden={false} />
            <Circle scrollX={scrollX} />
            <Animated.FlatList
                data={DATA}
                renderItem={({ item, index }) => <Item {...item} index={index} scrollX={scrollX} addToCart={() => addToCart(item)} />}
                keyExtractor={({ key }, index) => key.toString()}
                pagingEnabled
                horizontal
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                showsHorizontalScrollIndicator={false}
            />
            <Image
                source={require('../../../assets/ue_black_logo.png')}
                style={styles.logo}
            />
            <Pagination scrollX={scrollX} />
        </View>
    )
}

export default HeadPhoneCarousel

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    itemStyle: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: width * 0.75,
        height: width * 0.75,
        resizeMode: 'contain',
        flex: 1,
    },
    textStyles: {
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
        flex: 1,
    },
    heading: {
        color: '#444',
        textTransform: 'uppercase',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5
    },
    description: {
        color: '#ccc',
        fontWeight: '600',
        textAlign: 'left',
        width: width * .75,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 16 * 1.5
    },
    price: {
        color: '#00f',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'left',
        width: width * 0.5,
        marginVertical: 20
    },
    contentStyles: {
        alignItems: 'flex-start',
        alignContent: 'flex-end'
    },
    logo: {
        opacity: 0.9,
        height: LOGO_HEIGHT,
        width: LOGO_WIDTH,
        resizeMode: 'contain',
        position: 'absolute',
        left: 10,
        bottom: 10,
        transform: [
            { translateX: -LOGO_WIDTH / 2 },
            { translateY: -LOGO_HEIGHT / 2 },
            { rotateZ: '-90deg' },
            { translateX: LOGO_WIDTH / 2 },
            { translateY: LOGO_HEIGHT / 2 },
        ]
    },
    pagination: {
        position: 'absolute',
        right: 20,
        bottom: 40,
        flexDirection: 'row',
        height: DOT_SIZE
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute',
        top: '5%'
    }
})