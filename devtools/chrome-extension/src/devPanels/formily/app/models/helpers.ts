import { proxy, subscribe, useSnapshot } from 'valtio'
import { proxyMap, proxySet } from 'valtio/utils'

const createProxy = <T extends object>(state: T): T => {
  if (state instanceof Map) {
    return proxyMap(state) as T
  }
  if (state instanceof Set) {
    return proxySet(state) as T
  }
  return proxy(state)
}

export const createModel = <T extends object, A extends object>(
  state: T,
  init: (state: T) => A,
): {
  state: T
  actions: A
} => {
  const proxyState = createProxy(state)
  const actions = init(proxyState)
  const model = {
    state: proxyState,
    actions,
  }
  return model
}

export const useModel = <T extends object, A extends object>({
  state,
  actions,
}: {
  state: T
  actions: A
}) => {
  return {
    get state() {
      return useSnapshot(state)
    },
    actions,
  }
}

export const subscribeModel = <T extends object, A extends object>(
  {
    state,
  }: {
    state: T
    actions: A
  },
  cb: (state: T) => void,
) => {
  subscribe(state, () => {
    cb(state)
  })
}
