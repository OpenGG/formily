import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'
import {
  CHANNEL_DEVTOOLS_PANEL_TO_BACKGROUND,
  FORMILY_DEV_TOOLS_INSPECT_HOOK,
} from '@/constants'
import { inspectedWindowEval } from '../devtools/utils'

const messageChannel = chrome.runtime.connect({
  name: CHANNEL_DEVTOOLS_PANEL_TO_BACKGROUND,
})

messageChannel.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId,
})

const Devtools = () => {
  const [state, setState] = useState<any[]>([])
  useEffect(() => {
    let store: Record<string, any> = {}
    const update = () => {
      setState(Object.values(store))
    }

    // Pull formily states to store
    const pullAllFormilyInstances = async () => {
      await inspectedWindowEval(
        `window.${FORMILY_DEV_TOOLS_INSPECT_HOOK}.openDevtools()`
      )
      const res = (await inspectedWindowEval(
        `window.${FORMILY_DEV_TOOLS_INSPECT_HOOK}.getAllFormilyInstances()`
      )) as Record<string, any>

      store = res
      update()
    }
    const pullFormilyInstance = async (id: string) => {
      const form = await inspectedWindowEval(
        `window.${FORMILY_DEV_TOOLS_INSPECT_HOOK}.getFormilyInstance(${JSON.stringify(
          id
        )})`
      )
      store[id] = form
      update()
    }
    messageChannel.onMessage.addListener(({ type, id }) => {
      switch (type) {
        case 'init':
          pullAllFormilyInstances()
          break
        case 'install':
        case 'update':
          pullFormilyInstance(id)
          break
        case 'uninstall':
          if (store[id]) {
            delete store[id]
            update()
          }
          break
      }
    })

    pullAllFormilyInstances()
  }, [])
  return <App forms={state} />
}

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <Devtools />
    </StrictMode>
  )
}
