/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};

function dashToCamelCase(dash) {
  return dash.replace(/-[a-z]/gu, (m) => m[1].toUpperCase());
}

export function defineCustomElement(CustomElement, version = '24.6.0-alpha2') {
  Object.defineProperty(CustomElement, 'version', {
    get() {
      return version;
    },
  });

  if (CustomElement.experimental) {
    const featureFlagKey = `${dashToCamelCase(CustomElement.is)}Component`;
    if (!window.Vaadin.featureFlags[featureFlagKey]) {
      // Add setter to define experimental component when it's set to true
      Object.defineProperty(window.Vaadin.featureFlags, featureFlagKey, {
        get() {
          return !!customElements.get(CustomElement.is);
        },
        set(value) {
          if (!!value && !customElements.get(CustomElement.is)) {
            customElements.define(CustomElement.is, CustomElement);
          }
        },
      });

      return;
    }
  }

  const defined = customElements.get(CustomElement.is);
  if (!defined) {
    customElements.define(CustomElement.is, CustomElement);
  } else {
    const definedVersion = defined.version;
    if (definedVersion && CustomElement.version && definedVersion === CustomElement.version) {
      // Just loading the same thing again
      console.warn(`The component ${CustomElement.is} has been loaded twice`);
    } else {
      console.error(
        `Tried to define ${CustomElement.is} version ${CustomElement.version} when version ${defined.version} is already in use. Something will probably break.`,
      );
    }
  }
}
