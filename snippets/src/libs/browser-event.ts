
/**
 * Type-safe browser event dispatching and listening for CustomEvent
 */
export class BrowserEvent<EventName extends string, Detail extends object> {
  constructor(public eventName: EventName) {
    this.validateRuntime(window);
  }

  private validateRuntime(windowObject: Window): asserts windowObject is Window {
    if (windowObject === undefined) {
      throw new Error('This function can only be run in the browser');
    }
  }

  dispatch(payload: Detail) {
    this.validateRuntime(window);
    window.dispatchEvent(new CustomEvent(this.eventName, { detail: payload }));
  }

  listen(callback?: (event: CustomEvent<Detail>) => void) {
    this.validateRuntime(window);
    window.addEventListener(this.eventName, (event) => {
      if (callback) callback(event as CustomEvent<Detail>);
    });
  }

  removeListener(callback?: (event: CustomEvent<Detail>) => void) {
    this.validateRuntime(window);
    window.removeEventListener(this.eventName, (event) => {
      if (callback)
        callback(event as CustomEvent<Detail>);
    });
  }

  get name() {
    return this.eventName;
  }
}


/**
 * Create a browser event with a specific event name
 * 
 * ### Usage
 * 
 * ```ts
 * const controlSearchModal = createBrowserEvent('ControlSearchModal').configDetail<{ visible: boolean }>();
 * ```
 */
export function createBrowserEvent<
  EventName extends string,
>(eventName: EventName) {
  return {
    configDetail: <Detail extends object>() => {
      return new BrowserEvent<EventName, Detail>(eventName);
    }
  }
}
