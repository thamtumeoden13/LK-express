import React, { Component } from 'react';
// import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const DrawerIcon = ({navigation}) => {
    const openDrawer = () => {
        console.log('openDrawer', navigation)
        navigation.openDrawer()
    }

    return (
        <View style={{
            width: 44, height: 44, marginLeft: 20,
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Icon
                name='menu'
                size={20}
                color='black'
                onPress={openDrawer} />
        </View>
    )
};

export default (DrawerIcon);
// export default withNavigation(DrawerIcon);