import React, { PropTypes } from 'react'

import Dialog from 'c/Dialog'
import FlatButton from 'material-ui/FlatButton'

import t from 'u/gettext'

const ActionDialog = ({ secondaryActionLabel, primaryActionLabel, onSecondaryAction, onPrimaryAction, children, ...other }) => {
  const actions = [
    <FlatButton
      label={secondaryActionLabel}
      secondary
      onClick={onSecondaryAction}
    />,
    <FlatButton
      label={primaryActionLabel}
      primary
      onClick={onPrimaryAction}
    />,
  ]

  return (
    <Dialog actions={actions} {...other}>
      {children}
    </Dialog>
  )
}

ActionDialog.propTypes = {
  secondaryActionLabel: PropTypes.string.isRequired,
  primaryActionLabel: PropTypes.string.isRequired,
  onSecondaryAction: PropTypes.func.isRequired,
  onPrimaryAction: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default ActionDialog
