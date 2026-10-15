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
import { getHighchartsPolicy, releasePolicyFactory } from './highcharts-policy.js';

// TODO: Remove when upgrading Highcharts, see vaadin/web-components#12213

releasePolicyFactory();

const { AST, Chart, Point, SVGElement } = Highcharts;

const RESERVED_KEYS = ['__proto__', 'constructor'];

const isReservedKey = (key) => RESERVED_KEYS.includes(key);

const isAllowedReference = (value) =>
  typeof value === 'string' && AST.allowedReferences.some((ref) => value.startsWith(ref));

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

// Ignore credits links that use an unsupported URL scheme
Highcharts.wrap(Chart.prototype, 'addCredits', function (proceed, credits) {
  const options = Highcharts.merge(true, this.options.credits, credits);
  if (options?.href && isUnsupportedLink(options.href)) {
    Highcharts.error(33, false, this, { 'Invalid attribute in config': 'credits.href' });
    delete options.href;
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

// Remove unsupported xlink:href values from text markup
Highcharts.wrap(AST, 'filterUserAttributes', function (proceed, attributes) {
  if (attributes && Object.hasOwn(attributes, 'xlink:href') && !isAllowedReference(attributes['xlink:href'])) {
    delete attributes['xlink:href'];
  }
  return proceed.call(this, attributes);
});

/* eslint-enable @typescript-eslint/no-invalid-this, prefer-arrow-callback */

function parseDocument(markup) {
  const policy = getHighchartsPolicy();
  if (policy) {
    try {
      return new DOMParser().parseFromString(policy.createHTML(markup), 'text/html');
    } catch (_) {
      // Fall through
    }
  }

  try {
    return new DOMParser().parseFromString(markup, 'text/html');
  } catch (_) {
    // Fall through
  }

  // Parse in an inert document, so that nothing in the markup runs before it is filtered
  const doc = document.implementation.createHTMLDocument('');
  try {
    doc.body.innerHTML = policy ? policy.createHTML(markup) : markup;
  } catch (_) {
    // Leave the document empty
  }
  return doc;
}

function toNode(domNode, nodes) {
  const tagName = domNode.nodeName.toLowerCase();
  const node = { tagName };

  if (tagName === '#text') {
    node.textContent = domNode.textContent || '';
  }

  if (domNode.attributes) {
    const attributes = {};
    [...domNode.attributes].forEach((attribute) => {
      if (attribute.name === 'data-style') {
        node.style = AST.parseStyle(attribute.value);
      } else {
        attributes[attribute.name] = attribute.value;
      }
    });
    node.attributes = attributes;
  }

  if (domNode.childNodes.length) {
    const children = [];
    domNode.childNodes.forEach((child) => toNode(child, children));
    if (children.length) {
      node.children = children;
    }
  }

  nodes.push(node);
}

// Parse text markup in an inert document when the default parser fails
AST.prototype.parseMarkup = function (markup) {
  const doc = parseDocument(
    markup
      .trim()
      // The style attribute causes a warning when parsing with CSP enabled, so use an alias
      .replace(/ style=(["'])/gu, ' data-style=$1'),
  );

  const nodes = [];
  doc.body.childNodes.forEach((child) => toNode(child, nodes));
  return nodes;
};
