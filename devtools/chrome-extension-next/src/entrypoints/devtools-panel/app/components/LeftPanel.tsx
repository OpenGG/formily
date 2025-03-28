import { useState } from 'react'

import { FieldTree } from './FieldTree'
import { Tabs } from './Tabs'

export const LeftPanel = ({
  forms,
  onSelect,
}: {
  forms: any[]
  onSelect: (node: { current: number; key: string }) => void
}) => {
  const [current, setCurrent] = useState(0)
  const form = forms[current]

  return (
    <div className="leftPanel">
      <Tabs
        forms={forms}
        current={current}
        onChange={(index: any) => {
          setCurrent(index)
          onSelect({
            current: index,
            key: '',
          })
        }}
      />
      {form && (
        <FieldTree
          form={form}
          onSelect={(key) => {
            if (onSelect) {
              onSelect({
                current,
                key,
              })
            }
          }}
        />
      )}
    </div>
  )
}
