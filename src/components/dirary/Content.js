import React, { useState, useEffect, useRef, } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native'
import IonsIcon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TouchableScale from 'react-native-touchable-scale';

import FlatListAnimationCarousel from 'components/common/listCommon/FlatListAnimationCarousel'

import { calcHeight, scale, verticalScale,calcWidth,moderateScale} from 'utils/scaleSize';
import { formatCount, formatDistanceToNowVi } from 'utils/function'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

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

const Content = (props) => {

    const [state, setState] = useState({
        isReady: false,
        status: false,
        quality: 0,
        error: '',
        documentType: 0,
        title: 'This is a TITLE',
        content: `This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT 
        This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT This is a CONTENT `,
        contentSubStr: '',
        isShowMore: false,
    })

    useEffect(() => {
        setState(prev => { return { ...prev, documentType: !!props.documentType ? props.documentType : 0 } })
    }, [props.documentType])

    useEffect(() => {
        let contentSubStr = state.content
        let isShowMore = false
        if (!!state.content && state.content.length > 100) {
            contentSubStr = state.content.substring(0, 100)
            isShowMore = true
        }
        setState(prev => { return { ...prev, contentSubStr, isShowMore } })

    }, [state.content])

    const onHandlerContent = () => {
        setState(prev => { return { ...prev, contentSubStr: prev.content, isShowMore: false } })
    }

    return (
        <View>
            <View style={{ paddingHorizontal: scale(10) }}>
                {!!state.title && <Text style={{ fontSize: scale(16), fontWeight: 'bold', }}>{state.title}</Text>}
                {!!state.contentSubStr &&
                    <>
                        <Text style={{ fontSize: scale(12), fontWeight: '300', }}>{state.contentSubStr}</Text>
                        {!!state.isShowMore &&
                            <TouchableOpacity onPress={onHandlerContent}>
                                <Text style={{ fontSize: scale(12), fontWeight: '300', color: 'blue' }}>{`Xem thêm...`}</Text>
                            </TouchableOpacity>
                        }
                    </>
                }

            </View>
            <View style={{ height: calcHeight(30) }}>
                <FlatListAnimationCarousel />
            </View>
            <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#fff' }}>
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
            </View>
        </View>
    )
}

export default Content

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    btn: {
        margin: 2,
        padding: 2,
        backgroundColor: "aqua",
    },
    btnDisable: {
        margin: 2,
        padding: 2,
        backgroundColor: "gray",
    },
    btnText: {
        margin: 2,
        padding: 2,
    }
});