/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
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
    return '23.3.5';
  }
}

customElements.define('vaadin-material-styles', Material);

export { Material };
