import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer'
import { List, ListItem, MakeSelectable } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'

let SelectableList = MakeSelectable(List)

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.string.isRequired,
    }

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
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

const Navigation = () => (
  <Drawer containerStyle={{left: NAV_WIDTH}}>
    <SelectableList defaultValue={'1'}>
      <ListItem primaryText={t('Lunobot')} value={'1'} />
    </SelectableList>
  </Drawer>
)

export default Navigation
