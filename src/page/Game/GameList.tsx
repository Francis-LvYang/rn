import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native'
import { UITools } from '../../util/tools'
import BaseComponent from '../../Base'

class GameList extends BaseComponent {

    state = {
        isShowingText: true,
        fadeAnim: new Animated.Value(0)
    }

    async interval() {
        await setInterval(() => {
            this.setState(previousState => {
                return { isShowingText: !previousState.isShowingText }
            });
        },1000)
    }

    componentDidMount() {
        // 每1000毫秒对showingText状态取反
        this.interval();
        // 动画
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 100,
                duration: 10000,
            }
        ).start()
    }

    componentWillUnmount() {}

    render() {
        let { fadeAnim } = this.state;
        if (!this.state.isShowingText) return ( <View><Text>null</Text></View> );
        return (
            <Animated.View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: fadeAnim
            }}>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        isShowingText: '0'
                    });
                }}>
                    <Text>游戏页面</Text>
                </TouchableOpacity>
                <View accessible={true}>
                    <Image
                        style={{
                            width: 51,
                            height: 51,
                            resizeMode: 'contain',
                        }}
                        source={{
                            uri:
                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                        }}/>
                </View>
                <TouchableOpacity>
                    <MyButton label="Press me!" />
                </TouchableOpacity>
            </Animated.View>
        )
    }
}

class MyButton extends BaseComponent {
    setNativeProps = (nativeProps: any) => {
        this._root.setNativeProps(nativeProps);
        console.log(nativeProps)
    }
    _root: any;

    render() {
        return (
            <View ref={component => this._root = component }{...this.props}>
                <Text>{this.props.label}</Text>
            </View>
        )
    }
}

const styles = UITools(
    StyleSheet.create({
        bananavarieties: {
            width: 150,
            height: 110,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center'
        }
    })
)

export default GameList