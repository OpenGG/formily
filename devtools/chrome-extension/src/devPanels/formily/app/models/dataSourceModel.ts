import { createModel } from './helpers'

export const dataSourceModel = createModel(
  new Map<string, unknown>(),
  (state) => ({
    clear() {
      state.clear()
    },
    set(key: string, value: unknown) {
      state.set(key, value)
    },
    delete(key: string) {
      state.delete(key)
    },
  }),
)
