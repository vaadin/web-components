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
