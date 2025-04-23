import React from 'react'

import { useModel } from '../models/helpers'
import { selectModel } from '../models/selectModel'
import { FieldTree } from './FieldTree'
import { Tabs } from './Tabs'

export const LeftPanel = ({ dataSource }) => {
  const { state, actions } = useModel(selectModel)
  return (
    <div className="leftPanel">
      <Tabs
        dataSource={dataSource}
        current={state.rootId}
        onChange={(id) => {
          actions.selectRootId(id)
        }}
      />
      <FieldTree
        dataSource={dataSource.find((item) => item[''].id === state.rootId)}
        onSelect={(node) => {
          actions.selectKey(node.path)
        }}
      />
    </div>
  )
}
