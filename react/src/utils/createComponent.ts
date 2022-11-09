import { createComponent as _createComponent, EventName, ReactWebComponent } from '@lit-labs/react';

// TODO: Remove when types from @lit-labs/react are exported
export type EventNames = Record<string, EventName | string>;

type Constructor<T> = { new (): T };

export function createComponent<I extends HTMLElement, E extends EventNames = {}>(
  React: typeof window.React,
  tagName: string,
  elementClass: Constructor<I>,
  events?: E,
  displayName?: string,
): ReactWebComponent<I, E>;
export function createComponent(...args: any[]): any {
  const elementClass = args[2];
  if ('_properties' in elementClass) {
    // TODO: improve or remove the Polymer workaround
    // 'createComponent' relies on key presence on the custom element class,
    // but Polymer defines properties on the prototype when the first element
    // is created. Workaround: pass a mock object with properties in
    // the prototype.
    args[2] = {
      name: elementClass.name,
      prototype: elementClass._properties,
    };
  }

  return (_createComponent as Function)(...args);
}
