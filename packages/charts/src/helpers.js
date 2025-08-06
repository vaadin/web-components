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

export function prepareExport(chart) {
  // Guard against another print 'before print' event coming before
  // the 'after print' event.
  if (!chart.tempBodyStyle) {
    let effectiveCss = '';

    // LitElement uses `adoptedStyleSheets` for adding styles
    if (chart.shadowRoot.adoptedStyleSheets) {
      chart.shadowRoot.adoptedStyleSheets.forEach((sheet) => {
        effectiveCss += `${[...sheet.cssRules].map((rule) => rule.cssText).join('\n')}\n`;
      });
    }

    // Strip off host selectors that target individual instances
    effectiveCss = effectiveCss.replace(/:host\(.+?\)/gu, (match) => {
      const selector = match.substr(6, match.length - 7);
      return chart.matches(selector) ? '' : match;
    });

    // Zoom out a bit to avoid clipping the chart's edge on paper
    effectiveCss =
      `${effectiveCss}body {` +
      `    -moz-transform: scale(0.9, 0.9);` + // Mozilla
      `    zoom: 0.9;` + // Others
      `    zoom: 90%;` + // Webkit
      `}`;

    chart.tempBodyStyle = document.createElement('style');
    chart.tempBodyStyle.textContent = effectiveCss;
    document.body.appendChild(chart.tempBodyStyle);
    if (chart.options.chart.styledMode) {
      document.body.setAttribute('styled-mode', '');
    }
  }
}

export function cleanupExport(chart) {
  if (chart.tempBodyStyle) {
    document.body.removeChild(chart.tempBodyStyle);
    delete chart.tempBodyStyle;
    if (chart.options.chart.styledMode) {
      document.body.removeAttribute('styled-mode');
    }
  }
}
