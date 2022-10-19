import { createComponent as createComponentOriginal, EventName } from '@lit-labs/react';

export function createComponent(...args: Parameters<typeof createComponentOriginal>) {
  const elementClass = args[2];
  if ('_properties' in elementClass) {
    // TODO: improve or remove the Polymer workaround
    // 'createComponent' relies on key presence on the custom element class,
    // but Polymer defines properties on the prototype when the first element
    // is created. Workaround: pass a mock object with properties in
    // the prototype.
    args[2] = {
      name: elementClass.name,
      prototype: (elementClass as any)._properties,
    } as typeof elementClass;
  }
  return createComponentOriginal(...args);
}
