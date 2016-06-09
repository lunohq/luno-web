import React, { PropTypes } from 'react'

import t from 'u/gettext'

import ActionDialog from 'c/ActionDialog'

const DeleteDialog = ({ cancelLabel, confirmLabel, onCancel, onConfirm, ...other }) => (
  <ActionDialog
    secondaryActionLabel={cancelLabel}
    primaryActionLabel={confirmLabel}
    onPrimaryAction={onConfirm}
    onSecondaryAction={onCancel}
    {...other}
  />
)

DeleteDialog.propTypes = {
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

DeleteDialog.defaultProps = {
  cancelLabel: t('Cancel'),
  confirmLabel: t('Yes'),
}

export default DeleteDialog
