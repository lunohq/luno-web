import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import tracker from 'r/tracker'
import AnonymousLanding from 'c/AnonymousLanding/Component'
import AuthenticatedLanding from 'c/AuthenticatedLanding/Component'
import ConsumerLanding from 'c/ConsumerLanding/Component'
import LogoutMutation from 'm/LogoutMutation'
import MigrateToHelpdesk from 'c/MigrateToHelpdesk/Component'

import { redirect } from 'u/resumeReply'

import s from './style.scss'

class App extends Component {

  getChildContext() {
    return {
      insertCss: (...styles) => {
        const removeCss = styles.map(style => style._insertCss())
        return () => removeCss.forEach(f => f())
      },
      viewer: this.props.viewer,
    }
  }

  componentWillMount() {
    // _insertCss comes from https://github.com/kriasoft/isomorphic-style-loader
    this.removeCss = s._insertCss()
    this.authRedirect(this.props)
    tracker.init(this.props.viewer)
    if (!this.props.viewer.assumed) {
      tracker.trackPageView(this.props.location)
    }
    redirect()
  }

  componentWillReceiveProps(nextProps) {
    this.authRedirect(nextProps)
    tracker.init(nextProps.viewer)
    if (this.props.location.pathname !== nextProps.location.pathname && !this.props.viewer.assumed) {
      tracker.trackPageView(this.props.location)
    }
  }

  componentWillUnmount() {
    this.removeCss()
  }

  authRedirect({ viewer: { anonymous, role }, location: { pathname } }) {
    if (anonymous && pathname !== '/signin' && !pathname.startsWith('/migrate-to-helpdesk')) {
      this.context.router.replace('/signin')
    } else if (role === 'CONSUMER' && pathname !== '/sadface') {
      this.context.router.replace('/sadface')
    } else if (!anonymous && pathname === '/') {
      this.context.router.replace('/knowledge')
    }
  }

  handleLogout = () => {
    const { viewer } = this.props;
    Relay.Store.commitUpdate(
      new LogoutMutation({ viewer }),
      { onSuccess: () => this.context.router.push('/') },
    )
    tracker.clear()
  }

  render() {
    const { children, viewer, location: { pathname } } = this.props

    let main
    if (pathname.startsWith('/migrate-to-helpdesk')) {
      main = <MigrateToHelpdesk />
    } else if (viewer.anonymous) {
      main = <AnonymousLanding />
    } else if (viewer.isStaff) {
      main = (
        <AuthenticatedLanding
          children={children}
          onLogout={this.handleLogout}
          viewer={viewer}
        />
      )
    } else {
      main = (
        <ConsumerLanding
          children={children}
          onLogout={this.handleLogout}
          viewer={viewer}
        />
      )
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        {main}
      </MuiThemeProvider>
    )
  }
}

App.childContextTypes = {
  insertCss: PropTypes.func.isRequired,
  viewer: PropTypes.object.isRequired,
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  viewer: PropTypes.object.isRequired,
}

App.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default App
