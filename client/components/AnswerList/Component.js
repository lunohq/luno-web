import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper'
import { ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import moment from 'u/moment'

import SelectableList from 'c/SelectableList'

import s from './style.scss'

class AnswerList extends Component {

  render() {
    const { answerEdges, answer } = this.props
    const answerRows = []
    for (const index in answerEdges) {
      const { node } = answerEdges[index]
      let title = node.title
      if (!node.id) {
        title = 'New Answer'
      }
      // include space so empty changed still gets 2 lines
      let changed = ' '
      if (node.changed) {
        changed = moment(node.changed).format('MMM Do, YYYY')
        changed = t(`Last updated on ${changed}`)
      }
      answerRows.push(
        <ListItem
          key={index}
          onTouchTap={() => this.props.onChange(node)}
          primaryText={title}
          secondaryText={changed}
          value={node.id || 'new'}
        />
      )
      answerRows.push(<Divider key={`${index}-divider`} />)
    }

    return (
      <Paper className={s.root}>
        <SelectableList defaultValue={answer.id || 'new'}>
          <Subheader className={s.header}>
            Lunobot
            <div>
              <FlatButton
                disabled={!!!answer.id}
                label={t('Add Reply')}
                onTouchTap={this.props.onNew}
                primary
              />
            </div>
          </Subheader>
          {answerRows}
        </SelectableList>
      </Paper>
    )
  }
}

AnswerList.propTypes = {
  answer: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  answerEdges: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      changed: PropTypes.string,
    }).isRequired,
  })).isRequired,
  onNew: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default withStyles(s)(AnswerList)
