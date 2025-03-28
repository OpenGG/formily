import { useState } from 'react'

import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'

export const App = ({ forms }: { forms: any }) => {
  const [selected, setSelected] = useState({
    current: 0,
    key: '',
  })
  return (
    <div className="app">
      <LeftPanel
        forms={forms}
        onSelect={(info: any) => {
          setSelected(info)
          if (chrome && chrome.devtools && chrome.devtools.inspectedWindow) {
            chrome.devtools.inspectedWindow.eval(
              `window.__FORMILY_DEV_TOOLS_HOOK__.setVm("${info.key}","${
                forms[info.current][''].id
              }")`
            )
          }
        }}
      />
      <RightPanel
        dataSource={
          selected
            ? (forms &&
                forms[selected.current] &&
                forms[selected.current][selected.key]) ||
              {}
            : {}
        }
      />
    </div>
  )
}
