import React, { Component, PropTypes } from 'react'
import keycode from 'keycode'

import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'

import t from 'u/gettext'
import withStyles from 'u/withStyles'

import s from './style.scss'

class SearchBar extends Component {

  handleKeyDown = (event) => {
    if (keycode(event) === 'enter') {
      this.props.onChange(event.target.value)
    }
  }

  render() {
    const title = (
      <TextField
        className={s.input}
        hintText={t('Search')}
        fullWidth
        onKeyDown={this.handleKeyDown}
        underlineShow={false}
        ref={c => c ? c.focus() : null}
      />
    )
    return (
      <AppBar
        className={s.bar}
        iconElementLeft={
          <div className={s.iconContainer}>
            <SearchIcon style={{ opacity: 0.5 }} />
          </div>
        }
        iconStyleLeft={{ marginTop: 0, marginRight: 16 }}
        style={{ backgroundColor: 'white', paddingLeft: 50 }}
        title={title}
      />
    )
  }

}

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default withStyles(s)(SearchBar)
