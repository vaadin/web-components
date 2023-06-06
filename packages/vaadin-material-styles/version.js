/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Dummy custom element used for collecting
 * development time usage statistics.
 *
 * @private
 */
class Material extends HTMLElement {
  static get version() {
    return '24.1.0';
  }
}

customElements.define('vaadin-material-styles', Material);

export { Material };
