import React, { PropTypes } from 'react'

import t from 'u/gettext'

import FormDialog from 'c/FormDialog'
import Topic, { FORM_NAME } from 'c/Topic/Component'

const TopicDialog = ({ topic, ...other }) => (
  <FormDialog
    form={{
      node: <Topic topic={topic} />,
      name: FORM_NAME,
    }}
    dialogProps={{
      title: topic ? t('Edit Topic') : t('New Topic'),
      modal: true,
    }}
    primaryActionLabel={topic ? t('Update') : t('Create')}
    {...other}
  />
)

TopicDialog.propTypes = {
  topic: PropTypes.object,
}

export default TopicDialog
