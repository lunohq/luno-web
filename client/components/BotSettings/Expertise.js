import React, { PropTypes } from 'react'
import { TextField } from 'material-ui'

import Divider from '../Divider'

const Expertise = ({ bot, onSave }) => {
  return (
    <div className='bot-settings-section'>
      <div className='section-title'>
        <div className='row between-xs middle-xs no-margin'>
          <h1>Expertise</h1>
        </div>
        <Divider />
        <p>
            What types of questions can your Luno Bot answer? Configure your Luno Bot to tell others what it’s an expert in by completing the sentence below.
        </p>
      </div>
      <div className='section-body'>&ldquoI can answer basic questions related to
        <TextField
          className='expertise-text'
          hintText='E.g., travel or HR and benefits'
          defaultValue={bot.purpose}
          multiLine={false}
          onBlur={onSave}
        />&rdquo
      </div>
    </div>
  )
}

Expertise.propTypes = {
  bot: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default Expertise
