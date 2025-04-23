import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import Channel from '~channel/Channel'
import { warn } from '~utils/logger'

import { App } from './app'
import { dataSourceModel } from './app/models/dataSourceModel'
import { useModel } from './app/models/helpers'

const channel = new Channel({
  name: '@formily-devtools-panel-script',
  onConnect: () => {
    channel.sendMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId,
    })
  },
  onMessage: ({ type, id, graph }) => {
    if (type === 'init') {
      dataSourceModel.actions.clear()
    } else if (type === 'update') {
      dataSourceModel.actions.set(id, JSON.parse(graph) as never)
    } else if (type === 'uninstall') {
      dataSourceModel.actions.delete(id)
    } else {
      warn('unknown message type', type)
    }
  },
})

channel.connect()

chrome.devtools.inspectedWindow.eval(
  'window.__FORMILY_DEV_TOOLS_HOOK__.openDevtools()',
)

const Devtools = () => {
  const { state } = useModel(dataSourceModel)
  const dataSource = [...state.values()]
  useEffect(() => {
    chrome.devtools.inspectedWindow.eval(
      'window.__FORMILY_DEV_TOOLS_HOOK__.update()',
    )
  }, [])
  return <App dataSource={dataSource} />
}

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<Devtools />)
}
