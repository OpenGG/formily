import React from 'react'

import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { useSelected } from './hooks/useSelected'
import { subscribeModel } from './models/helpers'
import { selectModel } from './models/selectModel'

const select = (key: string, rootId: string) => {
  if (chrome && chrome.devtools && chrome.devtools.inspectedWindow) {
    chrome.devtools.inspectedWindow.eval(
      `window.__FORMILY_DEV_TOOLS_HOOK__.setVm(${JSON.stringify(key)},${JSON.stringify(rootId)})`,
    )
  }
}

subscribeModel(selectModel, (state) => {
  select(state.key, state.rootId)
})

export const App = () => {
  return (
    <div className="app">
      <LeftPanel />
      <RightPanel />
    </div>
  )
}
