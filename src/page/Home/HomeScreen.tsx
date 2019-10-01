import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import { observer, inject } from 'mobx-react'
import DeviceInfo from 'react-native-device-info'
import { RRCAlert, RRCToast } from 'react-native-overlayer'
import { UITools, platformName } from '../../util/tools'
import BaseComponent from '../../Base'
import Fashbases from './Fashbases'

interface Props {
  [propName: string]: any
}

@inject('store')
@observer
class HomeScreen extends BaseComponent {
  constructor(props: Props) {
    super(props)
    this.state = {
      homePageInfo: {},
      userInfo: {}
    }
    RRCToast.setToastOptions({
      toastBackgroundColor: 'rgba(0,0,0,0)',
      toastViewStyle: {},
      toastTextStyle: {},
      durationTime: 3000
    })
    RRCAlert.setAlertOptions({
      alertBackgroundColor: 'rgba(0,0,0,0.3)',
      titleViewStyle: {},
      titleTextStyle: {},
      contentTextStyle: {}
    })
  }

  /** 生命周期， 组件挂载完成 */
  componentDidMount() {
    if (this.props.store.userName !== '') {
      this.getUserInfo()
    }
    // 获取首页配置信息
    this.getHomePageInfo()
    // 获取平台相关配置
    this.getConfigByPlatformId()
  }

  // 获取全局配置
  async getConfigByPlatformId() {
    const res = await this.$fetch('/config-api/chatConfig/getChatConfigByPlatformId', {})
    if (res.code !== 1) return this.$error(res.message)
    // 设置平台相关信息，如logo，是否开启了聊天功能等
    if (typeof res.data === 'object' && res.data.constructor === Object) {
      this.props.store.setPlatformInfo(res.data)
    }
  }

  /** 获取快速入口 */
  async getHomePageInfo() {
    const res = await this.$fetch('/config-api/homePage/queryHomePageInfo', {})
    if (res.code !== 1) return this.$error(res.message)
    if (this.$isObject(res.data)) {
      this.setState({ homePageInfo: res.data })
    }
  }

  /** 获取用户信息 */
  async getUserInfo() {
    const res = await this.$fetch('/lottery-api/user/getUserDetail', {})
    //if (res.code !== 1) return this.$error(res.message)
    if (this.$isObject(res.data)) {
      this.setState({ userInfo: res.data })
      console.log(res.data)
    }
  }

  /**试玩登录 */
  async traiLog() {
    const res = await this.$fetch("/lottery-login-api/user/trialRegister", {
      deviceCode: DeviceInfo.getUniqueID(),
      auxiliaryCode: platformName(),
      appVersion: "v1.0.1",
      sourceType: 3
    });
    if(res.code === 1) {
      RRCToast.show('操作成功', 1, 1500);
      this.$success(res.message);
      this.props.navigation.navigate('MyInfo');
    }
  }

  /** 触发子组件事件 */
  async _flagClick() {
    console.warn('触发事件了');
  }

  /** 传值给子组件 */
  async _parentClick(item: any) {
    console.warn('父组件的方法' + '子组件的内容' + item);
  }

  /** 将onPress处理函数中的操作封装到 */
  handleOnPress() {
    requestAnimationFrame(() => {
      RRCAlert.alert('loading and alert')
    })
  }

