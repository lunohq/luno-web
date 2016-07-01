import React, { PropTypes } from 'react'

import t from 'u/gettext'

import CommonDeleteDialog from 'c/DeleteDialog'

const DeleteDialog = ({ reply, ...other }) => {
  const replyTitle = reply ? reply.title : t('this reply')
  return (
    <CommonDeleteDialog
      title={t('Confirm delete reply?')}
      modal={false}
      {...other}
    >
      <div>
        {t(`Are you sure you want to delete "${replyTitle}"? This action cannot be undone.`)}
      </div>
    </CommonDeleteDialog>
  )
}

DeleteDialog.propTypes = {
  reply: PropTypes.object.isRequired,
}

export default DeleteDialog
