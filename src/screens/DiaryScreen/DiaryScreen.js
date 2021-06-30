import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, FlatList, Image, StyleSheet, } from 'react-native'
import { Comment, Content, Header } from 'components/dirary'

const DiaryScreen = (props) => {

    const [state, setState] = useState({
        isReady: false,
        status: false,
        quality: 0,
        error: '',
        like: false,
        dislike: false,
        documentType: 0
    })

    const [contents, setContents] = useState([])

    useEffect(() => {
        setContents([
            {
                userName: 68913,
                fullName: 'Lê Hoàng Vũ',
                imgURL: 'https://images.pexels.com/photos/8066167/pexels-photo-8066167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                content: '111111111111111111111111111111111111111111',
                dateCreated: new Date(2021, 5, 20, 12, 20),
            },
            {
                userName: 74260,
                fullName: 'Nguyễn Văn Phận',
                imgURL: 'https://images.pexels.com/photos/4999940/pexels-photo-4999940.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                content: '3333333333333333333333333333',
                dateCreated: new Date(2021, 5, 21, 12, 20),
            },
            {
                userName: 98138,
                fullName: 'Nguyễn Hoàng Thái',
                imgURL: 'https://images.pexels.com/photos/6186912/pexels-photo-6186912.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                content: '2222222222222222222222222222222222222222',
                dateCreated: new Date(2021, 5, 21, 14, 20),
            },
            {
                userName: 98138,
                fullName: 'Ối dồi Ôi',
                imgURL: 'https://images.pexels.com/photos/3973557/pexels-photo-3973557.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                content: '2222222222222222222222222222222222222222',
                dateCreated: new Date(2021, 5, 22, 12, 20),
            },
            {
                userName: 98138,
                fullName: 'Bớ làng nước ơi',
                imgURL: 'https://images.pexels.com/photos/6272196/pexels-photo-6272196.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                content: '2222222222222222222222222222222222222222',
                dateCreated: new Date(2021, 5, 23, 12, 20),
            },
            {
                userName: 98138,
                fullName: 'Ăn khế trả vàng',
                imgURL: 'https://images.pexels.com/photos/605223/pexels-photo-605223.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                content: '2222222222222222222222222222222222222222',
                dateCreated: new Date(2021, 5, 27, 12, 20),
            }
        ])
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={contents}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <Header fullName={item.fullName} imgURL={item.imgURL} dateCreated={item.dateCreated}/>
                            <Content documentType={state.documentType} />
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default DiaryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})