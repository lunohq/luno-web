import React, { Component, PropTypes } from 'react'

import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import Divider from '../Divider/Component'
import SectionTitle from '../SectionTitle/Component'

import PointsOfContactForm from './PointsOfContactForm'

import s from './points-of-contact-style.scss'

const PointsOfContact = ({ bot, members, onSave }) => (
  <div>
    <div>
      <div className={s.titleContainer}>
        <SectionTitle title={t('Points of contact')} />
      </div>
      <Divider />
      <p className={s.text}>
          {t('To avoid a frustrating phone tree OPERATOR!!! experience, whenever your Lunobot can’t provide a great answer, it will immediately escalate the question to real people.')}
      </p>
    </div>
    <div className={s.body}>
      <PointsOfContactForm existing={bot.pointsOfContact || undefined} members={members} onSubmit={onSave} />
      <div className={s.hintText}>{t('Add Slack usernames of people who should be mentioned when escalating.')}</div>
    </div>
  </div>
)

PointsOfContact.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
}

export default withStyles(s)(PointsOfContact)
