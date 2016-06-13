import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper'
import { List, ListItem, MakeSelectable } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './style.scss'

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

class RepliesList extends Component {

  render() {
    const { replies } = this.props
    const replyRows = []
    for (const index in replies) {
      const {node: {title, id } } = replies[index]
      replyRows.push(
        <ListItem
          primaryText={title}
          secondaryText={`Last updated on ${id}`}
          value={`${index}`}
          key={index}
        />
      )
      replyRows.push(<Divider key={`${index}-divider`}/>)
    }

    return (
      <Paper className={s.replyListPane}>
        <SelectableList defaultValue='0'>

          <Subheader className={s.header}>
            Lunobot
            <div>
              <FlatButton label="Add Reply" primary={true} />
            </div>
          </Subheader>

          {replyRows}

        </SelectableList>
      </Paper>
    )
  }
}

export default withStyles(s)(RepliesList)
