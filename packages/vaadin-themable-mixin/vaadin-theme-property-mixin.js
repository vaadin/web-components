/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @polymerMixin
 */
export const ThemePropertyMixin = (superClass) =>
  class VaadinThemePropertyMixin extends superClass {
    static get properties() {
      return {
        /**
         * Helper property with theme attribute value facilitating propagation
         * in shadow DOM.
         *
         * Enables the component implementation to propagate the `theme`
         * attribute value to the sub-components in Shadow DOM by binding
         * the sub-component’s "theme" attribute to the `theme` property of
         * the host.
         *
         * **NOTE:** Extending the mixin only provides the property for binding,
         * and does not make the propagation alone.
         *
         * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/ds/customization/styling-components/#sub-components).
         * page for more information.
         *
         * @protected
         */
        theme: {
          type: String,
          readOnly: true
        }
      };
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (name === 'theme') {
        this._setTheme(newValue);
      }
    }
  };
