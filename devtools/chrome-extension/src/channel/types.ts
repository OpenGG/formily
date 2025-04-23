export interface IPort {
  name: string
  postMessage: (message: any) => void
  onMessage: {
    addListener: (callback: (message: any) => void) => void
    removeListener: (callback: (message: any) => void) => void
  }
  onDisconnect: {
    addListener: (callback: () => void) => void
    removeListener: (callback: () => void) => void
  }
  disconnect: () => void
}

export enum MessageName {
  ping = 'channel:ping',
  pong = 'channel:pong',
}

export type CallbackOnConnect = (port: IPort) => void
export type CallbackOnMessage = (message: any, port: IPort) => void
export type CallbackOnDisconnect = (port: IPort) => void
