import React from 'react'

import { useModel } from '../models/helpers'
import { selectModel } from '../models/selectModel'
import { FieldTree } from './FieldTree'
import { Tabs } from './Tabs'

export const LeftPanel = () => {
  const { actions } = useModel(selectModel)
  return (
    <div className="leftPanel">
      <Tabs
        onChange={(id) => {
          actions.selectRootId(id)
          actions.selectKey('')
        }}
      />
      <FieldTree
        onSelect={(node) => {
          actions.selectKey(node.path)
        }}
      />
    </div>
  )
}
