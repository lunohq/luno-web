import Mixpanel from 'mixpanel'

import logger, { metadata } from './logger'
import config from './config/environment/index'

const debug = require('debug')('server:tracker')

const EVENT = 'event'

/*eslint-disable camelcase */
class Tracker {

  constructor(token) {
    this.mixpanel = Mixpanel.init(token)
  }

  _track(event, data) {
    return new Promise((resolve, reject) => {
      this.mixpanel.track(event, data, (err) => {
        if (err) {
          logger.error('Error tracking event', metadata({ err, event, data }))
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  track(event, payload) {
    const data = {
      client: 'server',
      ...payload,
    }
    this._track(event, data)
  }

  trackCreateUser(user) {
    const distinctId = `${user.teamId}:${user.id}`
    const data = {
      distinct_id: distinctId,
      Type: 'create_user',
      User: user.user,
      'User ID': user.id,
      'Team ID': user.teamId,
    }
    debug('Tracking create user', data)
    this.track('create_user', data)
    this.mixpanel.people.set(distinctId, {
      $created: (new Date()).toISOString(),
    })
  }

}
/*eslint-enable camelcase*/

export default new Tracker(config.mixpanel.token)
