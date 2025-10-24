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

/**
 * Dummy custom element used for collecting
 * development time usage statistics.
 *
 * @private
 */
class Lumo extends HTMLElement {
  static get version() {
    return '23.6.2';
  }
}

customElements.define('vaadin-lumo-styles', Lumo);

export { Lumo };
