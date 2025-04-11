/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Injects the given stylesheet into the shadow root of the component
 * through the adoptedStyleSheets API. The stylesheet is always added
 * at the beginning of the adoptedStyleSheets array.
 *
 * @param {HTMLElement} component
 * @param {CSSStyleSheet} styleSheet
 */
export function injectStyleSheet(component, styleSheet) {
  // Remove the old stylesheet to avoid duplicates
  const adoptedStyleSheets = component.shadowRoot.adoptedStyleSheets.filter(
    (s) => s !== component.__cssInjectorStyleSheet,
  );

  // Add the new stylesheet at the beginning of the adoptedStyleSheets array
  component.shadowRoot.adoptedStyleSheets = [styleSheet, ...adoptedStyleSheets];
  component.__cssInjectorStyleSheet = styleSheet;
}

/**
 * Removes the stylesheet from the component's shadow root that was added
 * by the `injectStyleSheet` function.
 *
 * @param {HTMLElement} component
 */
export function cleanupStyleSheet(component) {
  const adoptedStyleSheets = component.shadowRoot.adoptedStyleSheets.filter(
    (s) => s !== component.__cssInjectorStyleSheet,
  );

  component.shadowRoot.adoptedStyleSheets = adoptedStyleSheets;
  component.__cssInjectorStyleSheet = undefined;
}

/**
 * Returns the stylesheet injected into the shadow root of the component
 * by the `injectStyleSheet` function, or undefined if no stylesheet was
 * injected.
 *
 * @param {HTMLElement} component
 * @return {CSSStyleSheet | undefined}
 */
export function getInjectedStyleSheet(component) {
  return component.__cssInjectorStyleSheet;
}
