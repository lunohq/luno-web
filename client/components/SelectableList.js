import React, { Component, PropTypes } from 'react'
import { List, MakeSelectable } from 'material-ui/List'

let SelectableList = MakeSelectable(List)

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.string.isRequired,
    }

    componentWillMount() {
      this.initialize(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.initialize(nextProps)
    }

    initialize(props) {
      this.setState({
        selectedIndex: props.defaultValue,
      })
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      })
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      )
    }
  }
}

SelectableList = wrapState(SelectableList)

export default SelectableList
