/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('lit').LitElement & import('./polylit-mixin.js').PolylitMixinClass} VaadinElement
 */

/** @type {WeakMap<DocumentOrShadowRoot, Set<string>>} */
const stylesMap = new WeakMap();

/**
 * Get all the styles inserted into root.
 * @param {DocumentOrShadowRoot} root
 * @return {Set<string>}
 */
function getRootStyles(root) {
  let rootStyles = stylesMap.get(root);
  if (!rootStyles) {
    rootStyles = new Set();
    stylesMap.set(root, rootStyles);
  }

  return rootStyles;
}

/**
 * Insert styles into the root.
 * @param {string} styles
 * @param {DocumentOrShadowRoot} root
 */
function insertStyles(styles, root) {
  const style = document.createElement('style');
  style.textContent = styles;

  if (root === document) {
    document.head.appendChild(style);
  } else {
    /** @type {ShadowRoot} */ (root).insertBefore(style, /** @type {ShadowRoot} */ (root).firstChild);
  }
}

/**
 * Mixin to insert styles into the outer scope to handle slotted components.
 * This is useful e.g. to hide native `<input type="number">` controls.
 *
 * @polymerMixin
 * @template {new (...args: any[]) => VaadinElement} T
 * @param {T} superclass
 */
const SlotStylesMixinImplementation = (superclass) =>
  class SlotStylesMixinClass extends superclass {
    /**
     * List of styles to insert into root.
     *
     * @returns {string[]}
     * @protected
     */
    get slotStyles() {
      return [];
    }

    connectedCallback() {
      super.connectedCallback();

      this.__applySlotStyles();
    }

    /** @private */
    __applySlotStyles() {
      const root = /** @type {DocumentOrShadowRoot} */ (/** @type {unknown} */ (this.getRootNode()));
      const rootStyles = getRootStyles(root);

      this.slotStyles.forEach((styles) => {
        if (!rootStyles.has(styles)) {
          insertStyles(styles, root);
          rootStyles.add(styles);
        }
      });
    }
  };

export const SlotStylesMixin = dedupeMixin(SlotStylesMixinImplementation);
