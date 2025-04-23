import { error, log } from '~utils/logger'
import { nextTick } from '~utils/nextTick'

import { ChromePort } from './ChromePort'
import { KeepAliveStrategy } from './KeepAliveStrategy'
import {
  type CallbackOnConnect,
  type CallbackOnDisconnect,
  type CallbackOnMessage,
  type IPort,
} from './types'

const createPort = (name: string) => {
  return new ChromePort({ name })
}

class Channel {
  private port: IPort
  private keepAliveStrategy: KeepAliveStrategy
  private connected = false
  private name: string
  private onMessage?: CallbackOnMessage
  private onConnect?: CallbackOnConnect
  private onDisconnect?: CallbackOnDisconnect

  constructor({
    name,
    onMessage,
    onConnect,
    onDisconnect,
  }: {
    name: string
    onMessage?: CallbackOnMessage
    onConnect?: CallbackOnConnect
    onDisconnect?: CallbackOnDisconnect
  }) {
    this.name = name
    this.onMessage = onMessage
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.keepAliveStrategy = new KeepAliveStrategy((message) => {
      this.sendMessage(message)
    }, this.handleHeartbeatTimeout)
  }

  connect() {
    log('Channel:connect', this.name)
    this.doConnect()
  }

  private doConnect() {
    if (this.connected) {
      return
    }
    log('Channel:doConnect', this.name)
    this.connected = true
    this.port = createPort(this.name)

    // attach events
    this.port.onMessage.addListener(this.handleMessage)
    this.port.onDisconnect.addListener(this.handleDisconnect)

    // start heartbeat
    this.keepAliveStrategy.start()
    log('Channel:init', this.name)
    nextTick(() => {
      this.onConnect?.(this.port)
    })
  }

  private handleMessage = (message: any) => {
    log('Channel:handleMessage', this.name, message)

    if (this.keepAliveStrategy.handleMessage(message)) {
      return
    }
    // handle message
    this.onMessage?.(message, this.port)
  }

  private handleDisconnect = () => {
    log('Channel:onDisconnect', this.name)

    // disconnect on heartbeat timeout
    this.disconnect()
    this.onDisconnect?.(this.port)
    this.doConnect()
  }
  private handleHeartbeatTimeout = () => {
    log('Channel:onHeartbeatTimeout', this.name)

    this.disconnect()
    this.doConnect()
  }

  disconnect() {
    log('Channel:disconnect', this.name)

    if (!this.connected) {
      return
    }
    this.connected = false
    this.keepAliveStrategy.stop()
    this.port.onMessage.removeListener(this.handleMessage)
    this.port.onDisconnect.removeListener(this.handleDisconnect)
    this.port.disconnect()
  }

  sendMessage(message: any) {
    log('Channel:sendMessage', this.name, message, this.connected)

    if (!this.connected) {
      return
    }
    this.doConnect()
    try {
      this.port.postMessage(message)
    } catch (e) {
      error('Channel:sendMessage error', e)
      this.disconnect()
      this.doConnect()
    }
  }
}

export default Channel
