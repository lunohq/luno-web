import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import Relay from 'react-relay'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import AddIcon from 'material-ui/svg-icons/content/add'

import t from 'u/gettext'
import { saveState } from 'u/resumeReply'
import colors from 's/colors'

import UploadFile from 'm/UploadFile'
import DeleteFile from 'm/DeleteFile'
import { startUpload, cancelUpload } from 'd/files'

import FileSizeExceeded from 'c/FileSizeExceeded'
import EnableAttachments from 'c/EnableAttachments'
import Attachment from 'c/Attachment/Component'

const FILE_SIZE_LIMIT = 500 // file size limit in mb

class Attachments extends Component {

  state = {
    showEnableAttachments: false,
    showFileSizeExceeded: false,
  }

  handleCancelEnableAttachments = () => this.setState({ showEnableAttachments: false })
  handleCloseFileSizeExceeded = () => this.setState({ showFileSizeExceeded: false })

  handleConfirmEnableAttachments = () => {
    saveState(this.context.store.getState())
    window.location = '/install'
  }

  handleOpenFilePicker = () => {
    if (!this.props.enabled && !this.state.showEnableAttachments) {
      this.setState({ showEnableAttachments: true })
    } else if (this.props.enabled && !this.props.disabled) {
      this.refs.input.click()
    }
  }

  handlePickedFile = (event) => {
    if (event.target.value) {
      const { fields } = this.props
      const file = event.target.files[0]
      const mb = file.size / 1000000
      if (mb > FILE_SIZE_LIMIT) {
        this.setState({ showFileSizeExceeded: true })
      } else {
        fields.push(this.uploadFile(file))
      }
      event.target.value = ''
    }
  }

  uploadFile = (file) => {
    file.promise = new Promise((resolve, reject) => {
      const onSuccess = ({ uploadFile: { file: res } }) => {
        let payload
        if (res) {
          payload = { file: res }
        }
        file.payload = payload
        resolve(payload)
      }
      const onFailure = (transaction) => reject(transaction.getError())
      const transaction = Relay.Store.commitUpdate(new UploadFile({ file }), { onSuccess, onFailure })
      this.context.store.dispatch(startUpload({ file, transaction }))
    })
    return { file }
  }

  render() {
    const { className, disabled, fields } = this.props
    const attachments = fields.map((attachment, index) => {
      return (
        <Field
          component={Attachment}
          disabled={disabled}
          key={index}
          name={`${attachment}.file`}
          onRemove={(file) => {
            try {
              file.transaction.getStatus()
              this.context.store(cancelUpload(file.transaction))
            } catch (err) {
              if (file.payload) {
                Relay.Store.commitUpdate(new DeleteFile({ file: file.payload && file.payload.file }))
              }
            }
            fields.remove(index)
          }}
        />
      )
    })
    const style = { boxShadow: 'none', margin: '4px 8px 4px -8px' }
    if (disabled) {
      style.cursor = 'not-allowed'
    }
    return (
      <div className={className}>
        {attachments}
        <Chip
          backgroundColor='none'
          labelStyle={{ color: colors.muiHintTextColor, paddingLeft: 0 }}
          onTouchTap={this.handleOpenFilePicker}
          style={style}
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
        <EnableAttachments
          onCancel={this.handleCancelEnableAttachments}
          onConfirm={this.handleConfirmEnableAttachments}
          open={this.state.showEnableAttachments}
        />
        <FileSizeExceeded
          onClose={this.handleCloseFileSizeExceeded}
          open={this.state.showFileSizeExceeded}
        />
      </div>
    )
  }

}

Attachments.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  enabled: PropTypes.bool,
  fields: PropTypes.object.isRequired,
}

Attachments.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default Attachments
