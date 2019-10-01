import React from "react"
import { View, Text, TouchableOpacity} from "react-native"

interface Props {
  [propName: string]: any
}

export default class AppHeader extends React.Component<Props>{
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <View>
        <TouchableOpacity>
          {this.props.left}
        </TouchableOpacity>
        <View>
          {this.props.children}
        </View>
        <View>
          {this.props.right}
        </View>
      </View>
    )
  }
}