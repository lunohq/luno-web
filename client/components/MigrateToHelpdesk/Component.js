import React from 'react'

import withStyles from 'u/withStyles'
import t from 'u/gettext'

import BrandedContainer from 'c/BrandedContainer/Component'

import s from './style.scss'

const MigrateToHelpdesk = () => (
  <BrandedContainer title={t('Login to your Luno')}>
    <div className={s.container}>
      <div className={s.headerContainer}>
        <h1 className={s.header}>{t('Luno is now a helpdesk bot for Slack teams.')}</h1>
      </div>
      <a className={s.learnMoreLink} href='https://www.lunohq.com'>{t('Learn more')}</a>
    </div>
    <div className={s.footer}>
      <div className={s.footerLinks}>
        <a href='mailto:hotline@lunohq.com' className={s.footerLink} target='_blank'>{t('Contact Us')}</a>
      </div>
    </div>
  </BrandedContainer>
)

export default withStyles(s)(MigrateToHelpdesk)
