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

  track(event, data) {
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

  trackWithCtx(event, payload) {
    const data = {
      client: 'server',
      ...payload,
    }
    this.track(event, data)
  }

  trackCreateUser(user) {
    const distinctId = `${user.teamId}:${user.id}`
    const data = {
      distinct_id: distinctId,
      type: 'create_user',
      user: user.user,
    }
    debug('Tracking create user', data)
    this.trackWithCtx('create_user', data)
    this.mixpanel.people.set(distinctId, {
      $created: (new Date()).toISOString(),
    })
  }

}
/*eslint-enable camelcase*/

export default new Tracker(config.mixpanel.token)
