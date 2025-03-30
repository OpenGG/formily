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
