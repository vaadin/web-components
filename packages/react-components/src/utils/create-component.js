import { createComponent as _createComponent } from '@lit/react';
import React from 'react';

export function createComponent(options) {
  const { elementClass, importFunc } = options;

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

  const originalRenderFunc = Component.render;

  Component.render = (props, ...rest) => {
    React.useEffect(() => {
      importFunc();
    }, []);

    return originalRenderFunc(props, ...rest);
  };

  return Component;
}
