/* eslint-disable no-unused-vars */
import { MUTATION_REQUEST } from '../middleware/mutationMiddleware'

import CancelFileUploads from 'm/CancelFileUploads'

const START_UPLOAD = 'luno/files/START_UPLOAD'
const CLEAR_UPLOADS = 'luno/files/CLEAR_UPLOADS'
const CANCEL_UPLOAD = 'luno/files/CANCEL_UPLOAD'
const CANCEL_UPLOAD_SUCCESS = 'luno/files/CANCEL_UPLOAD_SUCCESS'
const CANCEL_UPLOAD_FAILURE = 'luno/files/CANCEL_UPLOAD_FAILURE'
const CANCEL_UPLOADS = 'luno/files/CANCEL_UPLOADS'
const CANCEL_UPLOADS_SUCCESS = 'luno/files/CANCEL_UPLOADS_SUCCESS'
const CANCEL_UPLOADS_FAILURE = 'luno/files/CANCEL_UPLOADS_FAILURE'

const initialState = {
  uploads: {},
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case START_UPLOAD: {
      const { uploads } = state
      const { transaction, ...rest } = action.payload
      return {
        uploads: {
          ...uploads,
          [transaction.getID()]: {
            transaction,
            ...rest,
          },
        }
      }
    }
    case CANCEL_UPLOAD_SUCCESS: {
      const { uploads: prev } = state
      const uploads = Object.assign({}, prev)
      action.payload.forEach(mutationId => {
        delete uploads[mutationId]
      })
      return { uploads }
    }
    case CANCEL_UPLOADS_SUCCESS:
    case CLEAR_UPLOADS: {
      return initialState
    }
    default:
      return state
  }
}

export function startUpload({ file, transaction }) {
  return {
    type: START_UPLOAD,
    payload: { file, transaction },
  }
}

export function clearUploads() {
  return {
    type: CLEAR_UPLOADS,
  }
}

export function cancelUpload(transaction) {
  return {
    [MUTATION_REQUEST]: {
      types: [CANCEL_UPLOAD, CANCEL_UPLOAD_SUCCESS, CANCEL_UPLOAD_FAILURE],
      mutation: (state, dispatch) => {
        const upload = state.files.uploads[transaction.getID()]
        return new CancelFileUploads({ uploads: [upload] })
      },
    },
  }
}

export function cancelUploads() {
  return {
    [MUTATION_REQUEST]: {
      types: [CANCEL_UPLOADS, CANCEL_UPLOADS_SUCCESS, CANCEL_UPLOAD_FAILURE],
      mutation: (state, dispatch) => {
        const uploads = Object.values(state.files.uploads)
        let mutation
        if (uploads.length) {
          mutation = new CancelFileUploads({ uploads })
        }
        return mutation
      },
    },
  }
}
