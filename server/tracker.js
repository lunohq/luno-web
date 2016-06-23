/**
 * Serverside tracking of events within mixpanel.
 *
 * When adding, updating, or removing events, keep this doc in sync:
 * https://goo.gl/TPYJSy
 *
 */
import Mixpanel from 'mixpanel'

import logger, { metadata } from './logger'
import config from './config/environment/index'

const debug = require('debug')('server:tracker')

const TEAM_EVENT = 'Team Event'
const ADMIN_ACTION = 'Admin Action'

/* eslint-disable camelcase */
class Tracker {

  constructor(token) {
    this.mixpanel = Mixpanel.init(token)
  }

  _track(TEAM_EVENT, data) {
    return new Promise((resolve, reject) => {
      this.mixpanel.track(TEAM_EVENT, data, (err) => {
        if (err) {
          logger.error('Error tracking TEAM_EVENT', metadata({ err, event, data }))
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  getDistinctId(teamId, userId) {
    return `${teamId}:${userId}`
  }

  track(TEAM_EVENT, { auth, ...other }) {
    const data = {
      client: 'server',
      ...other,
    }
    if (auth) {
      // don't track assumed actions
      if (auth.a) {
        return
      }

      data.distinct_id = this.getDistinctId(auth.tid, auth.uid)
      data['User ID'] = auth.uid
      data['Team ID'] = auth.tid
    }

    this._track(TEAM_EVENT, data)
  }

  trackCreateUser(user) {
    debug('Tracking create user', user)
    const distinctId = this.getDistinctId(user.teamId, user.id)
    const data = {
      distinct_id: distinctId,
      Type: 'Create User',
      User: user.user,
      'User ID': user.id,
      'Team ID': user.teamId,
    }
    this.track(TEAM_EVENT, data)
    this.mixpanel.people.set(distinctId, {
      $created: (new Date()).toISOString(),
      $email: user.email,
    })
    debug('Tracked create user')
  }

  trackCreateAnswer({ auth, id }) {
    const data = {
      auth,
      Type: 'Create Answer',
      'Answer ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateUser({ auth, id }) {
    const data = {
      auth,
      Type: 'Update User',
      'Target User ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackInviteUser({ auth, teamId, userId, role }) {
    const data = {
      auth,
      Type: 'Invite User',
      'Target User ID': userId,
    }
    const distinctId = this.getDistinctId(teamId, userId)
    this.mixpanel.people.set(distinctId, {
      Role: role,
    })
    this.mixpanel.people.set_once(distinctId, {
      Invited: (new Date()).toISOString(),
    })
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateAnswer({ auth, id }) {
    const data = {
      auth,
      Type: 'Update Answer',
      'Answer ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackDeleteAnswer({ auth, id }) {
    const data = {
      auth,
      Type: 'Delete Answer',
      'Answer ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateBotPurpose({ auth, id }) {
    const data = {
      auth,
      Type: 'Update Bot Purpose',
      'Bot ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateBotPointsOfContact({ auth, id }) {
    const data = {
      auth,
      Type: 'Update Bot Points of Contact',
      'Bot ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

}
/* eslint-enable camelcase */

export default new Tracker(config.mixpanel.token)
