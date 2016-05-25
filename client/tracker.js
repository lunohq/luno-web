/**
 * Web tracking of events within mixpanel.
 *
 * When adding, updating, or removing events, keep this doc in sync:
 * https://goo.gl/G6GCmV
 *
 */
import mixpanel from 'mixpanel-browser'
import Raven from 'raven-js'

class Tracker {

  constructor(token) {
    mixpanel.init(token)
    this._token = token
    this.initialized = false
  }

  /**
   * Initialize a tracking session.
   *
   * @param {Object} viewer the active user
   */
  init(viewer) {
    if (this.initialized || viewer.anonymous || viewer.assumed) return

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
      $first_name: viewer.username,
      'User ID': userId,
      'Team ID': teamId,
      'Username': viewer.username,
      'Team Name': viewer.team ? viewer.team.name : null,
    })
    mixpanel.people.set_once({
      'First Seen': new Date(),
    })
    this.initialized = true
  }

  track(event, data) {
    try {
      mixpanel.track(event, data)
    } catch (err) {
      Raven.captureException(err, { extra: { event, data } })
    }
  }

  trackPageView(location) {
    this.track('Page View', {
      Path: location.pathname,
    })
  }

  clear() {
    mixpanel.cookie.clear()
    mixpanel.init(this._token)
    Raven.setUserContext()
  }

}

export default new Tracker(__MIXPANEL_TOKEN__)
