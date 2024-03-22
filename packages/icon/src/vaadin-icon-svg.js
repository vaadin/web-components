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
import { nothing, render, svg } from 'lit';
import { isTemplateResult, TemplateResultType } from 'lit/directive-helpers.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

/**
 * Clone given node and return its content as SVG literal.
 *
 * @param {Element} source
 */
export function cloneSvgNode(source) {
  let result = nothing;
  if (source) {
    const content = source.cloneNode(true);
    content.removeAttribute('id');
    result = svg`${unsafeSVG(content.outerHTML)}`;
  }

  return result;
}

/**
 * Test if the given argument is a valid SVG literal.
 *
 * @param {unknown} source
 */
export function isValidSvg(source) {
  return isTemplateResult(source, TemplateResultType.SVG) || source === nothing;
}

/**
 * Create a valid SVG literal based on the argument.
 *
 * @param {unknown} svg
 */
export function ensureSvgLiteral(source) {
  let result = source == null || source === '' ? nothing : source;

  if (!isValidSvg(result)) {
    console.error('[vaadin-icon] Invalid svg passed, please use Lit svg literal.');
    result = nothing;
  }

  return result;
}

/**
 * Render a given SVG literal to the container.
 *
 * @param {unknown} source
 * @param {SVGElement} container
 */
export function renderSvg(source, container) {
  const result = ensureSvgLiteral(source);
  render(result, container);
}

/**
 * Create an SVG literal from source string.
 *
 * @param {string} source
 */
export function unsafeSvgLiteral(source) {
  return svg`${unsafeSVG(source)}`;
}
