import React, { PropTypes } from 'react'

import t from 'u/gettext'

import FormDialog from 'c/FormDialog'

import EditForm, { FORM_NAME } from './EditForm'

const EditDialog = ({ user, ...other }) => (
  <FormDialog
    form={{
      node: <EditForm user={user} />,
      name: FORM_NAME,
    }}
    dialogProps={{
      title: t(`Edit Permissions for @${user.username}`),
      modal: false,
    }}
    primaryActionLabel={t('Update')}
    {...other}
  />
)

EditDialog.propTypes = {
  user: PropTypes.object.isRequired,
}

export default EditDialog
