import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from 'react-native'

import { Comment, Content, Header } from 'components/dirary/diaryDetail'
// setComments([
//     {
//         userName: 68913,
//         fullName: 'Lê Hoàng Vũ',
//         imgURL: 'https://images.pexels.com/photos/8066167/pexels-photo-8066167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
//         content: '111111111111111111111111111111111111111111',
//         dateCreated: new Date(2021, 5, 20, 12, 20),
//     },
//     {
//         userName: 74260,
//         fullName: 'Nguyễn Văn Phận',
//         imgURL: 'https://images.pexels.com/photos/4999940/pexels-photo-4999940.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
//         content: '3333333333333333333333333333',
//         dateCreated: new Date(2021, 5, 21, 12, 20),
//     },
//     {
//         userName: 98138,
//         fullName: 'Nguyễn Hoàng Thái',
//         imgURL: 'https://images.pexels.com/photos/6186912/pexels-photo-6186912.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
//         content: '2222222222222222222222222222222222222222',
//         dateCreated: new Date(2021, 5, 21, 14, 20),
//     },
// ])
const DiaryDetail = (props) => {

    const [dataInfo, setDataInfo] = useState({
        fullName: '',
        imgURL: '',
        imgBase64: '',
        dateCreated: '',
        title: '',
        content: ''
    })

    const [comments, setComments] = useState([])

    useEffect(() => {
        const dataInfo = props.route.params.dataInfo
        setDataInfo(dataInfo)
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Header
                    fullName={dataInfo.fullName}
                    imgURL={dataInfo.imgURL}
                    imgBase64={dataInfo.imgBase64}
                    dateCreated={dataInfo.dateCreated}
                />
                <Content
                    title={dataInfo.title}
                    content={dataInfo.content}
                />
                <Comment
                    fullName={dataInfo.fullName}
                    comments={dataInfo.comments}
                    totalLike={dataInfo.totalLike}
                    totalComment={dataInfo.totalComment}
                    totalView={dataInfo.totalComment}
                />
            </ScrollView>
        </View>
    )
}

export default DiaryDetail

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})