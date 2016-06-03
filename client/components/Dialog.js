import React from 'react'
import MaterialDialog from 'material-ui/Dialog'

const dialogHeightFix = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0
  },
  dialogContent: {
    position: 'relative',
    width: '75vw',
    maxWidth: 768,
    transform: 'none'
  },
  dialogBody: {
    paddingBottom: 0
  }
}

const Dialog = (props) => <MaterialDialog
  { ...props }
  contentStyle={ dialogHeightFix.dialogContent }
  bodyStyle={ dialogHeightFix.dialogBody }
  style={ dialogHeightFix.dialogRoot }
  repositionOnUpdate={ false }
/>

export default Dialog
