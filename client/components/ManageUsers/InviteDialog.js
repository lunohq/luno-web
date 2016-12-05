import React, { PropTypes } from 'react'

import t from 'u/gettext'

import FormDialog from 'c/FormDialog'

import InviteForm, { FORM_NAME } from './InviteForm'

const InviteDialog = ({ members, ...other }) => (
  <FormDialog
    form={{
      node: <InviteForm members={members} />,
      name: FORM_NAME,
    }}
    dialogProps={{
      title: t('Invite Users'),
      modal: false,
    }}
    primaryActionLabel={t('Invite User')}
    {...other}
  />
)

InviteDialog.propTypes = {
  members: PropTypes.array.isRequired,
}

export default InviteDialog
