import { isEqual } from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { reduxForm, Field, initialize, SubmissionError, change } from 'redux-form'
import keycode from 'keycode'
import { TextField, SelectField } from 'redux-form-material-ui'

import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import moment from 'u/moment'
import colors from 's/colors'

import DeleteDialog from './DeleteDialog'
import s from './style.scss'

export const FORM_NAME = 'form/reply'

class Reply extends Component {

  state = {
    deleting: false,
    editing: false,
    focused: false,
    newReply: false,
    mightCancel: false,
    deleteDialogOpen: false,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentDidMount() {
    if (this.props.focused) {
      this.focus()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { reply, createdTopic } = this.props
    const { reply: nextReply, createdTopic: nextCreatedTopic } = nextProps
    const newReply = (
      (reply && nextReply && !isEqual(reply, nextReply)) ||
      (!reply && nextReply)
    )
    if (newReply) {
      this.initialize(nextProps)
    }
    if (!this.state.focused && this.props.focused) {
      this.setState({ focused: true })
    }
    this.setState({ newReply }, () => this.setState({ newReply: false }))

    // TODO cleanup. we do this because we need to handle the user canceling
    // the creation of a new topic. as soon as you hit create topic, we default
    // you back to the original topic. if you successfully create a topic, that
    // will be used, but if you cancel, you'll go back to the original.
    const values = this.context.store.getState().form[FORM_NAME].values
    if (values && values.reply && values.reply.topic && values.reply.topic.id === 'create') {
      this.context.store.dispatch(change(FORM_NAME, 'reply.topic.id', this.props.topic.id))
    }

    const newTopic = nextCreatedTopic && (!createdTopic && nextCreatedTopic || createdTopic !== nextCreatedTopic)
    if (newTopic) {
      this.context.store.dispatch(change(FORM_NAME, 'reply.topic.id', nextCreatedTopic.id))
    }

    const editing = (
      (!this.props.error && nextProps.error) ||
      (this.props.pristine && !nextProps.pristine)
    )

    if (editing) {
      this.setState({ editing: true })
    }
  }

  componentDidUpdate() {
    if (!this.state.focused && this.props.focused) {
      this.focus()
    }
    if (this.state.newReply) {
      this.resetScroll()
    }
  }

  initialize({ reply }) {
    if (reply) {
      const initialValues = { reply }
      this.context.store.dispatch(initialize(FORM_NAME, initialValues))
    }
    this.setState({ deleting: false, editing: false, focused: false })
  }

  focus() {
    this.refs.title
      .getRenderedComponent()
      .getRenderedComponent()
      .focus()
  }

  resetScroll() {
    ReactDOM.findDOMNode(this.refs.container).scrollTop = 0
  }

  validate(values) {
    let error
    const errors = {}
    const requiredFields = ['title', 'body']
    requiredFields.forEach(field => {
      if (values.reply && !values.reply[field]) {
        if (!errors.reply) errors.reply = {}
        errors.reply[field] = t('Required')
      }
    })

    if (values.reply && values.reply.title && values.reply.title.split(' ').length > 15) {
      if (!errors.reply) errors.reply = {}
      errors.reply.title = t('Title cannot be more than 15 words')
    }
    if (Object.keys(errors).length) {
      error = new SubmissionError(errors)
    }
    return error
  }

  handleEdit = () => {
    this.refs.title
      .getRenderedComponent()
      .getRenderedComponent()
      .focus()
    this.setState({ editing: true })
  }

  handleCancel = () => {
    const { onCancel, reset } = this.props
    this.setState({ deleting: false, editing: false, mightCancel: false })
    reset()
    onCancel()
  }

  handleSave = (values) => {
    return new Promise((resolve, reject) => {
      const error = this.validate(values)
      if (error) {
        reject(error)
      } else {
        this.setState({ editing: false })
        resolve(this.props.onSubmit(values))
      }
    })
  }

  handleCancelOnMouseEnter = () => this.setState({ mightCancel: true })
  handleCancelOnMouseLeave = () => this.setState({ mightCancel: false })

  handleDelete = () => {
    this.hideDeleteDialog()
    this.setState({ deleting: true })
    return this.props.onDelete(this.props.reply)
  }
  displayDeleteDialog = () => this.setState({ deleteDialogOpen: true })
  hideDeleteDialog = () => this.setState({ deleteDialogOpen: false })

  handleFocus = () => this.setState({ editing: true })

  handleIgnoreEnter = (event) => {
    if (keycode(event) === 'enter') {
      event.preventDefault()
    }
  }

  render() {
    const {
      canCancel,
      error,
      handleSubmit,
      pristine,
      reply,
      submitting,
      topics,
      onNewTopic,
    } = this.props
    const { editing, deleting } = this.state

    let actionButtons
    if (editing || (error && !submitting && !deleting) || (!canCancel && !submitting)) {
      let primaryLabel
      if (error) {
        primaryLabel = t('Try Again')
      } else if (reply.id) {
        primaryLabel = t('Update')
      } else {
        primaryLabel = t('Create')
      }

      let handler
      if (deleting) {
        handler = this.handleDelete
      } else {
        handler = this.handleSave
      }
      actionButtons = [
        <FlatButton
          disabled={!canCancel}
          key='cancel'
          label={t('Cancel')}
          onMouseEnter={this.handleCancelOnMouseEnter}
          onMouseLeave={this.handleCancelOnMouseLeave}
          onTouchTap={this.handleCancel}
          secondary
        />,
        <FlatButton
          disabled={(!reply && pristine)}
          key='create'
          label={primaryLabel}
          onTouchTap={handleSubmit(handler)}
          primary
        />,
      ]
    } else if (submitting) {
      let label
      if (deleting) {
        label = t('Deleting...')
      } else if (reply.id) {
        label = t('Updating...')
      } else {
        label = t('Creating...')
      }
      actionButtons = [
        <FlatButton
          disabled
          key='submitting'
          label={label}
          primary
        />,
      ]
    } else {
      actionButtons = [
        <IconButton key='edit' onTouchTap={this.handleEdit} tooltip='Edit Reply'>
          <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
        </IconButton>,
        <IconButton key='delete' onTouchTap={this.displayDeleteDialog} tooltip='Delete Reply'>
          <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
        </IconButton>,
      ]
    }

    let message
    if (error) {
      if (deleting) {
        message = t('Internal error deleting reply.')
      } else {
        message = t('Internal error saving reply.')
      }
    } else if (reply.changed && !editing && !submitting) {
      const changed = moment(reply.changed).format('MMM D, YYYY')
      const updatedBy = reply.updatedBy && reply.updatedBy.username
      if (updatedBy) {
        message = t(`Last updated by @${updatedBy} on ${changed}`)
      } else {
        message = t(`Last updated on ${changed}`)
      }
    }

    const items = topics.map((topic, index) => {
      const props = {
        key: index,
        value: topic.id,
      }
      if (topic.name) {
        props.primaryText = topic.name
      } else {
        props.primaryText = t('None')
      }
      return <MenuItem {...props} />
    })
    items.unshift(
      <MenuItem
        key='create'
        value='create'
        primaryText={<span style={{ fontWeight: 'bold' }}>{t('Create Topic')}</span>}
        onTouchTap={onNewTopic}
      />
    )

    return (
      <Paper className={s.root}>
        <Subheader className={s.header}>
          <div className={s.headerLeftContainer}>
            <div className={error ? `${s.error} ${s.headerText}` : s.headerText }>{message}</div>
          </div>
          <div className={s.headerActionButtons}>
            {actionButtons}
          </div>
        </Subheader>
        <div className={s.content} ref='container'>
          <section className={s.form}>
            <Field
              autoComplete='off'
              className={s.field}
              component={TextField}
              disabled={submitting}
              floatingLabelFixed
              floatingLabelText={t('Title')}
              fullWidth
              hideError={this.state.mightCancel}
              hintText={t('Add a title')}
              multiLine
              name='reply.title'
              onFocus={this.handleFocus}
              onKeyDown={this.handleIgnoreEnter}
              ref='title'
              withRef
            />
            <Field
              autoComplete='off'
              component={TextField}
              disabled={submitting}
              className={s.field}
              floatingLabelText={t('Reply')}
              floatingLabelFixed
              fullWidth
              hideError={this.state.mightCancel}
              hintText={t('Add a reply')}
              multiLine
              name='reply.body'
              onFocus={this.handleFocus}
              rows={2}
            />
            <Field
              component={SelectField}
              disabled={submitting}
              floatingLabelText={t('Topic')}
              floatingLabelFixed
              labelStyle={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              name='reply.topic.id'
              style={{ width: '50%' }}
            >
              {items}
            </Field>
          </section>
        </div>
        <DeleteDialog
          onCancel={this.hideDeleteDialog}
          onConfirm={handleSubmit(this.handleDelete)}
          open={this.state.deleteDialogOpen}
          reply={reply}
        />
      </Paper>
    )
  }

}

Reply.propTypes = {
  canCancel: PropTypes.bool,
  createdTopic: PropTypes.object,
  error: PropTypes.object,
  focused: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onNewTopic: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  reply: PropTypes.object,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  topic: PropTypes.object.isRequired,
  topics: PropTypes.array.isRequired,
  valid: PropTypes.bool,
}

Reply.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(Reply))
