import { ref } from 'valtio'

import { clearNullableTimeout, type Timeout } from '~utils/timers'

import { createModel } from './helpers'

export const dataSourceModel = createModel(
  {
    dataSourceArray: ref<unknown[]>([]),
  },
  (state) => {
    const intermediateMap = new Map<string, unknown>()
    let timeout: Timeout | null = null
    let isDirty = false
    const write = () => {
      if (!isDirty) {
        return
      }
      isDirty = false
      state.dataSourceArray = ref([...intermediateMap.values()])
    }
    const scheduleDelaySync = () => {
      isDirty = true
      clearNullableTimeout(timeout)
      timeout = setTimeout(write, 100)
    }
    return {
      clear() {
        intermediateMap.clear()
        scheduleDelaySync()
      },
      set(key: string, value: unknown) {
        intermediateMap.set(key, value as object)
        scheduleDelaySync()
      },
      delete(key: string) {
        intermediateMap.delete(key)
        scheduleDelaySync()
      },
      forceSync() {
        write()
      },
    }
  },
)
