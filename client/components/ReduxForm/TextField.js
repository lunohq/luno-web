import React, { Component, PropTypes } from 'react'
import MaterialTextField from 'material-ui/TextField'

class TextField extends Component {

  focus = () => {
    this.refs.field.focus()
  }

  render() {
    const { dirty, touched, error, hideError, ...other } = this.props
    return (
      <MaterialTextField
        ref='field'
        errorText={!hideError && (dirty || touched) && error}
        {...other}
      />
    )
  }

}

TextField.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool,
}

export default TextField
