export const nextTick = (fn: () => void) => {
  Promise.resolve().then(fn)
}
