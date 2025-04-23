import { createModel } from './helpers'

export const selectModel = createModel(
  {
    rootId: '',
    key: '',
  },
  (state) => ({
    selectRootId(rootId: string) {
      state.rootId = rootId
    },
    selectKey(key: string) {
      state.key = key
    },
  }),
)
