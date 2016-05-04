import React, { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AnonymousLanding from '../AnonymousLanding/Component'
import AuthenticatedLanding from '../AuthenticatedLanding/Component'
import LogoutMutation from '../../mutations/LogoutMutation'

import s from './style.scss'

class App extends Component {

  handleLogout = () => {
    Relay.Store.commitUpdate(
      new LogoutMutation({ viewer })
    )
  }

  getChildContext() {
    return {
      insertCss: styles => styles._insertCss(),
    }
  }

  componentWillMount() {
    // _insertCss comes from https://github.com/kriasoft/isomorphic-style-loader
    this.removeCss = s._insertCss()
  }

  componentWillUnmount() {
    this.removeCss()
  }

  render() {
    const { children, viewer } = this.props

    let main
    if (viewer.anonymous) {
      main = <AnonymousLanding />
    } else {
      main = (
        <AuthenticatedLanding
          children={children}
          onLogout={this.handleLogout}
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
}

App.propTypes = {
  children: PropTypes.object,
  viewer: PropTypes.object.isRequired,
}

export default App
