import React, { Component } from 'react';
// import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const BackIcon = ({navigation}) => {
    const openDrawer = () => {
        console.log('openDrawer', navigation)
        navigation.goBack()
    }

    return (
        <View style={{
            width: 44, height: 44, marginLeft: 20,
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Icon
                name='arrow-left'
                size={20}
                color='black'
                onPress={openDrawer} />
        </View>
    )
};

export default (BackIcon);
// export default withNavigation(BackIcon);