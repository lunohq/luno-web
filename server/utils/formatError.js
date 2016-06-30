import logger from '../logger'
import { formatError as graphQLFormatError } from 'graphql'

/**
 * Custom formatError func for GraphQL.
 *
 * This lets us log the error to stdout and sentry. There isn't a better
 * mechanism for doing this within GraphQL yet.
 *
 */
export default function formatError(err) {
  if (err.originalError && err.originalError.code) {
    err.message = err.originalError.code
  } else {
    logger.error('GraphQL Error', { err })
  }
  return graphQLFormatError(err)
}
