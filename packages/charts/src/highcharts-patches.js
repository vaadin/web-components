/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

// TODO: Remove when upgrading Highcharts, see vaadin/web-components#12213

const { Chart, Point } = Highcharts;

const RESERVED_KEYS = ['__proto__', 'constructor'];

const isReservedKey = (key) => RESERVED_KEYS.includes(key);

const UNSUPPORTED_SCHEMES = ['javascript', 'vbscript', 'data'];

const isUnsupportedLink = (value) => {
  if (typeof value !== 'string') {
    return true;
  }
  try {
    // The URL parser normalizes case and whitespace the same way as navigation does
    return UNSUPPORTED_SCHEMES.includes(new URL(value, document.baseURI).protocol.slice(0, -1));
  } catch (_) {
    return true;
  }
};

/* eslint-disable no-invalid-this, prefer-arrow-callback */

// Skip reserved option names in point objects
Highcharts.wrap(Point.prototype, 'optionsToObject', function (proceed, options) {
  if (
    options &&
    typeof options === 'object' &&
    !Array.isArray(options) &&
    RESERVED_KEYS.some((key) => Object.prototype.hasOwnProperty.call(options, key))
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

// Ignore credits links that use an unsupported URL scheme
Highcharts.wrap(Chart.prototype, 'addCredits', function (proceed, credits) {
  const options = Highcharts.merge(true, this.options.credits, credits);
  if (options?.href && isUnsupportedLink(options.href)) {
    Highcharts.error(33, false, this, { 'Invalid attribute in config': 'credits.href' });
    delete options.href;
  }
  return proceed.call(this, options);
});

/* eslint-enable no-invalid-this, prefer-arrow-callback */
