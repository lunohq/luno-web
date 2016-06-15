import React, { Component, PropTypes } from 'react'
import { destroy } from 'redux-form'

import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'

import Dialog from 'c/Dialog'

class FormDialog extends Component {

  handleSubmit = (values) => {
    this.context.store.dispatch(destroy(this.props.form.name))
    this.props.onSubmit(values)
  }

  handleCancel = () => {
    this.props.onCancel()
    this.context.store.dispatch(destroy(this.props.form.name))
  }

  handlePrimaryAction = () => this.refs.form.submit()

  render() {
    const {
      dialogProps,
      secondaryActionLabel,
      primaryActionLabel,
      open,
      form,
    } = this.props

    const actions = [
      <FlatButton
        label={secondaryActionLabel}
        onTouchTap={this.handleCancel}
        secondary
      />,
      <FlatButton
        label={primaryActionLabel}
        onTouchTap={this.handlePrimaryAction}
        primary
      />,
    ]

    const formNode = React.cloneElement(form.node, { ref: 'form', onSubmit: this.handleSubmit })

    return (
      <Dialog
        actions={actions}
        open={open}
        onRequestClose={this.handleCancel}
        {...dialogProps}
      >
        {formNode}
      </Dialog>
    )
  }
}

FormDialog.defaultProps = {
  secondaryActionLabel: t('Cancel'),
  primaryActionLabel: t('Submit'),
  onCancel: () => {},
  onSubmit: () => {},
}

FormDialog.propTypes = {
  dialogProps: PropTypes.object,
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    node: PropTypes.node.isRequired,
  }),
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  primaryActionLabel: PropTypes.string,
  secondaryActionLabel: PropTypes.string,
}

FormDialog.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default FormDialog
