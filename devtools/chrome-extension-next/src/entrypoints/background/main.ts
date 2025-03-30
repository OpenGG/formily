import {
  CHANNEL_CONTENT_TO_BACKGROUND,
  CHANNEL_DEVTOOLS_PANEL_TO_BACKGROUND,
} from '@/constants'

type PortMap = Map<number, chrome.runtime.Port>
export const backgroundMain = () => {
  const contentConnections: PortMap = new Map()
  const devtoolsConnections: PortMap = new Map()

  const dealContentPort = (port: chrome.runtime.Port) => {
    const tabId = port.sender?.tab?.id
    if (typeof tabId !== 'number') {
      throw new Error('tabId or frameId is not defined')
    }

    contentConnections.set(tabId, port)

    const contentMessageHandler = (message: any) => {
      const devPort = devtoolsConnections.get(tabId)

      if (devPort) {
        devPort.postMessage(message)
      }
    }

    // Listen for messages sent from the developer tools page
    port.onMessage.addListener(contentMessageHandler)

    port.onDisconnect.addListener(() => {
      contentConnections.delete(tabId)
    })
  }

  const dealDevtoolsPort = (port: chrome.runtime.Port) => {
    // Listen for messages sent from the developer tools page
    const extensionListener = function (message: any) {
      // console.log('extensionListener', message)
      // The original connection event does not include the tab ID of the devtools page,
      // so we need to explicitly send it.
      if (message.name == 'init') {
        devtoolsConnections.set(message.tabId, port)
        return
      }
      // Handling of other messages
    }

    port.onMessage.addListener(extensionListener)

    port.onDisconnect.addListener(function (port) {
      for (const [key, value] of devtoolsConnections.entries()) {
        if (value === port) {
          devtoolsConnections.delete(key)
          break
        }
      }
    })
  }

  const channelHandlers: Record<string, (port: chrome.runtime.Port) => void> = {
    [CHANNEL_CONTENT_TO_BACKGROUND]: dealContentPort,
    [CHANNEL_DEVTOOLS_PANEL_TO_BACKGROUND]: dealDevtoolsPort,
  } as const

  chrome.runtime.onConnect.addListener((port) => {
    // console.log('onConnect', port)
    const handler = channelHandlers[port.name]
    handler?.(port)
  })
}
