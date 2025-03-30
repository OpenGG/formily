import { valueType } from '@/utils/valueType'
import { serialize } from './serialize'
import type { Form } from '@formily/core'
import {
  FORMILY_DEV_TOOLS_INSPECT_HOOK,
  SOURCE_FORM_HOOK_CONTENT,
} from '@/constants'

const send = ({ type, id }: { type: string; id?: string | number }) => {
  window.postMessage(
    {
      source: SOURCE_FORM_HOOK_CONTENT,
      type,
      id,
    },
    '*'
  )
}

const globalScope = globalThis as any

const state = {
  hasFormilyInstance: false,
  hasOpenDevtools: false,
  store: valueType<Record<string, Form>>({}),
}

const devtoolsInspectHook = {
  openDevtools() {
    state.hasOpenDevtools = true
  },
  closeDevtools() {
    state.hasOpenDevtools = false
  },
  hasFormilyInstance() {
    return state.hasFormilyInstance
  },
  getAllFormilyInstances() {
    const serializedStore: Record<string, any> = {}
    Object.keys(state.store).forEach((key) => {
      const form = state.store[key]
      serializedStore[key] = serialize(form.getFormGraph())
    })
    return serializedStore
  },
  getFormilyInstance(key: string) {
    const form = state.store[key]
    return serialize(form?.getFormGraph())
  },
  /**
   * When user selects a field/form in dev tool's left panel tree, set global
   * variable $vm. Allows inspecting selected instance in console.
   * See: https://github.com/alibaba/formily/pull/2682
   *
   * @param fieldId - Field's unique identifier. Empty means entire form selected.
   * @param formId - Form's unique identifier.
   */
  setVm(fieldId: string, formId: string) {
    if (fieldId) {
      // If fieldId exists, set $vm to the instance of the corresponding field
      globalScope.$vm = state.store[formId].fields[fieldId]
    } else {
      // If the fieldId does not exist, set $vm to the instance of the entire form
      globalScope.$vm = state.store[formId]
    }
  },
}

const formilyCoreHook = {
  /**
   * This method is called by the following file:
   * packages/core/src/models/Form.ts
   * It is called in the onMount() hook.
   *
   * Inject the form instance into the hooks of the development tool.
   *
   * @param id - The unique identifier of the form.
   * @param form - The form instance.
   */
  inject(id: Form['id'], form: Form) {
    state.hasFormilyInstance = true
    state.store[id] = form
    send({
      type: 'install',
      id,
    })
    let timer: ReturnType<typeof setTimeout> | null = null
    const idleCallback = (deadline: IdleDeadline) => {
      const busy = deadline.timeRemaining() === 0
      if (busy) {
        globalThis.requestIdleCallback(idleCallback)
        return
      }

      const registered = state.store[id]

      if (!registered) {
        return
      }

      send({
        type: 'update',
        id,
      })
    }
    const emit = () => {
      globalThis.requestIdleCallback(idleCallback)
    }

    form.subscribe(() => {
      if (!state.hasOpenDevtools) {
        return
      }
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(emit, 300)
    })
  },

  /**
   * This method is called by the following file:
   * packages/core/src/models/Form.ts
   * It is called in the onUnmount() hook.
   *
   * Inject the form instance into the hooks of the development tool.
   *
   * @param id - The unique identifier of the form.
   */
  unmount(id: Form['id']) {
    delete state.store[id]
    send({
      type: 'uninstall',
      id,
    })
  },
}

export const backendMain = () => {
  // Register to the global variable, called by both formily/core
  globalScope.__FORMILY_DEV_TOOLS_HOOK__ = formilyCoreHook
  globalScope.__UFORM_DEV_TOOLS_HOOK__ = formilyCoreHook

  // Register to the global variable, called by devtools
  globalScope[FORMILY_DEV_TOOLS_INSPECT_HOOK] = devtoolsInspectHook

  send({
    type: 'init',
  })
}