  render() {
    let bannerList = [],
      entryList = [],
      hotLotteryList = [],
      thirdGameList = []

    if (this.state.homePageInfo && this.state.homePageInfo.bannerList instanceof Array) {
      bannerList = this.state.homePageInfo.bannerList
    }

    if (this.state.homePageInfo && this.state.homePageInfo.shortcutEntryList instanceof Array) {
      entryList = this.state.homePageInfo.shortcutEntryList
    }

    if (this.state.homePageInfo && this.state.homePageInfo.hotLotteryList instanceof Array) {
      hotLotteryList = this.state.homePageInfo.hotLotteryList
    }

    if (this.state.homePageInfo && this.state.homePageInfo.thirdPlatformList instanceof Array) {
      thirdGameList = this.state.homePageInfo.thirdPlatformList
    }
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor='#03536e' barStyle='light-content' />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.text}>{ this.props.store.userName ?  this.props.store.userName : '登录/注册'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => { this.handleOnPress() }}>
            <Text style={styles.text}>1号平台998</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.traiLog()
          }}>
            <Text style={styles.text}>试玩</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.wrapper}>
            <Swiper
              style={styles.scrollWrapper}
              paginationStyle={styles.paginationStyle}
              activeDotColor={'#ff9'}
              dotStyle={styles.dotStyle}
              activeDotStyle={styles.activeDotStyle}
              autoplay={true}
              autoplayTimeout={5}
              loop={true}>
              {bannerList.map((item: any, index: number) => {
                return (
                  <View style={styles.swiperItem} key={index}>
                    <Image source={{ uri: item.appImageUrl }} style={styles.swiperItem} />
                  </View>
                )
              })}
            </Swiper>
          </View>

          <View style={styles.shotEntryList}>
            {entryList.map((item: any, index: number) => {
              return (
                <View style={styles.shotEntryItem} key={index}>
                  <Image source={{ uri: item.logoUrl }} style={styles.shotEntryIcon} />
                  <Text style={styles.shotEntryText}>{item.shortcutEntryName}</Text>
                </View>
              )
            })}
          </View>

          <View style={styles.lotteryListWrapper}>
            {hotLotteryList.map((item: any, index: number) => {
              return (
                <View style={styles.lotteryItem} key={index}>
                  <View style={styles.lotterLogoWrapper}>
                    <Image source={{ uri: item.logoUrl }} style={styles.lotteryLogo} />
                  </View>
                  <Text>{item.lotteryName}</Text>
                </View>
              )
            })}
          </View>

          <View style={styles.thirdGameList}>
            {thirdGameList.map((item: any, index: number) => {
              return (
                <View style={styles.thirdGameItem} key={index}>
                  <Image source={{ uri: item.thirdGameLogoUrl }} style={styles.thirdGameImage} />
                </View>
              )
            })}
          </View>

          <View style={styles.bottomGameItem}>
            <TouchableOpacity onPress={() => {this.refs.Fash._FashchildClick()}}>
              <Text>查看详情~~</Text>
            </TouchableOpacity>
            <Fashbases ref='Fash' parentClick={this._parentClick} child='父元素传递的值21'>
              <TouchableOpacity onPress={this._flagClick}>
                <Text>这是组件内部的展示数据</Text>
              </TouchableOpacity>
            </Fashbases>
          </View>

        </ScrollView>
      </View>
    )
  }
}

const styles = UITools(
  StyleSheet.create({
    container: {
      width: '100%'
    },
    header: {
      height: 90,
      backgroundColor: '#03536e',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10
    },
    text: {
      color: '#fff'
    },
    wrapper: {
      margin: 10,
      borderRadius: 5,
      overflow: 'hidden'
    },
    scrollWrapper: {
      width: '100%',
      flexDirection: 'row',
      height: 280
    },
    swiperItem: {
      flexGrow: 1,
      height: 280,
      backgroundColor: '#333',
      borderRadius: 10
    },
    paginationStyle: {
      bottom: 10,
      marginRight: 20,
      justifyContent: 'flex-end'
    },
    activeDotStyle: {
      width: 30,
      height: 8
    },
    dotStyle: {
      width: 8,
      height: 8,
      borderRadius: 4
    },
    shotEntryList: {
      marginTop: 30,
      flex: 1,
      flexDirection: 'row',
      borderBottomColor: '#999'
    },
    shotEntryIcon: {
      width: 98,
      height: 98
    },
    shotEntryText: {
      fontSize: 24,
      marginTop: 20
    },
    shotEntryItem: {
      width: '25%',
      alignItems: 'center'
    },
    lotteryListWrapper: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    lotteryItem: {
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#d7d7d7',
      borderBottomWidth: 1.4
    },
    lotterLogoWrapper: {
      margin: 20,
      width: 100,
      height: 100,
      overflow: "hidden"
    },
    lotteryLogo: {
      width: 100,
      height: 100
    },
    thirdGameList: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 20,
      flexWrap: 'wrap',
      marginBottom: 60
    },
    thirdGameImage: {
      width: '95%',
      height: 180
    },
    thirdGameItem: {
      marginTop: 20,
      width: '50%',
      height: 180,
      alignItems: 'center'
    },
    bottomGameItem: {
      width: -Dimensions.get('window').width,
      height: 200,
      alignItems: 'center',
      marginBottom: 100
    }
  })
)

export default HomeScreen