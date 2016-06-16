import React, { Component, PropTypes } from 'react'
import { reduxForm, Field, initialize } from 'redux-form'

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

export const FORM_NAME = 'form/answer'

const validate = values => {
  const errors = {}
  const requiredFields = ['title', 'body']
  requiredFields.forEach(field => {
    if (values.answer && !values.answer[field]) {
      errors[field] = 'Required'
      errors._error = true
    }
  })
  return errors
}

class Answer extends Component {

  state = {
    editing: false,
  }

  componentWillMount() {
    const { answer } = this.props
    if (answer) {
      this.initialize(answer)
    }
  }

  componentWillReceiveProps({ answer: nextAnswer }) {
    const { answer } = this.props
    const newAnswer = (answer && nextAnswer && answer.id !== nextAnswer.id) || (!answer && nextAnswer)
    if (newAnswer) {
      this.initialize(nextAnswer)
    }
  }

  componentDidMount() {
    if (!this.props.answer.id) {
      this.refs.title.getRenderedComponent().focus()
    }
  }

  initialize(answer) {
    const initialValues = { answer }
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

  handleDelete = () => this.props.onDelete(this.props.answer)
  handleSave = () => this.setState({ editing: false })
  handleFocus = () => this.setState({ editing: true })

  render() {
    const { pristine, valid, answer } = this.props
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
          disabled={(!answer && pristine) || !valid}
          key='create'
          label={answer ? t('Update') : t('Create')}
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

    let changed
    if (answer.changed) {
      changed = moment(answer.changed).format('MMM Do, YYYY')
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
        <section className={s.form}>
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelFixed
            floatingLabelText={t('Title')}
            fullWidth
            hintText={t('Add a title')}
            multiLine
            name='answer.title'
            onFocus={this.handleFocus}
            ref='title'
            withRef
          />
          <Field
            autoComplete='off'
            component={TextField}
            floatingLabelText={t('Answer')}
            floatingLabelFixed
            fullWidth
            hintText={t('Add a answer')}
            multiLine
            name='answer.body'
            onFocus={this.handleFocus}
            rows={2}
          />
        </section>
      </Paper>
    )
  }

}

Answer.propTypes = {
  onDelete: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  answer: PropTypes.object,
  reset: PropTypes.func.isRequired,
  valid: PropTypes.bool,
}

Answer.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default withStyles(s)(reduxForm({
  form: FORM_NAME,
  validate,
})(Answer))
