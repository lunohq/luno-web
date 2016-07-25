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
  handleAnalyzeTouchTap = () => this.context.router.push('/search/analyze')
  handleValidateTouchTap = () => this.context.router.push('/search/validate')
  handleExplainTouchTap = () => this.context.router.push('/search/explain')

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
            onTouchTap={this.handleAnalyzeTouchTap}
            primaryText={t('Analyze')}
            value='/search/analyze'
          />
          <ListItem
            onTouchTap={this.handleValidateTouchTap}
            primaryText={t('Validate')}
            value='/search/validate'
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
