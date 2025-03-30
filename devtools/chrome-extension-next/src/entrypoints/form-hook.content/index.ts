import { backendMain } from './main'

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: false,
  matchAboutBlank: false,
  world: 'MAIN',
  main: backendMain,
})
