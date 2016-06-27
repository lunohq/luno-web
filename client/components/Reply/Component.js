import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { reduxForm, Field, initialize } from 'redux-form'
import keycode from 'keycode'

import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import moment from 'u/moment'
import colors from 's/colors'

import TextField from 'c/ReduxForm/TextField'

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
    editing: false,
    focused: false,
    newReply: false,
    mightCancel: false,
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
    this.setState({ editing: false, focused: false })
  }

  focus() {
    this.refs.title.getRenderedComponent().focus()
  }

  resetScroll() {
    ReactDOM.findDOMNode(this.refs.container).scrollTop = 0
  }

  handleEdit = () => {
    this.refs.title.getRenderedComponent().focus()
    this.setState({ editing: true })
  }

  handleCancel = () => {
    const { onCancel, reset } = this.props
    this.setState({ editing: false, mightCancel: false })
    reset()
    onCancel()
  }

  handleSave = (values) => {
    this.setState({ editing: false })
    this.props.onSubmit(values)
  }

  handleCancelOnMouseEnter = () => this.setState({ mightCancel: true })
  handleCancelOnMouseLeave = () => this.setState({ mightCancel: false })

  handleDelete = () => this.props.onDelete(this.props.reply)

  handleFocus = () => this.setState({ editing: true })

  handleIgnoreEnter = (event) => {
    if (keycode(event) === 'enter') {
      event.preventDefault()
    }
  }

  render() {
    const { handleSubmit, pristine, valid, reply } = this.props
    const { editing } = this.state

    let actionButtons
    if (editing) {
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
          label={reply.id ? t('Update') : t('Create')}
          onTouchTap={handleSubmit(this.handleSave)}
          primary
        />,
      ]
    } else {
      actionButtons = [
        <IconButton key='edit' onTouchTap={this.handleEdit}>
          <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
        </IconButton>,
        <IconButton key='delete' onTouchTap={this.handleDelete}>
          <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
        </IconButton>,
      ]
    }

    let changed
    if (reply.changed && !editing) {
      changed = moment(reply.changed).format('MMM Do, YYYY')
      changed = t(`Last updated on ${changed}`)
    }

    return (
      <Paper className={s.root}>
        <Subheader className={s.header}>
          <div>
            {changed}
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
          </section>
        </div>
      </Paper>
    )
  }

}

Reply.propTypes = {
  focused: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  reply: PropTypes.object,
  reset: PropTypes.func.isRequired,
  valid: PropTypes.bool,
}

Reply.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default withStyles(s)(reduxForm({
  form: FORM_NAME,
  validate,
})(Reply))
