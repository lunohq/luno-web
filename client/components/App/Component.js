import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import tracker from 'r/tracker'
import AnonymousLanding from 'c/AnonymousLanding/Component'
import AuthenticatedLanding from 'c/AuthenticatedLanding/Component'
import ConsumerLanding from 'c/ConsumerLanding/Component'
import LogoutMutation from 'm/LogoutMutation'

import s from './style.scss'

class App extends Component {

  handleLogout = () => {
    const { viewer } = this.props;
    Relay.Store.commitUpdate(
      new LogoutMutation({ viewer }),
      { onSuccess: () => this.context.router.push('/') },
    )
    tracker.clear()
  }

  getChildContext() {
    return {
      insertCss: (...styles) => {
        for (const style of styles) {
          style._insertCss()
        }
      },
      viewer: this.props.viewer,
    }
  }

  componentWillReceiveProps(nextProps) {
    tracker.init(nextProps.viewer)
    if (this.props.location.pathname !== nextProps.location.pathname && !this.props.viewer.assumed) {
      tracker.trackPageView(this.props.location)
    }
  }

  componentWillMount() {
    // _insertCss comes from https://github.com/kriasoft/isomorphic-style-loader
    this.removeCss = s._insertCss()
    tracker.init(this.props.viewer)
    if (!this.props.viewer.assumed) {
      tracker.trackPageView(this.props.location)
    }
  }

  componentWillUnmount() {
    this.removeCss()
  }

  render() {
    const { children, viewer } = this.props

    let main
    if (viewer.anonymous) {
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
  viewer: PropTypes.object.isRequired,
}

App.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default App
