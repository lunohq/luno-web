import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import scroll from 'smoothscroll'

import Paper from 'material-ui/Paper'
import { ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import moment from 'u/moment'

import SelectableList from 'c/SelectableList'

import s from 'c/Reply/style.scss'

class ReplyList extends Component {

  componentDidUpdate() {
    const { reply } = this.props
    // Scroll to the top for new replies
    if (!reply.id) {
      const c = ReactDOM.findDOMNode(this.refs.container)
      scroll(0, undefined, undefined, c)
    }
  }

  render() {
    const { replyEdges, reply } = this.props
    const replyRows = []
    for (const index in replyEdges) {
      const { node } = replyEdges[index]
      let title = node.title
      if (!node.id) {
        title = 'New Reply'
      }
      // include space so empty changed still gets 2 lines
      let changed = ' '
      if (node.changed) {
        changed = moment(node.changed).format('MMM Do, YYYY')
        changed = t(`Last updated on ${changed}`)
      }
      replyRows.push(
        <ListItem
          key={index}
          onTouchTap={() => this.props.onChange(node)}
          primaryText={title}
          secondaryText={changed}
          style={{ lineHeight: '20px' }}
          value={node.id || 'new'}
        />
      )
      replyRows.push(<Divider key={`${index}-divider`} />)
    }

    return (
      <Paper className={s.root}>
        <Subheader className={s.header}>
          {t('Lunobot')}
          <div>
            <FlatButton
              disabled={!!!reply.id}
              label={t('Add Reply')}
              onTouchTap={this.props.onNew}
              primary
            />
          </div>
        </Subheader>
        <div className={s.content} ref='container'>
          <SelectableList defaultValue={reply.id || 'new'}>
              {replyRows}
          </SelectableList>
        </div>
      </Paper>
    )
  }
}

ReplyList.propTypes = {
  onChange: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired,
  reply: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  replyEdges: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      changed: PropTypes.string,
    }).isRequired,
  })).isRequired,
}

export default withStyles(s)(ReplyList)
