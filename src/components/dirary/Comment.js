import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import IonsIcon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TouchableScale from 'react-native-touchable-scale';
import formatDistance from 'date-fns/formatDistanceToNow'
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';

import { calcWidth, moderateScale, scale, verticalScale } from 'utils/scaleSize';
import { formatCount, formatDistanceToNowVi } from 'utils/function'

const Commment = ({ data }) => {

    const [state, setState] = useState({
        isReady: false,
        status: false,
        quality: 0,
        error: '',
        like: false,
        dislike: false,
    })

    const onHandlerLike = (type1, type2) => {
        setState(prev => {
            return {
                ...prev,
                [type1]: !prev[type1],
                [type2]: false,
            }
        })
    }

    return (
        <View style={{
            height: verticalScale(48),
            flexDirection: 'row',
            width: calcWidth(100),
            padding: scale(5),
            alignItems: 'flex-end'
        }}>
            <View style={{ height: '100%', width: moderateScale(48) }}>
                <TouchableScale onPress={() => onHandlerLike('like', 'dislike')}>
                    <AntDesignIcon
                        name='like2' size={20}
                        color={!!state.like ? '#185ADB' : '#171717'}
                    />
                </TouchableScale>
                <Text style={{ fontSize: 12, color: !!state.like ? '#185ADB' : '#171717' }}>{formatCount(1000)}</Text>
            </View>
            <View style={{ height: '100%', width: moderateScale(48) }}>
                <TouchableScale onPress={() => onHandlerLike('dislike', 'like')}>
                    <AntDesignIcon
                        name='dislike2' size={20}
                        color={!!state.dislike ? '#185ADB' : '#171717'}
                    />
                </TouchableScale>
                <Text style={{ fontSize: 12, color: !!state.dislike ? '#185ADB' : '#171717' }}>{formatCount(100)}</Text>
            </View>
            <View style={{ height: '100%', width: '50%', }}>
                <IonsIcon name='chatbox-ellipses-outline' size={20} style={{ marginRight: scale(5) }} />
                <Text style={{ color: '#6a6a6a', fontSize: scale(14) }}>{`${formatCount(123456)} bình luận`}</Text>
            </View>
        </View>
    )
}

export default Commment