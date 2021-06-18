import React, { useRef, useState } from 'react'
import { View, Text, Alert, Dimensions, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Transition, Transitioning } from 'react-native-reanimated'

const DATA = [
    {
        bg: '#A8DDE9',
        color: '#3F5B98',
        category: 'Healthcare',
        subCategories: ['Skincare', 'Personal care', 'Health', 'Eye care'],
    },
    {
        bg: '#086E4B',
        color: '#FCBE4A',
        category: 'Food & Drink',
        subCategories: [
            'Fruits & Vegetables',
            'Frozen Food',
            'Bakery',
            'Snacks & Desserts',
            'Beverages',
            'Alcoholic beverages',
            'Noodles & Pasta',
            'Rice & Cooking oil',
        ],
    },
    {
        bg: '#FECBCA',
        color: '#FD5963',
        category: 'Beauty',
        subCategories: ['Skincare', 'Makeup', 'Nail care', 'Perfume'],
    },
    {
        bg: '#193B8C',
        color: '#FECBCD',
        category: 'Baby & Kids',
        subCategories: [
            'Toys',
            'Trolleys',
            'LEGO®',
            'Electronics',
            'Puzzles',
            'Costumes',
            'Food',
            'Hygiene & Care',
            "Child's room",
            'Feeding accessories',
        ],
    },
    {
        bg: '#FDBD50',
        color: '#F5F5EB',
        category: 'Homeware',
        subCategories: [
            'Air purifiers',
            'Stoves, hoods & ovens',
            'Refrigerators',
            'Coffee & Tea',
            'Air conditioning',
            'Grilling',
            'Vacuum cleaners',
        ],
    },
]

const transition = () => (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.OUT type='fade' durationMs={200} />
    </Transition.Together>
)

const AccordionMenu = (props) => {
    const ref = useRef()
    const [currentIndex, setCurrentIndex] = useState(null)

    const handlerTouchOpacity = (index) => {
        ref.current.animateNextTransition()
        setCurrentIndex(currentIndex === index ? null : index)
    }

    const handalerTouchItem = (subCategory) => {
        if (props.onPressItem) {
            props.onPressItem(subCategory, subCategory)
        }
    }

    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={styles.container}
        >
            {DATA.map(({ bg, color, category, subCategories }, index) => {
                return (
                    <TouchableOpacity
                        key={category}
                        activeOpacity={0.9}
                        style={styles.cardContainer}
                        onPress={() => handlerTouchOpacity(index)}
                    >
                        <View style={[styles.card, { backgroundColor: bg }]}>
                            <Text style={[styles.heading, { color: color }]}>{category}</Text>
                            {index === currentIndex &&
                                <View style={styles.subCategories}>
                                    {subCategories.map(subCategory => (
                                        <TouchableOpacity key={`item-${subCategory}`} onPress={() => handalerTouchItem(subCategory)}>
                                            <Text style={[styles.body, { color: color }]}>{`* ${subCategory}`}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                )
            })
            }
        </Transitioning.View>
    )
}

export default AccordionMenu

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
    cardContainer: {
        flexGrow: 1
    },
    card: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontSize: 38,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'left',
        width: '100%',
        paddingLeft: 20
    },
    subCategories: {
        marginTop: 10,
        width:'100%'
    },
    body: {
        fontSize: 20,
        lineHeight: 20 * 1.5,
        textAlign: 'left',
        paddingLeft:30
    }
})