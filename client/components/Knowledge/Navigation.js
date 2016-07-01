import React, { PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import { ListItem } from 'material-ui/List'
import AvLibraryAdd from 'material-ui/svg-icons/av/library-add'
import AvLibraryBooks from 'material-ui/svg-icons/av/library-books'
import IconButton from 'material-ui/IconButton'

import t from 'u/gettext'
import withStyles from 'u/withStyles'
import colors from 's/colors'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import { MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import SelectableList from 'c/SelectableList'

import s from './style.scss'

// load default topic id and then all other topics below
const Navigation = ({ defaultId, onNewTopic, topics, topicId, onSelect }) => {
  const items = [
    <ListItem
      key={'default'}
      onTouchTap={() => onSelect(defaultId)}
      primaryText={t('Lunobot')}
      rightIconButton={
        <IconButton onTouchTap={onNewTopic} tooltip='New Topic'>
          <AvLibraryAdd color={colors.darkGrey} />
        </IconButton>}
      value={defaultId}
    />
  ]
  topics.forEach(topic => {
    items.push(
      <ListItem
        key={topic.id}
        leftIcon={<AvLibraryBooks />}
        onTouchTap={() => onSelect(topic.id)}
        primaryText={
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {topic.name}
          </div>
        }
        innerDivStyle={{ paddingLeft: '52px' }}
        value={topic.id}
      />
    )
  })
  return (
    <Drawer
      containerClassName={s.navPaddingTop}
      containerStyle={{ left: NAV_WIDTH }}
      width={MENU_WIDTH}
    >
      <SelectableList defaultValue={topicId || defaultId}>
        {items}
      </SelectableList>
    </Drawer>
  )
}

Navigation.propTypes = {
  defaultId: PropTypes.string.isRequired,
  onNewTopic: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  topicId: PropTypes.string,
  topics: PropTypes.array,
}

export default withStyles(s)(Navigation)
