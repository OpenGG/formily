import React from 'react'
import ReactJson from 'react-json-view'

import { useSelected } from '../hooks/useSelected'

export const RightPanel = () => {
  const { inspected } = useSelected()

  return (
    <div className="rightPanel">
      <ReactJson
        src={inspected}
        name={inspected && inspected.displayName}
        theme="hopscotch"
        displayDataTypes={false}
        enableClipboard={false}
        sortKeys={true}
        onEdit={false}
        onAdd={false}
        onDelete={false}
        iconStyle="square"
      />
    </div>
  )
}
