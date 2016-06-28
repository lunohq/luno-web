import React, { PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import { ListItem } from 'material-ui/List'
import AvLibraryAdd from 'material-ui/svg-icons/av/library-add'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import { MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import SelectableList from 'c/SelectableList'

import s from './style.scss'

// load default topic id and then all other topics below
const Navigation = ({ defaultId, onNewTopic }) => (
  <Drawer
    containerClassName={s.navPaddingTop}
    containerStyle={{ left: NAV_WIDTH }}
    width={MENU_WIDTH}
  >
    <SelectableList defaultValue={defaultId}>
      <ListItem
        primaryText={t('Lunobot')}
        rightIcon={<AvLibraryAdd onTouchTap={onNewTopic} />}
        value={defaultId}
      />
    </SelectableList>
  </Drawer>
)

Navigation.propTypes = {
  defaultId: PropTypes.string.isRequired,
  onNewTopic: PropTypes.func.isRequired,
}

export default withStyles(s)(Navigation)
