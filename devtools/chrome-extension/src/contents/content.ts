import type { PlasmoCSConfig } from 'plasmo'

import Channel from '~channel/Channel'
import { log } from '~utils/logger'

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  run_at: 'document_start',
  all_frames: true,
}
const channel = new Channel({
  name: '@formily-devtools-content-script',
})

window.addEventListener(
  'message',
  (event) => {
    const { source, ...payload } = event.data
    if (source === '@formily-devtools-inject-script') {
      channel.connect()

      channel.sendMessage({
        source,
        ...payload,
      })
    }
  },
  false,
)
