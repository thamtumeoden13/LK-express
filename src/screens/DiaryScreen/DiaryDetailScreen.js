import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, FlatList, Image, StyleSheet, } from 'react-native'

import { Comment, Content, Header } from 'components/dirary'

const DiaryDetail = (props) => {

    const [state, setState] = useState({
        isReady: false,
        status: false,
        quality: 0,
        error: '',
        like: false,
        dislike: false,
        documentType: 0
    })

    const [userInfo, setUserInfo] = useState({
        userName: '',
        fullName: '',
        imgURL: '',
    })

    const [comments, setComments] = useState([])

    useEffect(() => {
        const documentType = props.navigation.getParam('documentType', '');
        setState(prev => { return { ...prev, documentType } })
    }, [])

    useEffect(() => {
        if (props.userInfo) {
            setUserInfo(prev => {
                return {
                    ...prev,
                    userName: props.userInfo.UserName,
                    fullName: props.userInfo.FullName,
                    imgURL: props.userInfo.DefaultPictureURL,
                }
            })
            setComments([
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
                    fullName: 'Nguyễn Hoàng Thái',
                    imgURL: 'https://images.pexels.com/photos/6186912/pexels-photo-6186912.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                    content: '2222222222222222222222222222222222222222',
                    dateCreated: new Date(2021, 5, 22, 12, 20),
                },
                {
                    userName: 98138,
                    fullName: 'Nguyễn Hoàng Thái',
                    imgURL: 'https://images.pexels.com/photos/6186912/pexels-photo-6186912.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                    content: '2222222222222222222222222222222222222222',
                    dateCreated: new Date(2021, 5, 23, 12, 20),
                },
                {
                    userName: 98138,
                    fullName: 'Nguyễn Hoàng Thái',
                    imgURL: 'https://images.pexels.com/photos/6186912/pexels-photo-6186912.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
                    content: '2222222222222222222222222222222222222222',
                    dateCreated: new Date(2021, 5, 27, 12, 20),
                }
            ])
        }
    }, [props.userInfo])

    const onReady = () => {
        setState(prev => { return { ...prev, isReady: true } })
    }

    const onChangeState = (status) => {
        console.log('status', status)
        setState(prev => { return { ...prev, status: status } })
    }

    const onChangeQuality = (quality) => {
        console.log('quality', quality)
        setState(prev => { return { ...prev, quality: quality } })
    }

    const onError = (error) => {
        console.log('error', error)
        setState(prev => { return { ...prev, error: error } })
    }

    return (
        <View style={styles.container}>
            <Header userInfo={userInfo} />
            <Content documentType={state.documentType} />
            <Comment data={comments} />
        </View>
    )
}

export default DiaryDetail

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})