/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

export function inflateFunctions(config) {
  if (Array.isArray(config)) {
    config.forEach(inflateFunctions);
    return;
  }
  if (
    // Check if param is a primitive/null/undefined value
    !(config instanceof Object) ||
    // Check if param is a plain object (not a HC object)
    config.constructor !== Object
  ) {
    return;
  }
  Object.entries(config).forEach(([attr, targetProperty]) => {
    if (attr.startsWith('_fn_') && (typeof targetProperty === 'string' || targetProperty instanceof String)) {
      try {
        // eslint-disable-next-line no-eval
        config[attr.substr(4)] = eval(`(${targetProperty})`);
      } catch (_) {
        // eslint-disable-next-line no-eval
        config[attr.substr(4)] = eval(`(function(){${targetProperty}})`);
      }
      delete config[attr];
    } else if (targetProperty instanceof Object) {
      inflateFunctions(targetProperty);
    }
  });
}

export function deepMerge(target, source) {
  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

  if (isObject(source) && isObject(target)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return target;
}
