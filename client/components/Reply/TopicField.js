import React, { Component, PropTypes } from 'react'
import { SelectField } from 'redux-form-material-ui'

class TopicField extends Component {
  handleChange = (value) => {
    if (value !== 'create') {
      this.props.onChange(value)
    }
  }

  render() {
    const props = Object.assign({}, this.props)
    delete props.onChange
    return <SelectField onChange={this.handleChange} {...props} />
  }
}

TopicField.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default TopicField
