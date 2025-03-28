export const backgroundMain = () => {
  let connections: Record<string, chrome.runtime.Port> = {}

  chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === '@formily-devtools-panel-script') {
      const extensionListener = function (message: any) {
        // The original connection event does not include the tab ID of the devtools page,
        // so we need to explicitly send it.
        if (message.name == 'init') {
          connections[message.tabId] = port
          return
        }
        // Handling of other messages
      }

      // Listen for messages sent from the developer tools page
      port.onMessage.addListener(extensionListener)

      port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(extensionListener)
        let tabs = Object.keys(connections)
        for (let i = 0, len = tabs.length; i < len; i++) {
          if (connections[tabs[i]] == port) {
            delete connections[tabs[i]]
            break
          }
        }
      })
    }
  })

  // Receive messages from the content script and forward them to the
  // corresponding developer tools page for the current tab.
  chrome.runtime.onMessage.addListener(function (request: any, sender) {
    // Messages from the content script should already have sender.tab set.
    if (sender.tab) {
      let tabId = sender.tab.id

      if (tabId && connections.hasOwnProperty(tabId)) {
        connections[tabId].postMessage(request)
      } else {
        console.info('The tab is not found in the connection list.')
      }
    } else {
      console.info('sender.tab is not defined.')
    }
    return true
  })
}
