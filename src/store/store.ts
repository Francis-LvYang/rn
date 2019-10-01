import { observable, computed, action, runInAction } from 'mobx'

class AppState {
  // 获取平台信息
  @observable platformInfo: any = {}
  // 用户名
  @observable userName: string = ''
  // 更改用户名
  @action.bound setStoreUserName(value: string): void {
    this.userName = value
  }
  // 从接口获取平台信息并设置
  @action.bound setPlatformInfo(info: any): void {
    this.platformInfo = info
  }
}

export default new AppState()
