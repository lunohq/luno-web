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

/*eslint-disable camelcase */
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

  track(TEAM_EVENT, { root, ...other }) {
    const data = {
      client: 'server',
      ...other,
    }
    if (root) {
      // don't track assumed actions
      if (root.a) {
        return
      }

      data.distinct_id = `${root.tid}:${root.uid}`
      data['User ID'] = root.uid
      data['Team ID'] = root.tid
    }

    this._track(TEAM_EVENT, data)
  }

  trackCreateUser(user) {
    debug('Tracking create user', user)
    const distinctId = `${user.teamId}:${user.id}`
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
    })
    debug('Tracked create user')
  }

  trackCreateAnswer({ root, id }) {
    const data = {
      root,
      Type: 'Create Answer',
      'Answer ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateAnswer({ root, id }) {
    const data = {
      root,
      Type: 'Update Answer',
      'Answer ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackDeleteAnswer({ root, id }) {
    const data = {
      root,
      Type: 'Delete Answer',
      'Answer ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateBotPurpose({ root, id }) {
    const data = {
      root,
      Type: 'Update Bot Purpose',
      'Bot ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

  trackUpdateBotPointsOfContact({ root, id }) {
    const data = {
      root,
      Type: 'Update Bot Points of Contact',
      'Bot ID': id,
    }
    this.track(ADMIN_ACTION, data)
  }

}
/*eslint-enable camelcase*/

export default new Tracker(config.mixpanel.token)
