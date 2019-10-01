import React from 'react'
import Api from './util/axios'
import { Toast } from 'native-base'
import { Platform, View } from 'react-native'
import { getToken, setToken, setSign, getSign, isObject, isArray } from './util/tools'
import AsyncStorage from '@react-native-community/async-storage'
import Myloading from './component/MyLoading'

interface Props {
  [propName: string]: any
}

interface State {
  [propName: string]: any
}

declare global {
  namespace NodeJS {
    interface Global {
      mLoadingComponentRef: string
    }
  }
}

class BaseComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      platform: Platform.OS === 'android' ? 'android' : 'ios'
    }
  }

  $fetch(requestUrl: string, params: any): Promise<any> {
    return Api.fetch(requestUrl, params)
  }

  $success(text: string) {
    return Toast.show({ text: text, type: 'success' })
  }

  $warning(text: string) {
    return Toast.show({ text: text, type: 'warning' })
  }

  $error(text: string) {
    return Toast.show({ text: text, type: 'danger' })
  }

  $getToken() {
    return getToken()
  }

  $setToken(token: string) {
    return setToken(token)
  }

  async $getSign() {
    return getSign()
  }

  async $setSign(value: string) {
    return setSign(value)
  }

  $isObject(object: any) {
    return isObject(object)
  }

  $isArray(objecy: any) {
    return isArray(objecy)
  }

  render() {
    return (
      <View style={{
        flex: 1,
        position: 'absolute'
      }}>
        {
          <Myloading ref={(ref: any) => {
            global.mLoadingComponentRef = ref;
          }}/>
        }
      </View>
    )
  }
}

export default BaseComponent
