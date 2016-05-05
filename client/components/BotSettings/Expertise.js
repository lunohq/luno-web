import React, { PropTypes } from 'react'
import { TextField } from 'material-ui'

import t from '../../utils/gettext'
import withStyles from '../../utils/withStyles'

import Divider from '../Divider/Component'
import SectionTitle from '../SectionTitle/Component'

import s from './expertise-style.scss'

const Expertise = ({ bot, onSave }) => (
  <div>
    <div>
      <div className={s.titleContainer}>
        <SectionTitle title={t('Domain Expertise')} />
      </div>
      <Divider />
      <p className={s.text}>
          {t('What kinds of questions can your Lunobot answer (e.g. HR)? This information will be used in introduction and help messages to set expectations on what your Lunobot can and cannot answer.')}
      </p>
    </div>
    <div className={s.body}>&ldquo;{t('I can answer basic questions related to')}
      <TextField
        className={s.expertise}
        hintText={t('E.g., travel or HR and benefits')}
        defaultValue={bot.purpose}
        multiLine={false}
        onBlur={onSave}
      />&rdquo;
    </div>
  </div>
)

Expertise.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default withStyles(s)(Expertise)
