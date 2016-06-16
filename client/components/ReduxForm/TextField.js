import React, { Component } from 'react'
import MaterialTextField from 'material-ui/TextField'

class TextField extends Component {

  focus = () => {
    this.refs.field.focus()
  }

  render() {
    return <MaterialTextField ref='field' {...this.props} />
  }

}

export default TextField
