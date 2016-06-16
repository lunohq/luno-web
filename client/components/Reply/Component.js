import React, { Component, PropTypes } from 'react'
import { reduxForm, Field, initialize } from 'redux-form'

import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import colors from 's/colors'

import TextField from 'c/ReduxForm/TextField'

import s from './style.scss'

export const FORM_NAME = 'form/reply'

const validate = values => {
  const errors = {}
  const requiredFields = ['title', 'body']
  requiredFields.forEach(field => {
    if (values.reply && !values.reply[field]) {
      errors[field] = 'Required'
      errors._error = true
    }
  })
  return errors
}

class Reply extends Component {

  state = {
    editing: false,
  }

  componentWillMount() {
    const { reply } = this.props
    if (reply) {
      this.initialize(reply)
    }
  }

  componentWillReceiveProps({ reply: nextReply }) {
    const { reply } = this.props
    const newReply = (reply && nextReply && reply.id !== nextReply.id) || (!reply && nextReply)
    if (newReply) {
      this.initialize(nextReply)
    }
  }

  initialize(reply) {
    const initialValues = { reply }
    this.context.store.dispatch(initialize(FORM_NAME, initialValues))
    this.setState({ editing: false })
  }

  handleEdit = () => {
    this.refs.title.getRenderedComponent().focus()
    this.setState({ editing: true })
  }

  handleCancel = () => {
    this.setState({ editing: false })
    this.props.reset()
  }

  handleDelete = () => this.props.onDelete(this.props.reply)
  handleSave = () => this.setState({ editing: false })
  handleFocus = () => this.setState({ editing: true })

  render() {
    const { pristine, valid, reply } = this.props
    const { editing } = this.state

    let actionButtons
    if (editing) {
      actionButtons = [
        <FlatButton
          key='cancel'
          label={t('Cancel')}
          onTouchTap={this.handleCancel}
          secondary
        />,
        <FlatButton
          disabled={(!reply && pristine) || !valid}
          key='create'
          label={reply ? t('Update') : t('Create')}
          onTouchTap={this.handleSave}
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

    return (
      <Paper className={s.root}>
        <Subheader className={s.header}>
          Last updated on
          <div>
            {actionButtons}
          </div>
        </Subheader>
        <section className={s.form}>
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelFixed
            floatingLabelText={t('Title')}
            fullWidth
            hintText={t('Add a title')}
            multiLine
            name='reply.title'
            onFocus={this.handleFocus}
            ref='title'
            withRef
          />
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelText={t('Reply')}
            floatingLabelFixed
            fullWidth
            hintText={t('Add a reply')}
            multiLine
            name='reply.body'
            onFocus={this.handleFocus}
            rows={2}
          />
        </section>
      </Paper>
    )
  }

}

Reply.propTypes = {
  onDelete: PropTypes.func.isRequired,
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
