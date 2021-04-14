import React, { Component } from 'react';
// import { withNavigation } from '@react-navigation/compat'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const BagIcon = ({ navigation }) => {
    const openBag = () => {
        console.log('openBag')
        // navigation.openDrawer()
    }

    return (
        <View style={{
            width: 44, height: 44, marginRight: 20,
            justifyContent: 'center', alignItems: 'center'
        }}>
            <Icon
                name='bag'
                size={20}
                color='black'
                onPress={openBag}
            />
        </View>
    )
};

export default (BagIcon);
// export default withNavigation(BagIcon);