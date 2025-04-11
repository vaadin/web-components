/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @param {HTMLElement} component
 * @param {CSSStyleSheet} styleSheet
 */
export function injectStyleSheet(component, styleSheet) {
  const adoptedStyleSheets = component.shadowRoot.adoptedStyleSheets.filter(
    (s) => s !== component.__cssInjectorStyleSheet,
  );

  component.shadowRoot.adoptedStyleSheets = [styleSheet, ...adoptedStyleSheets];
  component.__cssInjectorStyleSheet = styleSheet;
}

/**
 * @param {HTMLElement} component
 * @return {CSSStyleSheet}
 */
export function cleanupStyleSheet(component) {
  const adoptedStyleSheets = component.shadowRoot.adoptedStyleSheets.filter(
    (s) => s !== component.__cssInjectorStyleSheet,
  );

  component.shadowRoot.adoptedStyleSheets = adoptedStyleSheets;
  component.__cssInjectorStyleSheet = undefined;
}

/**
 * @param {HTMLElement} component
 * @return {CSSStyleSheet}
 */
export function getInjectedStyleSheet(component) {
  return component.__cssInjectorStyleSheet;
}
