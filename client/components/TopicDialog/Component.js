import React, { Component, PropTypes } from 'react'

import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

import colors from 's/colors'
import withStyles from 'u/withStyles'
import t from 'u/gettext'

import Dialog from 'c/Dialog'
import DeleteDialog from 'c/DeleteDialog'
import Topic from 'c/Topic/Component'

import s from './style.scss'

class TopicDialog extends Component {

  state = {
    deleteDialogOpen: false,
  }

  handleSubmit = (values) => {
    const { topic, onSubmit, onCancel } = this.props
    // Only trigger submission if the topic has been updated, this prevents us
    // having to deal with duplicate updates to the topic name unneccesarily
    const changed = topic && topic.name !== values.topic.name
    if (!topic || changed) {
      return onSubmit(values)
    }
    return onCancel()
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  handlePrimaryAction = () => this.refs.form.submit()

  showDeleteDialog = () => this.setState({ deleteDialogOpen: true })
  hideDeleteDialog = () => this.setState({ deleteDialogOpen: false })
  handleDelete = () => {
    this.hideDeleteDialog()
    this.props.onDelete(this.props.topic)
  }

  render() {
    const { open, topic } = this.props

    const rightActions = [
      <FlatButton
        key='right-secondary'
        label={t('Cancel')}
        onTouchTap={this.handleCancel}
        secondary
      />,
      <FlatButton
        key='right-primary'
        label={topic ? t('Update') : t('Create')}
        onTouchTap={this.handlePrimaryAction}
        primary
      />,
    ]

    const leftActions = [
      <IconButton
        key='left-1'
        onTouchTap={this.showDeleteDialog}
        style={{ padding: '6px', height: '36px', width: '36px' }}
      >
        <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
      </IconButton>
    ]

    const actions = (
      <section className={s.actions}>
        <div>
          {topic ? leftActions : null}
        </div>
        <div>
          {rightActions}
        </div>
      </section>
    )

    let numReplies = 0
    if (topic && topic.replies && topic.replies.edges) {
      numReplies = topic.replies.edges.length
    }

    let message
    if (topic) {
      message = t(`All data related to "${topic.name}" will be deleted`)
      if (numReplies) {
        message = `${message}, including ${numReplies} replies.`
      } else {
        message = `${message}.`
      }
      message = `${message} Are you sure?`
    }

    return (
      <div>
        <Dialog
          actions={actions}
          modal
          open={open}
          onRequestClose={this.handleCancel}
          title={topic ? t('Edit Topic') : t('New Topic')}
        >
          <Topic ref='form' onSubmit={this.handleSubmit} topic={topic} />
        </Dialog>
        <DeleteDialog
          modal={false}
          onCancel={this.hideDeleteDialog}
          onConfirm={this.handleDelete}
          open={this.state.deleteDialogOpen}
          title={t('Delete Topic')}
        >
          <div>{message}</div>
        </DeleteDialog>
      </div>
    )
  }
}

TopicDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
  topic: PropTypes.object,
}

export default withStyles(s)(TopicDialog)
