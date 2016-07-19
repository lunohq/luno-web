import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import scroll from 'smoothscroll'

import Paper from 'material-ui/Paper'
import { ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import moment from 'u/moment'
import colors from 's/colors'

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
    const { onEditTopic, onNew, replyEdges, reply, topic } = this.props
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
        changed = moment(node.changed).format('MMM D, YYYY')
        const updatedBy = node.updatedBy && node.updatedBy.username
        if (updatedBy) {
          changed = t(`Last updated by @${updatedBy} on ${changed}`)
        } else {
          changed = t(`Last updated on ${changed}`)
        }
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
          <div className={s.headerLeftContainer}>
            <div className={s.headerText}>
              {topic.name || t('Lunobot')}
              {(() => !topic.name ? null : (
                <IconButton
                  iconStyle={{ fontSize: '18px' }}
                  onTouchTap={onEditTopic}
                  style={{ padding: '4px', margin: '-5px 1px 0', height: '28px', width: '28px', verticalAlign: 'middle' }}
                >
                  <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
                </IconButton>
              ))()}
            </div>
          </div>
          <div>
            <FlatButton
              disabled={!!!reply.id}
              label={t('Add Reply')}
              onTouchTap={onNew}
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
  onEditTopic: PropTypes.func.isRequired,
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
  topic: PropTypes.object.isRequired,
}

export default withStyles(s)(ReplyList)
