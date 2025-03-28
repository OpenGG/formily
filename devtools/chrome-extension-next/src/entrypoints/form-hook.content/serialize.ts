export const serialize = (obj: any, seen = new WeakMap()) => {
  // basic types
  if (typeof obj !== 'object' || !obj) {
    return obj
  }

  // circular reference
  if (seen.has(obj)) {
    return '#CircularReference'
  }

  // function
  if (typeof obj === 'function') {
    seen.set(obj, true)
    return `f ${obj.displayName || obj.name}(){ }`
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
  if (typeof obj.toJS !== 'undefined') {
    seen.set(obj, true)
    return obj.toJS()
  }

  // has toJSON()
  if (obj.toJSON) {
    seen.set(obj, true)
    return obj.toJSON()
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
