const noop: any = () => {}
const choose = <T>(fn: T) => {
  if (process.env.NODE_ENV === 'production') {
    return noop as T
  }
  return fn
}
export const log = choose((console as Console).log)
export const warn = choose(console.warn)
export const error = choose(console.error)
