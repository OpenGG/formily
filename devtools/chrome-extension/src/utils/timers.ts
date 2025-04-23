export type Interval = ReturnType<typeof setInterval>
export type Timeout = ReturnType<typeof setTimeout>

export const clearNullableTimeout = (timeout: Timeout | null) => {
  if (timeout) {
    clearTimeout(timeout)
  }
}
export const clearNullableInterval = (interval: Interval | null) => {
  if (interval) {
    clearInterval(interval)
  }
}
