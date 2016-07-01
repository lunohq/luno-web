import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, initialize } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

import colors from 's/colors'
import withStyles from 'u/withStyles'
import t from 'u/gettext'

import Dialog from 'c/Dialog'
import DeleteDialog from 'c/DeleteDialog'

import s from './style.scss'

export const FORM_NAME = 'form/topic'

class TopicDialog extends Component {

  state = {
    deleteDialogOpen: false,
    deleting: false,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { topic } = this.props
    const { topic: nextTopic } = nextProps
    const shouldInit = (
      (!this.props.open && nextProps.open) ||
      topic !== nextTopic
    )
    if (shouldInit) {
      this.initialize(nextProps)
    }
  }

  initialize({ topic }) {
    const initialValues = { topic }
    this.context.store.dispatch(initialize(FORM_NAME, initialValues))
    this.setState({ deleting: false })
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

  handleCancel = () => this.props.onCancel()
  showDeleteDialog = () => this.setState({ deleteDialogOpen: true })
  hideDeleteDialog = () => this.setState({ deleteDialogOpen: false })
  handleDelete = () => {
    this.hideDeleteDialog()
    this.setState({ deleting: true })
    return this.props.onDelete(this.props.topic)
  }

  render() {
    const { open, topic, submitting, handleSubmit } = this.props
    const { deleting } = this.state

    let rightActions
    if (submitting) {
      let label
      if (deleting) {
        label = t('Deleting...')
      } else if (topic) {
        label = t('Updating...')
      } else {
        label = t('Creating...')
      }
      rightActions = [
        <FlatButton
          disabled
          key='submitting'
          label={label}
          primary
        />
      ]
    } else {
      rightActions = [
        <FlatButton
          key='right-secondary'
          label={t('Cancel')}
          onTouchTap={this.handleCancel}
          secondary
        />,
        <FlatButton
          key='right-primary'
          label={topic ? t('Update') : t('Create')}
          onTouchTap={handleSubmit(this.handleSubmit)}
          primary
        />,
      ]
    }

    const leftActions = [
      <IconButton key='left-1' onTouchTap={this.showDeleteDialog}>
        <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
      </IconButton>
    ]

    const actions = (
      <section className={s.actions}>
        <div>
          {topic && !submitting ? leftActions : null}
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
          <section>
            <Field
              autoComplete='off'
              className={s.field}
              component={TextField}
              disabled={submitting}
              floatingLabelFixed
              floatingLabelText={t('Topic Name')}
              fullWidth
              hintText={t('Add name')}
              name='topic.name'
              ref={field => {
                if (field) {
                  field
                    .getRenderedComponent()
                    .getRenderedComponent()
                    .focus()
                }
              }}
              withRef
            />
          </section>
        </Dialog>
        <DeleteDialog
          modal={false}
          onCancel={this.hideDeleteDialog}
          onConfirm={handleSubmit(this.handleDelete)}
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
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
  submitting: PropTypes.bool,
  topic: PropTypes.object,
}

TopicDialog.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(TopicDialog))
