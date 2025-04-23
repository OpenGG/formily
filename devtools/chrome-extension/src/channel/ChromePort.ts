import type { IPort } from './types'

export class ChromePort implements IPort {
  name: string
  private realPort: chrome.runtime.Port

  constructor({ name }: { name: string }) {
    this.name = name
    this.realPort = chrome.runtime.connect({ name })
  }

  postMessage(message: any) {
    this.realPort.postMessage(message)
  }

  get onMessage() {
    return this.realPort.onMessage
  }

  get onDisconnect() {
    return this.realPort.onDisconnect
  }

  disconnect() {
    this.realPort.disconnect()
  }
}
