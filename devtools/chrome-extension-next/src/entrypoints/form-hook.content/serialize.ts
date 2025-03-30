export const serialize = (obj: any, seen = new WeakMap()): any => {
  const type = typeof obj
  // function
  if (type === 'function') {
    seen.set(obj, true)
    return `f ${obj.displayName || obj.name}(){ }`
  }

  // symbol
  if (type === 'symbol') {
    return obj.toString()
  }

  // basic types
  if (type !== 'object' || !obj) {
    return obj
  }

  // circular reference
  if (seen.has(obj)) {
    return '#CircularReference'
  }

  // array
  if (Array.isArray(obj)) {
    seen.set(obj, true)
    return obj.map((item): any => serialize(item, seen)) as any[]
  }

  // react node
  if ('$$typeof' in obj && '_owner' in obj) {
    seen.set(obj, true)
    return '#ReactNode'
  }

  // has toJS()
  if (typeof obj.toJS === 'function') {
    seen.set(obj, true)
    return serialize(obj.toJS(), seen)
  }

  // has toJSON()
  if (typeof obj.toJSON === 'function') {
    seen.set(obj, true)
    return serialize(obj.toJSON(), seen)
  }

  // iterate over object properties
  seen.set(obj, true)
  const result: any = {}
  const keys = Object.keys(obj)
  for (let key of keys) {
    result[key] = serialize(obj[key], seen)
  }

  return result
}
