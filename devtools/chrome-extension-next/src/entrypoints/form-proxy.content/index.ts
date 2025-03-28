import { proxyMain } from './main'

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: true,
  matchAboutBlank: false,
  world: 'ISOLATED',
  main: proxyMain,
})
