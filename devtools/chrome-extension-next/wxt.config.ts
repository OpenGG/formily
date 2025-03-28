import { defineConfig, type Entrypoint, type Wxt } from 'wxt'
import path from 'path'

// The demo page can be accessed at http://localhost:3000/src/demo/index.html
const addDemoPage = (wxt: Wxt, entrypoints: Entrypoint[]) => {
  // Skip adding the demo page if not in development mode
  if (wxt.config.mode !== 'development') {
    return
  }
  const demoPage = {
    name: 'demo',
    inputPath: path.resolve(wxt.config.srcDir, 'demo/index.html'),
    type: 'unlisted-page',
    options: {},
    outputDir: wxt.config.outDir,
  } as const

  // Avoid duplicate entry by checking if the demo page already exists
  if (entrypoints.find((e) => e.name === demoPage.name)) {
    return
  }

  // Add the demo page entry if it doesn't exist
  entrypoints.push(demoPage)
}

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Formily DevTools',
    homepage_url: 'https://formilyjs.org/',
    host_permissions: ['<all_urls>'],
  },
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  srcDir: 'src',
  runner: {
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  hooks: {
    'entrypoints:resolved': (wxt, entrypoints) => {
      addDemoPage(wxt, entrypoints)
    },
  },
})
