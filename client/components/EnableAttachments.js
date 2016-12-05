import React from 'react'

import t from 'u/gettext'

import ConfirmDialog from 'c/ConfirmDialog'

const EnableAttachments = (props) => {
  return (
    <ConfirmDialog
      title={t('Enable Attachments')}
      modal={false}
      {...props}
    >
      <div>
        {t('In order for Luno to share attachments with your Slack team, we need to create a public channel named #luno-file-uploads.')}
        <br /><br />
         {t('Do you want to grant this permission and enable attachments now? This will redirect to the Slack authorization flow.')}
      </div>
    </ConfirmDialog>
  )
}

export default EnableAttachments
