import { offsetToCursor } from 'graphql-relay'

export function cursorForInstanceInCollection(instance, connection) {
  let cursor
  for (const index in connection) {
    const c = connection[index]
    if (c.id === instance.id) {
      cursor = offsetToCursor(index)
      break
    }
  }
  return { cursor, node: instance }
}

export function idToCursor(id) {
  return new Buffer(id).toString('base64')
}

export function idFromCursor(cursor) {
  return new Buffer(cursor, 'base64').toString('ascii')
}

export function connectionFromDynamodb({ data, bounds, getId = item => item.id }) {
  const { first, last } = bounds
  const start = getId(data[0])
  const end = getId(data[data.length - 1])
  const startCursor = idToCursor(start)
  const endCursor = idToCursor(end)
  let hasNextPage = true
  let hasPreviousPage = true
  const firstId = first && getId(first)
  const lastId = last && getId(last)
  for (const item of data) {
    const itemId = getId(item)
    if (itemId === firstId) {
      hasPreviousPage = false
    } else if (itemId === lastId) {
      hasNextPage = false
    }
  }
  const edges = data.map(item => ({ node: item, cursor: idToCursor(getId(item)) }))
  return {
    edges,
    pageInfo: {
      startCursor,
      endCursor,
      hasPreviousPage,
      hasNextPage,
    },
  }
}
