import { Key, useState } from 'react'
import Tree, { type TreeProps } from 'rc-tree'

import { SearchBox } from './SearchBox'

import { createTree, isHighlighted, TreeNode, useDebounceFn } from './treeUtils'

import './FieldTree.less'

const renderTitle = (node: TreeNode) => {
  return (
    <>
      {node.name}
      <span className="tree-node-label">{node.label}</span>
    </>
  )
}

export const FieldTree = ({
  form,
  onSelect,
}: {
  form: any
  onSelect: (key: string) => void
}) => {
  const [keyword, setKeyword] = useState('')

  const treeData = useMemo(() => [createTree(form, renderTitle)], [form])
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() =>
    Object.keys(form)
  )

  useEffect(() => {
    setExpandedKeys(Object.keys(form))
  }, [form])

  const [selectedKeys, setSelectedKeys] = useState<string[]>([''])

  const handleSelect: TreeProps['onSelect'] = (_, { node }) => {
    setSelectedKeys([node.key as string])
    onSelect(node.key as string)
  }

  const filterTreeNode: TreeProps['filterTreeNode'] = (node) => {
    if (!keyword) {
      return false
    }
    return isHighlighted(node as unknown as TreeNode, keyword.toLowerCase())
  }

  const onSearch = useDebounceFn(
    ({
      target: { value },
    }: {
      target: {
        value: string
      }
    }) => {
      setKeyword(value.trim())
    },
    300
  )

  const onExpand = (keys: Key[]) => {
    setExpandedKeys(keys as string[])
  }

  return (
    <div className="fieldTree">
      <div className="fieldTreeToolBar">
        <SearchBox onChange={onSearch} />
      </div>

      <Tree
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        filterTreeNode={filterTreeNode}
        selectedKeys={selectedKeys}
        treeData={treeData}
        onSelect={handleSelect}
      />
    </div>
  )
}
