
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from "react-navigation";

import HomeScreen from "./page/Home/HomeScreen"
import GameList from "./page/Game/GameList"
import Login from "./page/Login/Login";


function DepositAndWithdraw() {
  return <View><Text>充值提现</Text></View>
}
function LotteryRecord() {
  return <View><Text>购彩记录</Text></View>
}
function MyInfo() {
  return <View><Text>首页</Text></View>
}

const styles = StyleSheet.create({
  icon: { width: 24, height: 24 }
});

const TabNavigator = createBottomTabNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: "首页",
      tabBarIcon: (item: any) => {
        return <Image style={styles.icon} source={ item.focused ? require('./assets/imgs/public/home-active.png') : require('./assets/imgs/public/home.png') }/>
      }
    }
  },
  GameList: {
    screen: GameList,
    navigationOptions: {
      tabBarLabel: "游戏大厅",
      tabBarIcon: (item: any) => {
        return <Image style={styles.icon} source={ item.focused ? require('./assets/imgs/public/gamehall-active.png') : require('./assets/imgs/public/gamehall.png') }/>
      }
    }
  },
  DepositAndWithdraw: {
    screen: DepositAndWithdraw,
    navigationOptions: {
      tabBarLabel: "充值提现",
      tabBarIcon: (item: any) => {
        return <Image style={styles.icon} source={ item.focused ? require('./assets/imgs/1997香港彩/主菜单-资金管理-点击.png') : require('./assets/imgs/1997香港彩/主菜单-资金管理-默认.png') }/>
      }
    }
  },
  LotteryRecord: {
    screen: LotteryRecord,
    navigationOptions: {
      tabBarLabel: "购彩记录",
      tabBarIcon: (item: any) => {
        return <Image style={styles.icon} source={ item.focused ? require('./assets/imgs/public/lot-active.png') : require('./assets/imgs/public/lot.png') }/>
      }
    }
  },
  MyInfo: {
    screen: MyInfo,
    navigationOptions: {
      tabBarLabel: "我的",
      tabBarIcon: (item: any) => {
        return <Image style={styles.icon} source={ item.focused ? require('./assets/imgs/public/uc-active.png') : require('./assets/imgs/public/uc.png') }/>
      }
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: "#09799e",
    inactiveTintColor: "#999999",
    style: {
      borderTopWidth: 1,
      borderTopColor: "#e7e7e7"
    }
  }
});

const stackNavigator = createStackNavigator(
  {
    Home: {
      screen: TabNavigator
    },
    Login: Login
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(stackNavigator);

export default AppContainer