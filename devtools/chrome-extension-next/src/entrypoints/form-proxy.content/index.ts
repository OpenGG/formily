import { proxyMain } from './main'

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: false,
  matchAboutBlank: false,
  world: 'ISOLATED',
  main: proxyMain,
})
