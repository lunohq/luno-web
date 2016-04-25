import React, { PropTypes } from 'react'
import { TextField } from 'material-ui'

import t from '../../utils/gettext'

import Divider from '../Divider'

const Expertise = ({ bot, onSave }) => {
  return (
    <div className='bot-settings-section'>
      <div className='section-title'>
        <div className='row between-xs middle-xs no-margin'>
          <h1>{t('Domain Expertise')}</h1>
        </div>
        <Divider />
        <p>
            {t('What kinds of questions can your Lunobot answer (e.g. HR)? This information will be used in introduction and help messages to set expectations on what your Lunobot can and cannot answer.')}
        </p>
      </div>
      <div className='section-body'>&ldquo;{t('I can answer basic questions related to')}
        <TextField
          className='expertise-text'
          hintText={t('E.g., travel or HR and benefits')}
          defaultValue={bot.purpose}
          multiLine={false}
          onBlur={onSave}
        />&rdquo;
      </div>
    </div>
  )
}

Expertise.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default Expertise
