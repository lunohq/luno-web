import mixpanel from 'mixpanel-browser'
import Raven from 'raven-js'

class Tracker {

  constructor(token) {
    mixpanel.init(token)
    this.initialized = false
  }

  /**
   * Initialize a tracking session.
   *
   * @param {Object} viewer the active user
   */
  init(viewer) {
    if (this.initialized || viewer.anonymous) return

    // Convert relay ids so we can identify the user across platforms
    let userId, teamId
    try {
      userId = atob(viewer.id).split(':')[1]
      teamId = atob(viewer.team.id).split(':')[1]
    } catch (err) {
      Raven.captureException(err, { extra: { viewer } })
      return
    }

    const distinctId = `${teamId}:${userId}`
    Raven.setUserContext({
      id: distinctId,
      'User ID': userId,
      'Team ID': teamId,
    })
    mixpanel.identify(distinctId)
    mixpanel.register({
      client: 'web',
      'User ID': userId,
      'Team ID': teamId,
    })
    mixpanel.people.set({
      'User ID': userId,
      'Team ID': teamId,
    })
    mixpanel.people.set_once({
      'First Seen': new Date(),
    })
    this.initialized = true
  }

  track(event, data) {
    return new Promise((resolve, reject) => {
      mixpanel.track(event, data, (err) => {
        if (err) {
          Raven.captureException(err, { extra: { event, data } })
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  clear() {
    mixpanel.cookie.clear()
    mixpanel.init(token)
    Raven.setUserContext()
  }

}

export default new Tracker(__MIXPANEL_TOKEN__)
