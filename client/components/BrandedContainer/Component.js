import React, { PropTypes } from 'react'

import withStyles from 'u/withStyles'
import t from 'u/gettext'
import DocumentTitle from 'c/DocumentTitle'

import s from './style.scss'

const BrandedContainer = ({ children, title = 'Luno' }) => (
  <DocumentTitle title={title}>
    <div className={s.root}>
      <div className={s.container}>
        <div>
          <div className={s.header}>
            <div className={s.brandContainer}>
              <a className={s.brand} href='https://www.lunohq.com'>luno</a>
            </div>
          </div>
        </div>
        <div className={s.content}>
          {children}
        </div>
      </div>
    </div>
  </DocumentTitle>
)

BrandedContainer.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
}

export default withStyles(s)(BrandedContainer)
