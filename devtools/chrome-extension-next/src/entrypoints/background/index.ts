import { backgroundMain } from './main'

export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });
  backgroundMain()
})
