import React from 'react'

import AutoComplete from 'material-ui/AutoComplete'

import t from 'u/gettext'

function filter(searchText, key) {
  return searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
}

export function createDataSource(members) {
  const dataSource = []
  for (const member of members) {
    let text = `@${member.node.name}`
    if (member.node.profile.realName) {
      text = `${text} (${member.node.profile.realName})`
    }
    dataSource.push(text)
  }
  return dataSource
}

const AutoCompleteMembers = (props) => (
  <AutoComplete
    hintText={t('@username')}
    filter={filter}
    floatingLabelText={t('Slack Username')}
    {...props}
  />
)

export default AutoCompleteMembers
