import React, { PropTypes } from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'

const DeleteDialog = ({ answer, open, onClose, onSubmit }) => {
  const actions = [
    <FlatButton
      label={t('Cancel')}
      secondary
      onClick={onClose}
    />,
    <FlatButton
      label={t('Yes')}
      primary
      onClick={onSubmit}
    />,
  ]

  const answerTitle = answer ? answer.title : t('answer')
  return (
    <Dialog
      title={t('Confirm delete answer?')}
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={onClose}
    >
      <div style={{ fontSize: '1.4rem' }}>
        {t(`Are you sure you want to delete "${answerTitle}"? This action cannot be undone.`)}
      </div>
    </Dialog>
  )
}

DeleteDialog.propTypes = {
  answer: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default DeleteDialog
