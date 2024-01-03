import { createComponent as _createComponent } from '@lit/react';
import { registerComponent } from './use-custom-elements.js';

export function createComponent(options) {
  const { elementClass } = options;

  const Component = _createComponent(
    '_properties' in elementClass
      ? {
          ...options,
          elementClass: {
            name: elementClass.name,
            prototype: { ...elementClass._properties, hidden: Boolean },
          },
        }
      : options,
  );

  registerComponent(Component, elementClass);

  return Component;
}
