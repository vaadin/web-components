const registry = new Map();

export function registerComponent(component, elementClass) {
  registry.set(component, elementClass);
}

/**
 * @param {object} components set of components to register
 */
export function useCustomElements(components) {
  if (Array.isArray(components)) {
    components.forEach((component) => {
      registry.get(component).register();
    });
  }
}
