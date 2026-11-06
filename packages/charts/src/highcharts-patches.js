/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

// TODO: Remove when upgrading Highcharts, see vaadin/web-components#12213

const { AST, Point, SVGElement } = Highcharts;

const RESERVED_KEYS = ['__proto__', 'constructor'];

const isReservedKey = (key) => RESERVED_KEYS.includes(key);

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

// Ignore event attribute names, e.g. from style options that are applied as attributes.
// Not using `Highcharts.wrap`, as this setter runs for most attributes on every render.
const defaultSetter = SVGElement.prototype._defaultSetter;
SVGElement.prototype._defaultSetter = function (value, key, element) {
  if (!/^on/iu.test(key)) {
    defaultSetter.call(this, value, key, element);
  }
};

// Highcharts parses text markup in an inert document when `DOMParser` fails, e.g. while Chromium
// is printing and the Trusted Types policy callback can no longer run. Under Trusted Types
// enforcement that last step throws as well, so render no markup instead of failing the redraw.
Highcharts.wrap(AST.prototype, 'parseMarkup', function (proceed, markup) {
  try {
    return proceed.call(this, markup);
  } catch (_) {
    return [];
  }
});

/* eslint-enable @typescript-eslint/no-invalid-this, prefer-arrow-callback */
