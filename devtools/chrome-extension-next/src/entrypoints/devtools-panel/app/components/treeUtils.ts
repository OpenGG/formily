import { FormPath } from '@formily/shared'
import { useRef, useEffect, useCallback, ReactNode } from 'react'

/**
 * Represents a node in the tree structure.
 * @typedef {Object} TreeNode
 * @property {FormPath} path - Used to build the tree structure.
 * @property {string} key - Key for React rendering.
 * @property {string | (() => ReactNode)} title - Element for rc-tree title rendering.
 * @property {string} name - Name to show in renderTitle function.
 * @property {string} label - Label to show in renderTitle function.
 * @property {any} data - Raw data associated with the node.
 * @property {search} string - Search keyword for filtering.
 * @property {TreeNode[]} children - Child nodes of the current node.
 */
export type TreeNode = {
  path: FormPath
  key: string
  title: string | (() => ReactNode)
  name: string
  label: string
  data: any
  search: string
  children: TreeNode[]
}

export const isHighlighted = (node: TreeNode, keyword: string) => {
  return node.search.includes(keyword)
}

export const createTree = (
  form: Record<string, unknown> = {},
  renderTitle: (node: TreeNode) => ReactNode
) => {
  const treeNodes: Record<string, TreeNode> = {}
  const root: TreeNode = {
    path: FormPath.parse(''),
    key: '',
    title: 'Form',
    name: '',
    label: '',
    data: null,
    search: '',
    children: [],
  }
  const findParent = (node: TreeNode): TreeNode => {
    let parentPath = node.path
    for (let i = 0; i <= parentPath.segments.length; i++) {
      parentPath = parentPath.parent()
      const key = parentPath.toString()
      const parentNode = treeNodes[key]
      if (parentNode) {
        return parentNode
      }
    }
    throw new Error('Parent not found')
  }
  Object.keys(form).forEach((key) => {
    if (key == '') {
      root.data = form[key]
      treeNodes[key] = root
    } else {
      const data = form[key]
      const node: TreeNode = {
        path: FormPath.parse(key),
        key,
        title: () => renderTitle(node),
        name: key,
        label: getTreeNodeTitle(data),
        data,
        search: '',
        children: [],
      }
      treeNodes[key] = node
    }
  })
  Object.keys(treeNodes).forEach((key) => {
    if (key == '') {
      return
    }
    const node = treeNodes[key]
    const parent = findParent(node)
    if (parent) {
      const name = (key || '').slice(
        parent && parent.key ? parent.key.length + 1 : 0
      )
      node.name = name
      node.search = `${node.name} ${node.label}`.toLowerCase()
      parent.children.push(node)
    }
  })
  return root
}

const getTreeNodeTitle = (data: any): string => {
  const title = data?.title
  if (typeof title === 'string') {
    return title
  }
  if (title && typeof title === 'object') {
    return title.title || ''
  }
  return ''
}

type DebounceFunction<T extends (...args: any[]) => void> = (
  ...args: Parameters<T>
) => void

export const useDebounceFn = <T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): DebounceFunction<T> => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    },
    [delay]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [])

  return debouncedFn
}
