import Relay from 'react-relay'
export const MUTATION_REQUEST = 'Mutation Request'

function createMutationMiddleware() {
  return store => next => action => {
    const request = action[MUTATION_REQUEST]
    if (typeof request === 'undefined') {
      return next(action)
    }

    const {
      types,
      mutation: mutation,
    } = request
    const { dispatch, getState } = store

    if (!types) {
      // Normal action: pass it on
      return next(action)
    }

    if (!Array.isArray(types) || !(types.length >= 3)) {
      throw new Error('Expected an array of at least three action types.')
    }

    if (!types.every(type => typeof type === 'string')) {
      throw new Error('Expected action types to be strings.')
    }

    if (typeof mutation !== 'function') {
      throw new Error('Expected mutation to be a function.')
    }
    function actionWith(data) {
      const finalAction = Object.assign({}, action, data)
      delete finalAction[MUTATION_REQUEST]
      return finalAction
    }

    const [requestType, successType, failureType] = types

    next(actionWith({ type: requestType }))

    const update = mutation(getState(), dispatch)
    if (!update) {
      return null
    }

    return new Promise((resolve, reject) => {
      const onSuccess = (response) => resolve({ response })
      const onFailure = (transaction) => reject(transaction)
      Relay.Store.commitUpdate(update, { onSuccess, onFailure })
    })
      .then(response => next(actionWith({
        type: successType,
        payload: Object.assign({}, action.payload, response),
      })))
      .catch(err => next(actionWith({
        type: failureType,
        error: true,
        payload: err,
      })))
  }
}

const mutationMiddleware = createMutationMiddleware()

export default mutationMiddleware
