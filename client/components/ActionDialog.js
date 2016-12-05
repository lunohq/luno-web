import React, { PropTypes } from 'react'

import Dialog from 'c/Dialog'
import FlatButton from 'material-ui/FlatButton'

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
  children: PropTypes.node.isRequired,
  onPrimaryAction: PropTypes.func.isRequired,
  onSecondaryAction: PropTypes.func.isRequired,
  primaryActionLabel: PropTypes.string.isRequired,
  secondaryActionLabel: PropTypes.string.isRequired,
}

export default ActionDialog
