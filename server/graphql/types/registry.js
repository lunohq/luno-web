import { nodeDefinitions, fromGlobalId } from 'graphql-relay'

class Registry {
  constructor() {
    this._typeMap = {}
    this._modelMap = {}
  }

  registerType({ type, model, resolve }) {
    this._typeMap[type.name] = { type, model, resolve }
    this._modelMap[model] = { type, model, resolve }
  }

  getType(nameOrInstance) {
    const registration = this.getRegistration(nameOrInstance)
    return registration ? registration.type : null
  }

  getRegistration(nameOrInstance) {
    return typeof nameOrInstance === 'object' ? this._modelMap[nameOrInstance] : this._typeMap[nameOrInstance]
  }
}

const registry = new Registry()

export function registerType({ type, model, resolve }) {
  registry.registerType({ type, model, resolve })
  return type
}

function resolveGlobalId(globalId) {
  const { type, id } = fromGlobalId(globalId)
  const registration = registry.getRegistration(type)
  if (!registration) throw new Error(`Unregistered type: ${type}`)
  const { resolve } = registration
  if (typeof resolve !== 'function') throw new Error(`Resolve must be function: ${type}`)
  return resolve(id)
}

function resolveInstance(instance) {
  const registration = registry.getRegistration(instance)
  if (!registration) throw new Error(`Unregistered type: ${instance}`)
  return registration.type
}

const { nodeInterface, nodeField } = nodeDefinitions(resolveGlobalId, resolveInstance)

export {
  nodeInterface,
  nodeField,
}
export default registry
