import { browserHistory } from 'react-router'

const RESUME_KEY = 'luno:resume'

export function saveState(state) {
  const { reply } = state.form['form/reply'].values
  delete reply.topic.replies
  const payload = {
    pathname: window.location.pathname,
    reply,
  }
  window.localStorage.setItem(RESUME_KEY, JSON.stringify(payload))
}

export function redirect() {
  const data = window.localStorage.getItem(RESUME_KEY)
  if (!data) {
    return
  }

  const payload = JSON.parse(data)
  if (window.location.pathname !== payload.pathname && !payload.redirected) {
    payload.redirected = true
    window.localStorage.setItem(RESUME_KEY, JSON.stringify(payload))
    browserHistory.replace(payload.pathname)
  }
}

export default function resumeReply() {
  const data = window.localStorage.getItem(RESUME_KEY)
  if (!data) {
    return null
  }
  const payload = JSON.parse(data)
  window.localStorage.removeItem(RESUME_KEY)
  return payload.reply
}
