/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { gatherMatchingStyleRules } from './css-injection-utils.js';

/**
 * Mixin for internal use only. Do not use it in custom components.
 *
 * @polymerMixin
 */
export const CssInjectionMixin = (superClass) =>
  class CssInjectionMixinClass extends superClass {
    /** @protected */
    async connectedCallback() {
      super.connectedCallback();

      const rules = await gatherMatchingStyleRules(this);

      if (rules.length > 0) {
        this.__injectedStyleSheet = new CSSStyleSheet();

        rules.forEach((ruleList) => {
          for (const rule of ruleList) {
            this.__injectedStyleSheet.insertRule(rule.cssText);
          }
        });

        this.shadowRoot.adoptedStyleSheets.push(this.__injectedStyleSheet);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.__injectedStyleSheet) {
        this.shadowRoot.adoptedStyleSheets.splice(
          this.shadowRoot.adoptedStyleSheets.indexOf(this.__injectedStyleSheet, 1),
        );
      }
    }
  };
