import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { reduxForm, Field, initialize } from 'redux-form'
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

const validate = values => {
  const errors = {}
  const requiredFields = ['title', 'body']
  requiredFields.forEach(field => {
    if (values.reply && !values.reply[field]) {
      if (!errors.reply) errors.reply = {}
      errors.reply[field] = t('Required')
      errors._error = true
    }
  })

  if (values.reply && values.reply.title && values.reply.title.split(' ').length > 15) {
    if (!errors.reply) errors.reply = {}
    errors.reply.title = t('Title cannot be more than 15 words')
  }

  return errors
}

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
    const { reply } = this.props
    const { reply: nextReply } = nextProps
    const newReply = (
      (reply && nextReply && reply !== nextReply) ||
      (!reply && nextReply)
    )
    if (newReply) {
      this.initialize(nextProps)
    }
    if (!this.state.focused && this.props.focused) {
      this.setState({ focused: true })
    }
    this.setState({ newReply }, () => this.setState({ newReply: false }))

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

  initialize({ reply, topic }) {
    if (reply) {
      reply.topicId = topic.id
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
    this.setState({ editing: false })
    return this.props.onSubmit(values)
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
      error,
      handleSubmit,
      pristine,
      valid,
      reply,
      submitting,
      topics,
    } = this.props
    const { editing, deleting } = this.state

    let actionButtons
    if (editing || (error && !submitting && !deleting)) {
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
          key='cancel'
          label={t('Cancel')}
          onMouseEnter={this.handleCancelOnMouseEnter}
          onMouseLeave={this.handleCancelOnMouseLeave}
          onTouchTap={this.handleCancel}
          secondary
        />,
        <FlatButton
          disabled={(!reply && pristine) || !valid}
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
        <IconButton key='edit' onTouchTap={this.handleEdit}>
          <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
        </IconButton>,
        <IconButton key='delete' onTouchTap={this.displayDeleteDialog}>
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
      const changed = moment(reply.changed).format('MMM Do, YYYY')
      message = t(`Last updated on ${changed}`)
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

    return (
      <Paper className={s.root}>
        <Subheader className={s.header}>
          <div>
            <span className={error ? s.error : '' }>{message}</span>
          </div>
          <div>
            {actionButtons}
          </div>
        </Subheader>
        <div className={s.content} ref='container'>
          <section className={s.form}>
            <Field
              autoComplete='off'
              className={s.field}
              component={TextField}
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
              name='reply.topicId'
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
  error: PropTypes.object,
  focused: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
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

export default withStyles(s)(reduxForm({
  form: FORM_NAME,
  validate,
})(Reply))
