import React from 'react'
import MaterialDialog from 'material-ui/Dialog'

const dialogHeightFix = {
  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  contentStyle: {
    position: 'relative',
    width: '75vw',
    maxWidth: 768,
    transform: 'none',
  },
  bodyStyle: {
    lineHeight: '24px',
    paddingBottom: 0,
  },
  repositionOnUpdate: false,
}

const Dialog = (props) => (
  <MaterialDialog
    {...props}
    {...dialogHeightFix}
  />
)

export default Dialog
