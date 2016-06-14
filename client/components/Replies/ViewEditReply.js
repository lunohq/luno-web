import React, { Component, PropTypes } from 'react'
import { reduxForm, Field, destroy, initialize } from 'redux-form'

import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import MaterialTextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import colors from 's/colors'

import DeleteDialog from './DeleteDialog'

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

class TextField extends Component {

  focus = () => {
    this.refs.field.focus()
  }

  render() {
    return <MaterialTextField ref='field' {...this.props} />
  }

}

class ViewEditReply extends Component {

  state = {
    editing: false,
    showDeleteDialog: false,
  }

  componentWillMount() {
    if (this.props.reply) {
      this.initialize(this.props.reply)
    }
  }

  componentWillReceiveProps(nextProps) {
    const newReply = (
      (this.props.reply && nextProps.reply && this.props.reply.id !== nextProps.reply.id) ||
      (!this.props.reply && nextProps.reply)
    )
    if (newReply) {
      this.initialize(nextProps.reply)
    }
  }

  initialize(reply) {
    const initialValues = {reply}
    this.context.store.dispatch(initialize(FORM_NAME, initialValues))
    this.setState({editing: false})
  }

  handleEdit = () => {
    this.refs.title.getRenderedComponent().focus()
    this.setState({editing: true})
  }

  handleCancel = () => {
    this.setState({editing: false})
    this.props.reset()
  }

  handleSave = () => this.setState({editing: false})
  handleFocus = () => this.setState({editing: true})

  showDeleteDialog = () => this.setState({ showDeleteDialog: true })
  hideDeleteDialog = () => this.setState({ showDeleteDialog: false })
  handleDeleteReply = () => {
    this.hideDeleteDialog()
  }

  render() {
    const { pristine, valid, initialValues } = this.props
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
          disabled={(!initialValues && pristine) || !valid}
          key='create'
          label={initialValues ? t('Update') : t('Create')}
          onTouchTap={this.handleSave}
          primary
        />,
      ]
    } else {
      actionButtons = [
        <IconButton key='edit' onTouchTap={this.handleEdit}>
          <FontIcon className='material-icons' color={colors.darkGrey}>edit</FontIcon>
        </IconButton>,
        <IconButton key='delete' onTouchTap={this.showDeleteDialog}>
          <FontIcon className='material-icons' color={colors.darkGrey}>delete</FontIcon>
        </IconButton>,
      ]
    }

    return (
      <Paper className={s.viewReplyPane}>
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
            floatingLabelFixed={true}
            floatingLabelText={t('Title')}
            fullWidth={true}
            hintText={t('Add a title')}
            multiLine={true}
            name='reply.title'
            onFocus={this.handleFocus}
            ref='title'
            withRef={true}
          />
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelText={t('Reply')}
            floatingLabelFixed={true}
            fullWidth={true}
            hintText={t('Add a reply')}
            multiLine={true}
            name='reply.body'
            onFocus={this.handleFocus}
            rows={2}
          />
          <DeleteDialog
            onCancel={this.hideDeleteDialog}
            onConfirm={this.handleDeleteReply}
            open={this.state.showDeleteDialog}
          />
        </section>
      </Paper>
    )
  }

}

ViewEditReply.propTypes = {
  reply: PropTypes.object,
}

ViewEditReply.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default withStyles(s)(reduxForm({
  form: FORM_NAME,
  validate,
})(ViewEditReply))
