import React from 'react'

export const Tabs = ({ dataSource, current, onChange }) => {
  return (
    <div className="tabs">
      {dataSource.map((item, index) => {
        return (
          <div
            className={`tabItem ${current == item[''].id ? 'active' : ''}`}
            key={index}
            onClick={() => {
              if (onChange) {
                onChange(item[''].id)
              }
            }}>
            <span>Form#{index + 1}</span>
          </div>
        )
      })}
    </div>
  )
}
