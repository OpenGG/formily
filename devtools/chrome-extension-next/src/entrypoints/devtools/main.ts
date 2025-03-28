import { inspectedWindowEval, wait } from './utils'

const createPanel = () => {
  browser.devtools.panels.create(
    '🍀Formily',
    'icon/128.png',
    'devtools-panel.html'
  )
}

/**
 * Starts checking for the presence of a Formily instance in the inspected window.
 *
 * This function enters an infinite loop, repeatedly checking if a Formily instance
 * is present in the window. If found, it breaks the loop and creates the panel.
 * If an error occurs during the check, it ignores the error and continues looping.
 *
 * @returns {Promise<void>} A promise that resolves when the panel is created.
 */
const startCheckFormilyPresence = async () => {
  // Infinite loop to check for Formily instance
  for (;;) {
    try {
      // Evaluate a script in the inspected window to check for Formily instance
      const hasFormily = await inspectedWindowEval(
        'window.__FORMILY_DEV_TOOLS_HOOK__ && window.__FORMILY_DEV_TOOLS_HOOK__.hasFormilyInstance'
      )

      // If Formily instance is found, break the loop
      if (hasFormily) {
        break
      }
      // Otherwise, continue looping
    } catch (err) {
      // Ignore errors and continue looping
    }

    // Wait for 1 second before the next check
    await wait(1000)
  }
  // Create the panel after finding the Formily instance
  createPanel()
}

// Start the process of checking for Formily instance
startCheckFormilyPresence()
