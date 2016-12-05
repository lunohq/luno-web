import React, { PropTypes } from 'react'

import t from 'u/gettext'

import ConfirmDialog from 'c/ConfirmDialog'

const DeleteDialog = ({ user, ...other }) => (
  <ConfirmDialog
    title={t('Confirm delete user?')}
    modal={false}
    {...other}
  >
    <div>
      {t(`Are you sure you want to delete @${user.username}? This action cannot be undone.`)}
    </div>
  </ConfirmDialog>
)

DeleteDialog.propTypes = {
  user: PropTypes.object.isRequired,
}

export default DeleteDialog
