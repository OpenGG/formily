export const inspectedWindowEval = <T>(code: string) =>
  new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(code, (result: T, error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(result)
    })
  })

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
