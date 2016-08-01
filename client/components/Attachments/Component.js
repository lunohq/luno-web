import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import Relay from 'react-relay'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import AddIcon from 'material-ui/svg-icons/content/add'

import t from 'u/gettext'
import colors from 's/colors'

import UploadFile from 'm/UploadFile'
import DeleteFile from 'm/DeleteFile'
import { startUpload, cancelUpload } from 'd/files'

import Attachment from 'c/Attachment/Component'

class Attachments extends Component {

  state = {
    uploads: {},
  }

  componentWillUnmount() {
    Object.values(this.state.uploads).forEach(upload => clearInterval(upload.interval))
  }

  handleOpenFilePicker = () => {
    if (!this.props.disabled) {
      this.refs.input.click()
    }
  }

  handlePickedFile = (event) => {
    if (event.target.value) {
      const { fields } = this.props
      const file = event.target.files[0]
      fields.push(this.uploadFile(file))
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
      file.transaction = Relay.Store.commitUpdate(new UploadFile({ file }), { onSuccess, onFailure })
      this.context.store.dispatch(startUpload({ file, transaction: file.transaction }))
      this.progress(file.transaction)
    })
    return { file }
  }

  progress = (transaction, complete = 0) => {
    const { uploads } = this.state
    const upload = uploads[transaction.getID()] || {}
    if (!upload.interval) {
      upload.interval = setInterval(() => this.progress(transaction, 5), 1000)
    }
    if (!upload.complete) {
      upload.complete = 0
    }
    upload.complete += complete
    if (upload.complete > 80) {
      clearInterval(upload.interval)
    }
    uploads[transaction.getID()] = upload
    this.setState({ uploads })
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
          uploads={this.state.uploads}
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
      </div>
    )
  }

}

Attachments.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  fields: PropTypes.array.isRequired,
}

Attachments.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default Attachments
