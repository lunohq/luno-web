import React, { Component, PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import { ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import t from 'u/gettext'

import { NAV_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import { MENU_WIDTH } from 'c/AuthenticatedLanding/Navigation'
import SelectableList from 'c/SelectableList'

class Navigation extends Component {

  handleQueryTouchTap = () => this.context.router.push('/search/query')
  handleQueryV2TouchTap = () => this.context.router.push('/search/queryV2')
  handleAnalyzeTouchTap = () => this.context.router.push('/search/analyze')
  handleExplainTouchTap = () => this.context.router.push('/search/explain')
  handleZendeskSearchTouchTap = () => this.context.router.push('/search/zendesk')

  render() {
    const { location: { pathname } } = this.props
    return (
      <Drawer
        containerStyle={{ left: NAV_WIDTH }}
        width={MENU_WIDTH}
      >
        <SelectableList defaultValue={pathname}>
          <Subheader>{t('Search Dashboard')}</Subheader>
          <ListItem
            onTouchTap={this.handleQueryTouchTap}
            primaryText={t('Search')}
            value='/search/query'
          />
          <ListItem
            onTouchTap={this.handleQueryV2TouchTap}
            primaryText={t('Search V2')}
            value='/search/queryV2'
          />
          <ListItem
            onTouchTap={this.handleZendeskSearchTouchTap}
            primaryText={t('Zendesk Search')}
            value='/search/zendesk'
          />
          <ListItem
            onTouchTap={this.handleAnalyzeTouchTap}
            primaryText={t('Analyze')}
            value='/search/analyze'
          />
          <ListItem
            onTouchTap={this.handleExplainTouchTap}
            primaryText={t('Explain')}
            value='/search/explain'
          />
        </SelectableList>
      </Drawer>
    )
  }
}

Navigation.propTypes = {
  location: PropTypes.shape.isRequired,
}

Navigation.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default Navigation
