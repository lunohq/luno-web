import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import TextField from 'c/ReduxForm/TextField'

import s from './style.scss'

export const FORM_NAME = 'form/topic'

class Topic extends Component {

  componentDidMount() {
    this.focus()
  }

  focus() {
    this.refs.name.getRenderedComponent().focus()
  }

  render() {
    return (
      <section className={s.root}>
        <Field
          autoComplete='off'
          className={s.field}
          component={TextField}
          floatingLabelFixed
          floatingLabelText={t('Topic Name')}
          fullWidth
          hintText={t('Add name')}
          name='topic.name'
          ref='name'
          withRef
        />
      </section>
    )
  }

}

Topic.propTypes = {
  topic: PropTypes.object,
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(Topic))
