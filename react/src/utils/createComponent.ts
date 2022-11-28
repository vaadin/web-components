import { createComponent as _createComponent, EventName } from '@lit-labs/react';

// TODO: Remove when types from @lit-labs/react are exported
export type EventNames = Record<string, EventName | string>;
type Constructor<T> = { new (): T; name: string; };
type PolymerConstructor<T> = Constructor<T> & { _properties: Record<string, unknown> };
type Options<I extends HTMLElement, E extends EventNames = {}> = Readonly<{
  displayName?: string;
  elementClass: Constructor<I> | PolymerConstructor<I>;
  events?: E;
  react: typeof window.React;
  tagName: string;
}>;

export function createComponent<I extends HTMLElement, E extends EventNames = {}>(options: Options<I, E>) {
  const { elementClass } = options;

  return _createComponent('_properties' in elementClass ? {
    ...options,
    // TODO: improve or remove the Polymer workaround
    // 'createComponent' relies on key presence on the custom element class,
    // but Polymer defines properties on the prototype when the first element
    // is created. Workaround: pass a mock object with properties in
    // the prototype.
    elementClass: {
      // @ts-expect-error: it is a specific workaround for Polymer classes.
      name: elementClass.name,
      prototype: elementClass._properties,
    }
  } : options);
}
