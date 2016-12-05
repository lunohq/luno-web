import React, { PropTypes } from 'react'

import t from 'u/gettext'

import Dialog from 'c/Dialog'
import FlatButton from 'material-ui/FlatButton'

const FileSizeExceeded = ({ onClose, ...other }) => {
  const actions = [
    <FlatButton
      label={t('Close')}
      primary
      onClick={onClose}
    />,
  ]

  const message = `The attachment file size limit is 500 MB. For larger files,
    use a cloud storage provider (like Google Drive, Dropbox, or Box) and share
  the download link in the Reply body.`

  return (
    <Dialog
      actions={actions}
      modal={false}
      title={t('Error uploading file')}
      {...other}
    >
      <div>
        {message}
      </div>
    </Dialog>
  )
}

FileSizeExceeded.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default FileSizeExceeded
