import debug from 'debug'

export default function (filename) {
  const parts = filename.split('/').map(part => part.split('.')[0])
  const index = parts.indexOf('luno-web')
  return debug(parts.slice(index + 1).join(':'))
}
