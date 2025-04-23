import React, { useEffect } from 'react'

import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { subscribeModel, useModel } from './models/helpers'
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

export const App = ({ dataSource }) => {
  const { state, actions } = useModel(selectModel)

  const selectedDataSource = dataSource.find(
    (item) => item[''].id === state.rootId,
  )

  useEffect(() => {
    if (!selectedDataSource && dataSource.length > 0) {
      actions.selectRootId(dataSource[0][''].id)
    }
  }, [state.rootId, dataSource, selectedDataSource])

  const inspectedNode = selectedDataSource?.[state.key]

  return (
    <div className="app">
      <LeftPanel dataSource={dataSource} />
      <RightPanel dataSource={inspectedNode || {}} />
    </div>
  )
}
