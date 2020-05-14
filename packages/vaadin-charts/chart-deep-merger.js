/**
 * @namespace Vaadin
 */
window.Vaadin = window.Vaadin || {};
/**
 * @namespace Vaadin.Charts
 */
Vaadin.Charts = Vaadin.Charts || {};

/** @private */
Vaadin.Charts.deepMerge = function deepMerge(target, source) {
  const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));

  if (isObject(source) && isObject(target)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {[key]: {}});
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    }
  }

  return target;
};
