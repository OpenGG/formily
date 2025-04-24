import { log } from '~utils/logger'

import { dataSourceModel } from '../models/dataSourceModel'
import { useModel } from '../models/helpers'
import { selectModel } from '../models/selectModel'

export const useSelected = () => {
  const {
    state: { dataSourceArray },
  } = useModel(dataSourceModel)
  const {
    state: { key, rootId },
  } = useModel(selectModel)
  const found: any =
    dataSourceArray.find((item: any) => item[''].id === rootId) ||
    dataSourceArray[0] ||
    {}

  const selectedRootId = found['']?.id || ''
  log('useSelected', found, selectedRootId)
  if (found[key]) {
    return {
      rootId: selectedRootId,
      root: found,
      key,
      inspected: found[key],
    }
  }
  return {
    rootId: selectedRootId,
    root: found,
    key: '',
    inspected: found[''],
  }
}
