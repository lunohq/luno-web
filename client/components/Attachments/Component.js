import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import AddIcon from 'material-ui/svg-icons/content/add'

import t from 'u/gettext'
import colors from 's/colors'

import Attachment from 'c/Attachment/Component'

class Attachments extends Component {

  handleOpenFilePicker = () => {
    this.refs.input.click()
  }

  handlePickedFile = (event) => {
    if (event.target.value) {
      const { fields } = this.props
      const file = event.target.files[0]
      fields.push({ file })
      event.target.value = ''
    }
  }

  render() {
    const { className, fields } = this.props
    const attachments = fields.map((attachment, index) => (
      <Field
        component={Attachment}
        key={index}
        name={`${attachment}.file`}
      />
    ))
    return (
      <div className={className}>
        {attachments}
        <Chip
          backgroundColor='none'
          labelStyle={{ color: colors.muiHintTextColor, paddingLeft: 0 }}
          onTouchTap={this.handleOpenFilePicker}
          style={{ boxShadow: 'none', margin: '4px 8px 4px -8px' }}
        >
          <Avatar color={colors.muiHintTextColor} backgroundColor='none' icon={<AddIcon />} />
          {t('Attachment')}
        </Chip>
        <input
          onChange={this.handlePickedFile}
          ref='input'
          style={{ display: 'none' }}
          type='file'
        />
      </div>
    )
  }

}

Attachments.propTypes = {
  className: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
}

export default Attachments
