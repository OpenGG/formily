import { toArr } from '@formily/shared'

export const Tabs = ({
  forms,
  current,
  onChange,
}: {
  forms: any[]
  current?: number
  onChange?: (index: number) => void
}) => {
  current = current || 0
  return (
    <div className="tabs">
      {toArr(forms).map((_, index) => {
        return (
          <div
            className={`tabItem ${current == index ? 'active' : ''}`}
            key={index}
            onClick={() => {
              onChange?.(index)
            }}
          >
            <span>Form#{index + 1}</span>
          </div>
        )
      })}
    </div>
  )
}
