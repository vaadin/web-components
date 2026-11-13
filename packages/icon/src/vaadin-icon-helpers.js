/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { svg } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';
import { isSafari } from '@vaadin/component-base/src/browser-utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const SUPPORTED_ELEMENTS = new Set([
  'svg',
  'g',
  'defs',
  'symbol',
  'use',
  'switch',
  'title',
  'desc',
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'text',
  'tspan',
  'textPath',
  'linearGradient',
  'radialGradient',
  'stop',
  'clipPath',
  'mask',
  'pattern',
  'marker',
  'filter',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'animate',
  'animateTransform',
]);

const ANIMATED_ATTRIBUTES = new Set([
  'd',
  'fill',
  'opacity',
  'r',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'transform',
]);

const CSS_REFERENCE = /(?:url|src)\s*\((?!\s*['"]?#)|image-set|cross-fade|\bimage\s*\(|element\s*\(/iu;

function isSupportedElement(el) {
  if (el.namespaceURI !== SVG_NS || !SUPPORTED_ELEMENTS.has(el.localName)) {
    return false;
  }
  return !el.localName.startsWith('animate') || ANIMATED_ATTRIBUTES.has(el.getAttribute('attributeName'));
}

function isSupportedAttribute({ name, value }) {
  // Keep presentation attributes and xlink:href
  if (name.startsWith('on') || (name.includes(':') && name !== 'xlink:href')) {
    return false;
  }
  // Local references only
  if (name === 'href' || name === 'xlink:href') {
    return value.startsWith('#');
  }
  // Keep url(#id) references only
  return !value.includes('\\') && !CSS_REFERENCE.test(value);
}

function prepareSvg(svgElement) {
  svgElement.querySelectorAll('*').forEach((el) => {
    if (!isSupportedElement(el)) {
      el.remove();
      return;
    }
    [...el.attributes].forEach((attr) => {
      if (!isSupportedAttribute(attr)) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

/**
 * Checks if the current browser supports CSS Container Query units for pseudo elements.
 * i.e. if the fix for https://bugs.webkit.org/show_bug.cgi?id=253939 is available.
 */
export function supportsCQUnitsForPseudoElements() {
  const testStyle = document.createElement('style');
  testStyle.textContent = `
    .vaadin-icon-test-element {
      container-type: size;
      height: 2px;
      visibility: hidden;
      position: fixed;
    }

    .vaadin-icon-test-element::before {
      content: '';
      display: block;
      height: 100cqh;
    `;
  const testElement = document.createElement('div');
  testElement.classList.add('vaadin-icon-test-element');

  const shadowParent = document.createElement('div');
  shadowParent.attachShadow({ mode: 'open' });
  shadowParent.shadowRoot.innerHTML = '<slot></slot>';
  shadowParent.append(testElement.cloneNode());

  document.body.append(testStyle, testElement, shadowParent);

  const needsFallback = [...document.querySelectorAll('.vaadin-icon-test-element')].find(
    (el) => getComputedStyle(el, '::before').height !== '2px',
  );

  testStyle.remove();
  testElement.remove();
  shadowParent.remove();
  return !needsFallback;
}

/**
 * Checks if the current browser needs a fallback for sizing font icons instead of relying on CSS Container Queries.
 */
export function needsFontIconSizingFallback() {
  if (!CSS.supports('container-type: inline-size')) {
    // The browser does not support CSS Container Queries at all.
    return true;
  }
  if (!isSafari) {
    // Browsers other than Safari support CSS Container Queries as expected.
    return false;
  }
  // Check if the browser does not support CSS Container Query units for pseudo elements.
  return !supportsCQUnitsForPseudoElements();
}

/**
 * Parse the first `<svg>` element in the source string. Returns its static
 * content as SVG literal, and the element without children for its attributes.
 * Returns `null` if there is no `<svg>`.
 *
 * @param {string} source
 */
export function parseSvg(source) {
  const template = document.createElement('template');
  template.innerHTML = source;
  const svgElement = template.content.querySelector('svg');
  if (!svgElement) {
    return null;
  }
  prepareSvg(svgElement);
  template.content.replaceChildren(...svgElement.childNodes);
  return { svg: svg`${templateContent(template)}`, svgElement };
}
