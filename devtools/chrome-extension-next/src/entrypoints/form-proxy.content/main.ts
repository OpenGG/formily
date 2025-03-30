import {
  CHANNEL_CONTENT_TO_BACKGROUND,
  SOURCE_FORM_HOOK_CONTENT,
} from '@/constants'

export const proxyMain = () => {
  const port = chrome.runtime.connect({
    name: CHANNEL_CONTENT_TO_BACKGROUND,
  })
  window.addEventListener(
    'message',
    (event) => {
      if (event.source !== window) {
        return
      }
      const { source, ...payload } = event.data
      if (source !== SOURCE_FORM_HOOK_CONTENT) {
        return
      }
      port.postMessage({
        source,
        ...payload,
      })
    },
    false
  )
}
