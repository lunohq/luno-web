import React, { PropTypes } from 'react'

import t from 'u/gettext'

import CommonDeleteDialog from 'c/DeleteDialog'

const DeleteDialog = ({ answer, ...other }) => {
  const answerTitle = answer ? answer.title : t('this answer')
  return (
    <CommonDeleteDialog
      title={t('Confirm delete answer?')}
      modal={false}
      {...other}
    >
      <div>
        {t(`Are you sure you want to delete "${answerTitle}"? This action cannot be undone.`)}
      </div>
    </CommonDeleteDialog>
  )
}

DeleteDialog.propTypes = {
  answer: PropTypes.object.isRequired,
}

export default DeleteDialog
