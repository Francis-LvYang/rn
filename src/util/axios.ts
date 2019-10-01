import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { getToken, getClientType, getSign } from './tools'

const baseURL = 'http://192.168.2.33'

const instance: AxiosInstance = axios.create({
  baseURL,
  // 请求超时时间
  timeout: 10000,
  // 验证成功状态
  validateStatus: status => {
    return status >= 200 && status < 300
  }
})

/** 接口请求Header约定格式 */
interface RequestHeader {
  sign: string
  apiName: string
  token: string
  callTime: number
  clientType: string
  platformId: string | number
}

/** 接口请求参数约定格式 */
interface RequestJson {
  header: RequestHeader
  body: any
}

/** 统一数据返回格式 */
interface Response {
  code: number
  data: any
  message: string
}

/** 请求拦截 */
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.method === 'post') {
      // 对于上传图片或者文件会用formdata的形式
      if (config.data && config.data instanceof FormData) return config
      config.data = JSON.stringify(config.data)
    }
    return config
  },
  (err: AxiosRequestConfig) => {
    return Promise.reject(err)
  }
)

/** 响应拦截 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response === 'string') {
      response = JSON.parse(response)
    }
    // 登录过期
    // if (response.data && response.data.body && response.data.body.code === 1003) {

    // }
    return response
  },
  (err: any) => {
    let errorMessage = ''
    if (err.response) {
      switch (err.response.status) {
        case 400:
        case 404:
          errorMessage = '网络请求地址出错'
          break
        case 403:
          errorMessage = '您无访问权限'
          break
        case 500:
        case 502:
        case 503:
          errorMessage = '服务器维护中'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = '操作失败'
      }
      return Promise.reject(errorMessage)
    }
  }
)

class Api {
  /**
   * @param requestUrl 请求地址
   * @param params 请求参数
   * @param options 额外参数用来设置一些特殊请求类型等
   */
  static async post(requestUrl: string, params?: any, options?: any) {
    const param = this.setRequestHeader(requestUrl, params)

    const xhr = await instance({
      method: 'post',
      url: requestUrl,
      data: param,
      responseType: (options && options.responseType) || 'json',
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })

    return xhr
  }
  /**
   * 对接口返回进行统一处理
   * @param requestUrl 请求地址
   * @param params  请求参数
   * @param options 额外参数
   */
  static async fetch(requestUrl: string, params?: any, options?: any) {
    const res = await this.post(requestUrl, params, options)
    const body = res.data && res.data.body && res.data.body
    const code = (body && body.code) || 0
    const data = (body && body.data) || {}
    const message = (body && body.message) || ''
    // 响应统一格式
    const result: Response = { code, data, message }
    // 为了方便使用，返回一个Promise，后面直接用async 或者 .then的形式
    return Promise.resolve(result)
  }

  /** 设置请求参数的格式 */
  static setRequestHeader(url: string, params: any): RequestJson {
    const header: RequestHeader = {
      sign: `${getSign()}` || '0cfbaeedc58e9b3bef4eb6fbc1eb0990',
      apiName: url,
      token: `${getToken()}`,
      callTime: Date.now(),
      clientType: getClientType(),
      platformId: 1
    }

    const result: RequestJson = {
      header: header,
      body: params
    }

    return result
  }
}

export default Api
