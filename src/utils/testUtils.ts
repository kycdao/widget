/**
 * Represents the tracing options for the TracingProxy.
 */
export interface TracingOptions {
  /** Whether to trace get accesses. */
  traceGet?: boolean
  /** Whether to trace set accesses. */
  traceSet?: boolean
  /** Whether to trace function calls. */
  traceCalls?: boolean
  /** Whether to show stack traces of property access and function calls origin */
  showStackTraces?: boolean
}

/**
    TracingProxy is a custom ProxyHandler implementation that enables logging of property access,
    modification, and function calls on a target object. It can also provide stack traces where
    the property access or function call was originating from.

    Usefull for degug purposes.

    Note: Non-existing properties will be always logged.

    @template T - The object type that the TracingProxy will wrap.
    @param {T} target - The target object to be wrapped.
    @param {string} [prefix=""] - An optional namespace of the target object.
    @param {TracingOptions} [options={}] - The tracing options for this TracingProxy instance.
    @extends {ProxyHandler<T>}
*/
class TracingProxy<T extends object> implements ProxyHandler<T> {
  constructor(
    private readonly target: T,
    private readonly options: TracingOptions = {},
    private readonly namespace: string
  ) {}

  private trace() {
    return new Error("").stack?.split("\n")?.splice(3).join("\n")
  }

  get(obj: T, prop: string | symbol) {
    const value = Reflect.get(obj, prop)
    const exists = Object.prototype.hasOwnProperty.call(obj, prop)

    if (!exists) {
      if (prop !== "then") {
        console.error(
          `Accessing non-existent property: ${this.namespace}${prop.toString()}`
        )
        console.log(this.trace())
      }
    }

    if (typeof value === "object" && value !== null) {
      return createTracingProxy(value, this.options, prop.toString() + ".")
    } else if (typeof value === "function") {
      return createTracingProxy(value, this.options, prop.toString())
    } else {
      if (this.options.traceGet) {
        console.log(
          `Accessing property: ${this.namespace}${prop.toString()} = ${value}`
        )
        if (this.options.showStackTraces) {
          console.log(this.trace())
        }
      }
      return value
    }
  }

  set(
    target: T,
    p: string | symbol,
    newValue: unknown,
    receiver: unknown
  ): boolean {
    if (this.options.traceSet) {
      console.log(`Setting property: ${this.namespace}${p.toString()}`)
      if (this.options.showStackTraces) {
        console.log(this.trace())
      }
    }
    return Reflect.set(target, p, newValue, receiver)
  }

  apply(target: T, thisArg: unknown, argArray: unknown[]) {
    if (this.options.traceCalls) {
      console.log(`Calling function: ${this.namespace}(${argArray.join(", ")})`)
      if (this.options.showStackTraces) {
        console.log(this.trace())
      }
    }
    const ret = Reflect.apply(
      target as (this: unknown, ...args: unknown[]) => unknown,
      thisArg,
      argArray
    )
    if (this.options.traceCalls) {
      if (ret instanceof Promise) {
        ret.then((x) => {
          console.log(`Return value promise: ${JSON.stringify(x)}`)
        })
      } else {
        console.log(`Return value: ${JSON.stringify(ret)}`)
      }
    }
    return ret
  }
}

/**
    Creates a new TracingProxy instance for a given object.

    @template T - The object type that the TracingProxy will wrap.
    @param {T} target - The target object to be wrapped.
    @param {string} [name=""] - An optional name for the proxy, used in logging.
    @param {TracingOptions} [options={}] - The tracing options for this TracingProxy instance.
    @returns {T} - A proxy object wrapping the target object with TracingProxy behavior.
*/
export function createTracingProxy<T extends object>(
  target: T,
  options: TracingOptions = {},
  namespace = ""
): T {
  return new Proxy(target, new TracingProxy(target, options, namespace))
}
