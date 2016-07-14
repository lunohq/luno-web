import debug from 'debug'

export default function (filename) {
  const parts = filename.split('/').map(part => part.split('.')[0])
  const index = parts.indexOf('server')
  return debug(parts.slice(index).join(':'))
}
