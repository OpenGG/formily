import { valueType } from '@/utils/valueType'
import { serialize } from './serialize'
import type { Form } from '@formily/core'
const send = ({
  type,
  id,
  form,
}: {
  type: string
  id?: string | number
  form?: Form
}) => {
  const graph = serialize(form?.getFormGraph())
  window.postMessage(
    {
      source: '@formily-devtools-inject-script',
      type,
      id,
      graph:
        form &&
        JSON.stringify(graph, (key, value) => {
          if (typeof value === 'symbol') {
            return value.toString()
          }
          return value
        }),
    },
    '*'
  )
}

const globalScope = globalThis as any

const HOOK = {
  hasFormilyInstance: false,
  hasOpenDevtools: false,
  store: valueType<Record<string, Form>>({}),
  openDevtools() {
    this.hasOpenDevtools = true
  },
  closeDevtools() {
    this.hasOpenDevtools = false
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
      globalScope.$vm = this.store[formId].fields[fieldId]
    } else {
      // If the fieldId does not exist, set $vm to the instance of the entire form
      globalScope.$vm = this.store[formId]
    }
  },
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
    this.hasFormilyInstance = true
    this.store[id] = form
    send({
      type: 'install',
      id,
      form,
    })
    let timer: ReturnType<typeof setTimeout> | null = null
    const idleCallback = (deadline: IdleDeadline) => {
      const busy = deadline.timeRemaining() === 0
      if (busy) {
        globalThis.requestIdleCallback(idleCallback)
        return
      }

      const registered = this.store[id]

      if (!registered) {
        return
      }

      send({
        type: 'update',
        id,
        form,
      })
    }
    const emit = () => {
      globalThis.requestIdleCallback(idleCallback)
    }

    form.subscribe(() => {
      if (!this.hasOpenDevtools) {
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
   * devtools/index.ts
   * Get the latest value during initialization.
   */
  update() {
    const keys = Object.keys(this.store || {})
    keys.forEach((id) => {
      send({
        type: 'update',
        id,
        form: this.store[id],
      })
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
    delete this.store[id]
    send({
      type: 'uninstall',
      id,
    })
  },
}

export const backendMain = () => {
  // Register to the global variable, called by both formily/core and devtools
  globalScope.__FORMILY_DEV_TOOLS_HOOK__ = HOOK
  globalScope.__UFORM_DEV_TOOLS_HOOK__ = HOOK

  send({
    type: 'init',
  })
}
