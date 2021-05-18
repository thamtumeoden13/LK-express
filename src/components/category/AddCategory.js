import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
    CarouselMainLayout,
    CarouselStackLayout,
} from 'components/carousel/layout';
import { ENTRIES1, ENTRIES2 } from 'constants/entries';
import { scale, verticalScale, calcHeight, calcWidth } from 'utils/scaleSize'
import ButtonOutline from 'components/common/button/ButtonOutline';
import ButtonOutlineBottom from 'components/common/button/ButtonOutlineBottom';
import { InputText } from 'components/common/input/InputText';

const AddCategory = (props) => {

    const [state, setState] = useState({
        categoryID: '',
        categoryName: '',
    })
    const [listImage, setListImage] = useState([])

    const [errors, setErrors] = useState({
        categoryID: '',
        categoryName: '',
    })

    const onChangeInput = (name, value) => {
        setErrors(prev => { return { ...prev, [name]: '', } })
        setState(prev => { return { ...prev, [name]: value } })
    }

    const handlerAdd = () => {

        let errors = {}
        switch (true) {
            case !state.categoryID || state.categoryID.length <= 0:
                errors.categoryID = 'Vui lòng nhập mã danh mục'
                break;
            case !state.categoryName || state.categoryName.length <= 0:
                errors.categoryName = 'Vui lòng nhập tên'
                break;
            default:
                break;
        }
        if (!!errors && Object.keys(errors).length > 0) {
            setErrors(errors)
            return
        }

        // const listImage = [
        //     {
        //         base64: '',
        //         createdAt: new Date(),
        //         subtitle: 'Lorem ipsum dolor sit amet',
        //         title: 'Earlier this morning, NYC',
        //         uri: 'https://i.imgur.com/UPrs1EWl.jpg'
        //     },
        //     {
        //         base64: '',
        //         createdAt: new Date(),
        //         subtitle: 'Lorem ipsum dolor sit amet 22 2 2',
        //         title: 'Earlier this morning, NYC 3 3 3 3',
        //         uri: 'https://i.imgur.com/UPrs1EWl.jpg'
        //     }
        // ]

        const result = {
            categoryID: state.categoryID,
            categoryName: state.categoryName,
            listImage: listImage
        }
        if (props.addCategory) {
            props.addCategory(result)
        }
    }

    const onChooseUploadFile = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
            },
            (response) => {
                if (response.didCancel) {
                    // console.log('User cancelled photo picker');
                } else if (response.error) {
                    // console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    let listElement = listImage.slice()
                    console.log('response', response)
                    const element = {
                        base64: response.base64,
                        createdAt: new Date(),
                        subtitle: 'Lorem ipsum dolor sit amet 22 2 2',
                        title: 'Earlier this morning, NYC 3 3 3 3',
                        uri: ''
                    }
                    listElement.push(element)
                    setListImage(listElement)
                    // uploadImage(response)
                }
            },
        )
    }

    return (
        <View style={styles.container}>
            <Text style={{
                padding: scale(5), marginTop: verticalScale(10),
                fontSize: scale(20), fontWeight: 'bold', color: '#00f'
            }}>{`Thêm Danh mục`}</Text>
            <View style={styles.containerData}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                >
                    <InputText
                        label={'Mã Danh Mục'}
                        placeholder={'nhập mã danh mục...'}
                        text={state.categoryID}
                        onChangeInput={(value) => onChangeInput('categoryID', value)}
                        error={errors.categoryID}
                        autoFocus={true}
                        upperCase={true}
                    />
                    <InputText
                        label={'Tên Danh Mục'}
                        placeholder={'nhập tên danh mục...'}
                        text={state.categoryName}
                        onChangeInput={(value) => onChangeInput('categoryName', value)}
                        error={errors.categoryName}
                        autoFocus={true}
                    />
                    <View style={{
                        width: '100%',
                        flexDirection: 'column', alignItems: 'flex-start',
                    }}>
                        <ButtonOutline
                            title="Thêm ảnh"
                            onPress={() => onChooseUploadFile()}
                            containerStyle={{ marginVertical: 5 }}
                            titleStyle={{ color: '#00f' }}
                            buttonStyle={{
                                backgroundColor: 'transparent', borderColor: 'transparent',
                                height: verticalScale(40),
                            }}
                        />
                    </View>
                    {!!listImage && listImage.length > 0 &&
                        <CarouselMainLayout
                            data={listImage}
                        // title={`Main Layout`}
                        // subtitle={`Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots`}
                        />
                    }
                </KeyboardAwareScrollView>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'transparent' }}>
                <ButtonOutlineBottom
                    // title="Đồng ý"
                    onPress={() => handlerAdd()}
                    containerStyle={{ marginVertical: 5 }}
                    disabled={!listImage || listImage.length <= 0}
                // buttonStyle={styles.buttonStyle}
                // titleStyle={styles.titleStyle}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    containerData: {
        flex: 1,
        width: '100%',
        // maxHeight: calcHeight('50%'),
        // height:'100%'
    }
})

export default AddCategory