import React from 'react'
import BaseComponent from '../../Base'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class Fashbases extends BaseComponent {
    /**  */
    _FashchildClick() {
        console.warn('触发了子元素的方法');
    }

    /**  */
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => {this.props.parentClick('childer')}}><Text>这是测试</Text></TouchableOpacity>
                {this.props.children}
                <Text>这也是测试，{this.props.child}</Text>
            </View>
        )
    }
}
