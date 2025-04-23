import { log } from '~utils/logger'

import { KeepAliveStrategyIncomingHandler } from './KeepAliveStrategy'
import {
  type CallbackOnConnect,
  type CallbackOnDisconnect,
  type CallbackOnMessage,
} from './types'

export class IncomingChannelHandler {
  private keepAliveStrategyIncomingHandler =
    new KeepAliveStrategyIncomingHandler()
  private name: string
  private onConnect?: CallbackOnConnect
  private onMessage?: CallbackOnMessage
  private onDisconnect?: CallbackOnDisconnect
  constructor({
    name,
    onMessage,
    onConnect,
    onDisconnect,
  }: {
    name: string
    onConnect?: CallbackOnConnect
    onMessage?: CallbackOnMessage
    onDisconnect?: CallbackOnDisconnect
  }) {
    this.name = name
    this.onMessage = onMessage
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
  }

  attach() {
    chrome.runtime.onConnect.addListener(this.handleConnect)
  }

  private handleMessage = (message: any, port: chrome.runtime.Port) => {
    const pongMessage =
      this.keepAliveStrategyIncomingHandler.handleMessage(message)

    log('IncomingChannel:handleMessage', this.name, message, pongMessage)

    if (pongMessage) {
      port.postMessage(pongMessage)
      return
    }

    this.onMessage?.(message, port)
  }

  private handleConnect = (port: chrome.runtime.Port) => {
    if (port.name !== this.name) {
      return
    }
    log('IncomingChannel:onConnect', this.name, port)

    port.onMessage.addListener(this.handleMessage)
    port.onDisconnect.addListener(this.handleDisconnect)
    this.onConnect?.(port)
  }

  private handleDisconnect = (port: chrome.runtime.Port) => {
    log('IncomingChannel:onDisconnect', this.name, port)

    port.onMessage.removeListener(this.handleMessage)
    port.onDisconnect.removeListener(this.handleDisconnect)
    this.onDisconnect?.(port)
  }
}
