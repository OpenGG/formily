import { warn } from '~utils/logger'
import {
  clearNullableInterval,
  clearNullableTimeout,
  type Interval,
  type Timeout,
} from '~utils/timers'

import { MessageName } from './types'

export class KeepAliveStrategy {
  constructor(
    private sendMessage: (message: unknown) => void,
    private onHeartbeatTimeout: () => void,
  ) {}
  private started = false
  private pingInterval = 10 * 1000
  private pingTimeout = 3 * 1000
  private timerInterval: Interval | null = null
  private timerTimeout: Timeout | null = null
  start() {
    if (this.started) {
      return
    }
    this.started = true
    // start heartbeat
    this.timerInterval = setInterval(() => {
      // setup timeout of heartbeat response
      this.timerTimeout = setTimeout(() => {
        this.handlePingTimeout()
      }, this.pingTimeout)

      this.sendMessage({ name: MessageName.ping })
    }, this.pingInterval)
  }
  private handlePingTimeout() {
    warn('Ping timeout, connection might be lost.')
    this.stop()
    this.onHeartbeatTimeout()
  }
  handleMessage(message: any) {
    const isPong = message && message.name === MessageName.pong
    if (isPong) {
      clearNullableTimeout(this.timerTimeout)
      return true
    }
    return false
  }
  stop() {
    if (!this.started) {
      return
    }
    this.started = false
    clearNullableInterval(this.timerInterval)
    clearNullableTimeout(this.timerTimeout)
    this.timerInterval = null
    this.timerTimeout = null
  }
}

export class KeepAliveStrategyIncomingHandler {
  handleMessage(message: any) {
    const isPing = message && message.name === MessageName.ping
    if (isPing) {
      return { name: MessageName.pong }
    }
    return null
  }
}
