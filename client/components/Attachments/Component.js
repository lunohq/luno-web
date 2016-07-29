import React, { Component, PropTypes } from 'react'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import AddIcon from 'material-ui/svg-icons/content/add'

import t from 'u/gettext'
import colors from 's/colors'

class Attachments extends Component {

  handleOpenFilePicker = () => {
    this.refs.input.click()
  }

  handlePickedFile = (event) => {
    const file = event.target.files[0]
  }

  render() {
    const { className } = this.props

    return (
      <div className={className}>
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
}

export default Attachments
