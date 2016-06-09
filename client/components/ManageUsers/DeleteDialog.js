import React, { PropTypes } from 'react'

import t from 'u/gettext'

import CommonDeleteDialog from 'c/DeleteDialog'

const DeleteDialog = ({ user, ...other }) => (
  <CommonDeleteDialog
    title={t('Confirm delete user?')}
    modal={false}
    {...other}
  >
    <div>
      {t(`Are you sure you want to delete @${user.username}? This action cannot be undone.`)}
    </div>
  </CommonDeleteDialog>
)

DeleteDialog.propTypes = {
  user: PropTypes.object.isRequired,
}

export default DeleteDialog
