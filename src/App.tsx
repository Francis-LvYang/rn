import React from 'react'
import { Root } from 'native-base'
import AppContainer from './Router'
import { Provider } from "mobx-react"
import store from "./store/store"

interface Props {
  name: string
}

interface State {
  name: string
}

// 禁用warning提示
// console.disableYellowBox = true

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppContainer />
        </Root>
      </Provider>
    )
  }
}

export default App
