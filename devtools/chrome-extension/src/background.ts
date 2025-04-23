import { IncomingChannelHandler } from '~channel/IncomingChannel'
import type { IPort } from '~channel/types'
import { warn } from '~utils/logger'

const portMap = new Map<number, IPort>()

const devtoolsChannelHandler = new IncomingChannelHandler({
  name: '@formily-devtools-panel-script',
  onMessage: (message, port) => {
    if (message && message.name === 'init') {
      const tabId = message.tabId
      portMap.set(tabId, port)
    }
  },
  onDisconnect: (port) => {
    portMap.forEach((p, tabId) => {
      if (p === port) {
        portMap.delete(tabId)
      }
    })
  },
})

const contentChannelHandler = new IncomingChannelHandler({
  name: '@formily-devtools-content-script',
  onMessage: (message, port: chrome.runtime.Port) => {
    const tabId = port.sender?.tab?.id
    if (tabId) {
      const devtoolsPort = portMap.get(tabId)
      if (devtoolsPort) {
        devtoolsPort.postMessage(message)
      } else {
        warn('devtoolsPort not found', tabId)
      }
    } else {
      warn('sender.tab not defined')
    }
  },
})

devtoolsChannelHandler.attach()
contentChannelHandler.attach()
