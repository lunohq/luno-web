import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'

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

export const FORM_NAME = 'form/answer'

const validate = values => {
  const errors = {}
  const requiredFields = ['title', 'body']
  requiredFields.forEach(field => {
    if (!values.answer[field]) {
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

class Answer extends Component {

  state = {
    editing: false,
    showDeleteDialog: false,
  }

  handleEdit = () => {
    this.refs.title.getRenderedComponent().focus()
    this.setState({editing: true})
  }

  handleCancel = () => {
    this.setState({editing: false})
    this.props.reset()
  }

  handleCreate = () => {}
  handleFocus = () => this.setState({editing: true})

  showDeleteDialog = () => this.setState({ showDeleteDialog: true })
  hideDeleteDialog = () => this.setState({ showDeleteDialog: false })
  handleDeleteAnswer = () => {
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
          onTouchTap={this.handleCreate}
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
      <Paper className={s.detailPane}>
        <Subheader className={s.header}>
          Last edited by
          <div>
            {actionButtons}
          </div>
        </Subheader>

        <section className={s.form}>
          <Field
            autoComplete='off'
            className={s.field}
            component={TextField}
            floatingLabelText={t('Title')}
            name='answer.title'
            onFocus={this.handleFocus}
            ref='title'
            withRef={true}
          />
          <Field
            autoComplete='off'
            className={s.field}
            component={TextField}
            floatingLabelText={t('Reply')}
            multiLine={true}
            name='answer.body'
            onFocus={this.handleFocus}
            rows={2}
          />
          <DeleteDialog
            onCancel={this.hideDeleteDialog}
            onConfirm={this.handleDeleteAnswer}
            open={this.state.showDeleteDialog}
          />
        </section>
      </Paper>
    )
  }

}

export default withStyles(s)(reduxForm({
  form: FORM_NAME,
  initialValues: {
    answer: {
      title: 'Some Title',
      body: 'Reply',
    },
  },
  validate,
})(Answer))
