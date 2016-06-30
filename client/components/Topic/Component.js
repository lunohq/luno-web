import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, initialize } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './style.scss'

export const FORM_NAME = 'form/topic'

class Topic extends Component {

  componentWillMount() {
    this.initialize(this.props)
  }

  componentDidMount() {
    this.focus()
  }

  componentWillReceiveProps(nextProps) {
    const { topic } = this.props
    const { topic: nextTopic } = nextProps
    const newTopic = (
      topic && nextTopic && topic !== nextTopic ||
      (!topic && nextTopic)
    )
    if (newTopic) {
      this.initialize(nextProps)
    }
  }

  initialize({ topic }) {
    if (topic) {
      const initialValues = { topic }
      this.context.store.dispatch(initialize(FORM_NAME, initialValues))
    }
  }

  focus() {
    this.refs.name
      .getRenderedComponent()
      .getRenderedComponent()
      .focus()
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

Topic.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default reduxForm({
  form: FORM_NAME,
})(withStyles(s)(Topic))
