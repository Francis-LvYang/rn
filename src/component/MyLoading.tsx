import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Dimensions } from 'react-native'
import { UITools } from '../util/tools'

const { width, height } = Dimensions.get('window');

interface Props {
    [propName: string]: any
}

export default class Myloading extends React.Component<Props> {
    startTime: number | undefined;
    minShowingTime = 500;
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }
    /** 展示loading */
    async showLoading() {
        console.warn('loading触发l');
        await this.setIsLoading(true);
    }
    /** 隐藏loading */
    async dismissLoading() {
        await this.setIsLoading(false);
    }

    /** 设置state */
    setIsLoading(isLoading: boolean) {
        if (isLoading != this.state.isLoading) {
            let curTimeLong = new Date().getTime();
            if (isLoading) {
                this.startTime = curTimeLong;
                this.setState({
                    isLoading
                });
            } else {
                let hasShowingTimeLong = curTimeLong - this.startTime;
                if (hasShowingTimeLong < this.minShowingTime) {
                    setTimeout(() => {
                        this.setState({
                            isLoading
                        });
                    }, this.minShowingTime - hasShowingTimeLong);
                } else {
                    this.setState({
                        isLoading
                    });
                }
            }
        }
    }
    /**
     * 
     */
    componentDidMount() {
        this.setIsLoading(false);
    }

    render() {
        if(!this.state.isLoading) {
            return null
        }
        return (
            <view style={{
                flex: 1,
                width: width,
                height: height,
                position: 'absolute',
                backgroundColor: '#10101099'
            }} ref=''>
                <View style={styles.loading}>
                    <ActivityIndicator size={'large'} color="#98c379"/>
                    <Text style={styles.loadingTitle}>请稍后...</Text>
                </View>
            </view>
        )
    }
}

const styles = UITools(
    StyleSheet.create({
        Loading: {
            backgroundColor: '#10101099',
            height: 80,
            width: 100,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: (height - 80) / 2,
            left: (width - 100) / 2,
        },
        loadingTitle: {
            marginTop: 10,
            fontSize: 14,
            color: 'white'
        }
    })
)

