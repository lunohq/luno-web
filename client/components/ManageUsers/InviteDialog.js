import React, { PropTypes } from 'react'

import FormDialog from 'c/FormDialog'

import InviteForm, { FORM_NAME as InviteFormName } from './InviteForm'

const InviteDialog = ({ members, ...other }) => (
  <FormDialog
    form={{
      node: <InviteForm members={members} />,
      name: InviteFormName,
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
