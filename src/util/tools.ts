import React from 'react'
import { Platform, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

/** 获取平台名称 */
export function platformName() {
  return Platform.OS === 'android' ? 'android' : 'ios'
}

/** 获取客户端类型 */
export function getClientType(): string {
  return platformName() === 'android' ? '2' : '3'
}

/** 获取 token */
export async function getToken() {
  let token: string | null = ''
  try {
    token = await AsyncStorage.getItem('token')
  } catch (e) {
    token = ''
  }
  return token
}

/** 设置 token */
export async function setToken(value: string) {
  await AsyncStorage.setItem('token', value)
}

/** 获取签名 */
export async function getSign() {
  const sign = await AsyncStorage.getItem('sign')
  if (!sign) return ''
  return sign
}

/** 设置签名 */
export async function setSign(value: string) {
  await AsyncStorage.setItem('token', value)
}

/** 判断是否是对象 */
export function isObject(obj: any) {
  return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
}

/** 判断是否是数组 */
export function isArray(arr: any) {
  return Object.prototype.toString.call(arr).toLowerCase() === '[object array]'
}

/** 适配设计稿 */
export function UITools(object: any) {
  // 如果不是对象， 不做处理
  if (!isObject(object)) return
  // 返回的对象
  const result: any = {}
  // 设备宽度，单位 dp
  const deviceWidthDp = Dimensions.get('window').width
  // 设计稿宽度（这里为750px），单位 px
  const uiWidthPx = 750
  // 部分属性是不需要处理的 如flex
  const whiteList = ['flex', 'flexShrink', 'flexGrow']
  // 如果是对象，针对对象中的dp进行转化处理
  for (var item in object) {
    result[item] = {}
    for (var key in object[item]) {
      if (typeof object[item][key] === 'number' && !whiteList.includes(object[item][key])) {
        // 根据比例等比转化dp为设计稿像素 转化成整数，以便rn计算
        result[item][key] = (object[item][key] * deviceWidthDp) / uiWidthPx
      } else {
        result[item][key] = object[item][key]
      }
    }
  }
  return result
}
