import React from 'react'
import Drawer from 'material-ui/Drawer'
import { ListItem } from 'material-ui/List'

import t from 'u/gettext'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import SelectableList from 'c/SelectableList'

const Navigation = () => (
  <Drawer containerStyle={{ left: NAV_WIDTH }}>
    <SelectableList defaultValue={'0'}>
      <ListItem primaryText={t('Lunobot')} value={'0'} />
    </SelectableList>
  </Drawer>
)

export default Navigation
