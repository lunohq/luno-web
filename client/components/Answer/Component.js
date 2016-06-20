import React, { Component, PropTypes } from 'react'
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

export const FORM_NAME = 'form/answer'

const validate = values => {
  const errors = {}
  const requiredFields = ['title', 'body']
  requiredFields.forEach(field => {
    if (values.answer && !values.answer[field]) {
      if (!errors.answer) errors.answer = {}
      errors.answer[field] = t('Required')
      errors._error = true
    }
  })

  if (values.answer && values.answer.title && values.answer.title.split(' ').length > 15) {
    if (!errors.answer) errors.answer = {}
    errors.answer.title = t('Title must be less than 15 words')
  }

  return errors
}

class Answer extends Component {

  state = {
    editing: false,
    focused: false,
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
    const { answer } = this.props
    const { answer: nextAnswer } = nextProps
    const newAnswer = (
      (answer && nextAnswer && answer !== nextAnswer) ||
      (!answer && nextAnswer)
    )
    if (newAnswer) {
      this.initialize(nextProps)
    }
    if (!this.state.focused && this.props.focused) {
      this.setState({ focused: true })
    }
  }

  componentDidUpdate() {
    if (!this.state.focused && this.props.focused) {
      this.focus()
    }
  }

  initialize({ answer }) {
    if (answer) {
      const initialValues = { answer }
      this.context.store.dispatch(initialize(FORM_NAME, initialValues))
    }
    this.setState({ editing: false, focused: false })
  }

  focus() {
    this.refs.title.getRenderedComponent().focus()
  }

  handleEdit = () => {
    this.refs.title.getRenderedComponent().focus()
    this.setState({ editing: true })
  }

  handleCancel = () => {
    const { onCancel, reset } = this.props
    this.setState({ editing: false })
    reset()
    onCancel()
  }

  handleSave = (values) => {
    this.setState({ editing: false })
    this.props.onSubmit(values)
  }

  handleDelete = () => this.props.onDelete(this.props.answer)

  handleFocus = () => this.setState({ editing: true })

  handleIgnoreEnter = (event) => {
    if (keycode(event) === 'enter') {
      event.preventDefault()
    }
  }

  render() {
    const { handleSubmit, pristine, valid, answer } = this.props
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
          label={answer.id ? t('Update') : t('Create')}
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
    if (answer.changed && !editing) {
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
        <div className={s.content}>
          <section className={s.form}>
            <Field
              autoComplete='off'
              className={s.field}
              component={TextField}
              floatingLabelFixed
              floatingLabelText={t('Title')}
              fullWidth
              hintText={t('Add a title')}
              multiLine
              name='answer.title'
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
              hintText={t('Add a reply')}
              multiLine
              name='answer.body'
              onFocus={this.handleFocus}
              rows={2}
            />
          </section>
        </div>
      </Paper>
    )
  }

}

Answer.propTypes = {
  answer: PropTypes.object,
  focused: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
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
