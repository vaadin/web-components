/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
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
        _theme: {
          type: String,
          readOnly: true
        }
      };
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'theme'];
    }

    /**
     * A helper property with the `theme` attribute value facilitating propagation in shadow DOM.
     *
     * @deprecated The `theme` property is not supposed for public use and will be dropped in Vaadin 24.
     * Please, use the `theme` attribute instead.
     */
    get theme() {
      return this.getAttribute('theme');
    }

    set theme(newValue) {
      if (!newValue) {
        this.removeAttribute('theme');
        return;
      }

      if (this.getAttribute('theme') !== newValue) {
        this.setAttribute('theme', newValue);
      }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (name === 'theme') {
        this._set_theme(newValue);
      }
    }
  };
