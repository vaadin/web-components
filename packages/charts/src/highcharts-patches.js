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
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

// Remove when upgrading Highcharts (#12213).

const { AST, Chart, Point } = Highcharts;

const RESERVED_KEYS = ['__proto__', 'constructor'];

const isReservedKey = (key) => RESERVED_KEYS.includes(key);

const isAllowedReference = (value) =>
  typeof value === 'string' && AST.allowedReferences.some((ref) => value.indexOf(ref) === 0);

/* eslint-disable @typescript-eslint/no-invalid-this, prefer-arrow-callback */

// Skip reserved option names in point objects
Highcharts.wrap(Point.prototype, 'optionsToObject', function (proceed, options) {
  if (
    options &&
    typeof options === 'object' &&
    !Array.isArray(options) &&
    RESERVED_KEYS.some((key) => Object.hasOwn(options, key))
  ) {
    options = Object.fromEntries(Object.entries(options).filter(([key]) => !isReservedKey(key)));
  }
  return proceed.call(this, options);
});

// Skip reserved path segments in point keys
Highcharts.wrap(Point.prototype, 'setNestedProperty', function (proceed, object, value, key) {
  if (String(key).split('.').some(isReservedKey)) {
    return object;
  }
  return proceed.call(this, object, value, key);
});

// Ignore credits links that do not use a supported URL scheme
Highcharts.wrap(Chart.prototype, 'addCredits', function (proceed, credits) {
  const options = Highcharts.merge(true, this.options.credits, credits);
  if (options && options.href && !isAllowedReference(options.href)) {
    delete options.href;
  }
  return proceed.call(this, options);
});

/* eslint-enable @typescript-eslint/no-invalid-this, prefer-arrow-callback */
