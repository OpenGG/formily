import React from 'react'

import { useSelected } from '../hooks/useSelected'
import { dataSourceModel } from '../models/dataSourceModel'
import { useModel } from '../models/helpers'

export const Tabs = ({ onChange }) => {
  const { rootId } = useSelected()
  const {
    state: { dataSourceArray },
  } = useModel(dataSourceModel)
  return (
    <div className="tabs">
      {dataSourceArray.map((item: any, index) => (
        <div
          className={`tabItem ${rootId == item[''].id ? 'active' : ''}`}
          key={index}
          onClick={() => {
            if (onChange) {
              onChange(item[''].id)
            }
          }}>
          <span>Form#{index + 1}</span>
        </div>
      ))}
    </div>
  )
}
