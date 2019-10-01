import React from 'react'
import BaseComponent from '../../Base'
import { View, ScrollView, Image, Text, ImageBackground, StyleSheet, StatusBar, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { UITools, platformName } from '../../util/tools'
import { RRCLoading } from 'react-native-overlayer'
import DeviceInfo from 'react-native-device-info'
import { observer, inject } from 'mobx-react'
import md5 from 'md5'


interface Props {
  [propName: string]: any
}

@inject('store')
@observer
export default class Login extends BaseComponent {
  constructor(props: Props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      loading: false,
      userNameError: false,
      passwordError: false
    }
    RRCLoading.setLoadingOptions({
      text: 'gogogo',
      loadingBackgroundColor: 'rgba(0,0,0,0.0)',
      loadingImage: '',
      loadingViewStyle: { backgroundColor: 'rgba(0,0,0,0.8)' },
      loadingTextStyle: {}
    })
  }

  // 发送登录请求
  async LoginAction() {
    if (this.state.userName === '') {
      return await this.setState({ userNameError: true })
    }

    if (this.state.password === '') {
      return await this.setState({ passwordError: true })
    }

    await this.setState({ loading: true })

    RRCLoading.setLoadingOptions({
      text: 'loading',
      loadingImage: ''
    });

    RRCLoading.show('加载中');

    const res = await this.$fetch('/lottery-login-api/user/login', {
      auxiliaryCode: DeviceInfo.getUniqueID(),
      deviceCode: platformName(),
      appVersion: 'v1.0.1',
      userName: this.state.userName,
      password: md5(this.state.password)
    })

    RRCLoading.hide()

    await this.setState({ loading: false })

    if (res.code !== 1) return this.$error(res.message)

    if (res.code === 1) {
      // 提示登录成功
      this.$success(res.message)
      // 跳转到首页
      this.props.navigation.navigate('Home')
      // 设置用户名
      this.props.store.setStoreUserName(res.data.userName)
    }
  }

  render() {
    return (
      <ScrollView>
        <StatusBar backgroundColor='#0f5f7a' barStyle='light-content' />
        <ImageBackground source={require('../../assets/imgs/1997香港彩/登录背景1.png')} style={styles.loginBg}>
          <TouchableOpacity style={styles.backBtnWrapper} onPress={() => this.props.navigation.navigate('Home')}>
            <Image source={require('../../assets/images/back.png')} style={styles.backBtnImage} />
          </TouchableOpacity>
          <View style={styles.logoWrapper}>
            <Image source={{ uri: this.props.store.platformInfo.chatLogoUrl }} style={styles.logoImage} />
          </View>
        </ImageBackground>

        <View style={styles.formWrapper}>
          <View style={styles.textInputWrapper}>
            <Image source={require('../../assets/imgs/public/登录-账号.png')} style={styles.inputIcon} />
            <TextInput onChangeText={text => this.setState({ userName: text })} style={[styles.textInput, this.state.userNameError && styles.textInputError]} placeholder='请输入用户名' />
          </View>

          <View style={styles.textInputWrapper}>
            <Image source={require('../../assets/imgs/public/登录-密码.png')} style={styles.inputIcon} />
            <TextInput
              secureTextEntry={true}
              onChangeText={text => this.setState({ password: text })}
              style={[styles.textInput, this.state.passwordError && styles.textInputError]}
              placeholder='请输入密码'
            />
          </View>

          <TouchableOpacity style={styles.forgetPassword}>
            <Text style={styles.forgetPasswordText}>忘记密码?</Text>
          </TouchableOpacity>

          <View style={styles.textInputWrapper}>
            <TouchableOpacity style={styles.loginBtnWrapper} onPress={() => this.LoginAction()}>
              <ImageBackground source={require('../../assets/imgs/1997香港彩/登录按钮-按钮.png')} style={styles.loginBtnBg}>
                {this.state.loading ? <ActivityIndicator color='white' /> : <Text style={styles.loginText}>登录</Text>}
              </ImageBackground>
              <Image source={require('../../assets/imgs/1997香港彩/登录按钮-投影.png')} style={styles.loginBtnShadow} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = UITools(
  StyleSheet.create({
    loginBg: {
      width: '100%',
      height: 340,
      position: 'relative'
    },
    logoWrapper: {
      width: 200,
      height: 200,
      backgroundColor: '#999',
      position: 'absolute',
      left: '50%',
      marginLeft: -100,
      bottom: -80,
      borderRadius: 100,
      overflow: 'hidden'
    },
    logoImage: {
      width: 200,
      height: 200
    },
    backBtnWrapper: {
      paddingHorizontal: 20,
      paddingVertical: 30,
      width: 80
    },
    backBtnImage: {
      width: 24,
      height: 42
    },
    formWrapper: {
      marginTop: 120
    },
    textInputWrapper: {
      marginTop: 40,
      flexDirection: 'row',
      flex: 1,
      marginHorizontal: 60
    },
    textInput: {
      width: '100%',
      height: 88,
      borderWidth: 2,
      borderColor: '#d7d7d7',
      borderRadius: 44,
      paddingLeft: 80
    },
    textInputError: {
      borderColor: '#c66'
    },
    inputIcon: {
      width: 40,
      height: 40,
      position: 'absolute',
      top: 24,
      left: 24
    },
    forgetPassword: {
      marginTop: 30,
      marginLeft: 100,
      width: 160
    },
    forgetPasswordText: {
      lineHeight: 40,
      color: '#999'
    },
    loginBtnWrapper: {
      width: '100%'
    },
    loginBtnBg: {
      flex: 1,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center'
    },
    loginText: {
      color: '#fff',
      fontSize: 28
    },
    loginBtnShadow: {
      height: 30,
      width: '100%'
    }
  })
)
