import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { StackActions } from '@react-navigation/native';

import { Comment, Content, Header } from 'components/dirary'

import { firebase } from '../../firebase/config'

const DiaryScreen = (props) => {
    const db = firebase.firestore()
    const entityRef = db.collection('diaries')

    const [contents, setContents] = useState([])

    useEffect(() => {
        const unsubscribeUserList = entityRef.onSnapshot(getRealtimeCollectionDiaryList, err => Alert.alert(error))
        return () => {
            unsubscribeUserList()
        }
    }, [])

    const getRealtimeCollectionDiaryList = async (querySnapshot) => {
        let reads = querySnapshot.docs.map(async (doc) => {
            const diary = doc.data()
            const querySnapshotLike = await entityRef.doc(doc.id).collection('likes').get()
            const querySnapshotComment = await entityRef.doc(doc.id).collection('comments').get()

            const comments = querySnapshotComment.docs.map((doc) => {
                const comment = doc.data()
                return { ...comment, fullName: comment.createdByName }
            })
            console.log('comments', comments)
            return {
                ...diary,
                fullName: diary.createdByName,
                imgBase64: diary.createdAvatarBase64,
                dateCreated: diary.createdAt.toDate(),
                title: diary.title,
                content: diary.content,
                totalLike: querySnapshotLike.docs.length,
                totalComment: querySnapshotComment.docs.length,
                comments: comments
            }
        })
        let result = await Promise.all(reads)
        const diaries = result.filter(e => { return !!e && Object.keys(e).length > 0 });
        console.log('diaries', diaries)
        setContents(diaries)
    }

    const onPressItem = (item) => {
        const pushAction = StackActions.push('DiaryDetail', { dataInfo: item })
        props.navigation.dispatch(pushAction)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={contents}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <View >
                            <Header
                                fullName={item.fullName}
                                imgURL={item.imgURL}
                                imgBase64={item.imgBase64}
                                dateCreated={item.dateCreated}
                                onPressItem={() => onPressItem(item)}
                            />
                            <Content
                                title={item.title}
                                content={item.content}
                                onPressItem={() => onPressItem(item)}
                            />
                            <Comment
                                totalLike={item.totalLike}
                                totalComment={item.totalComment}
                                totalView={item.totalComment}
                                onPressItem={() => onPressItem(item)}
                            />
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