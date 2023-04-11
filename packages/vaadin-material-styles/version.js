/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
class Material extends HTMLElement {
  static get version() {
    return '22.1.0-alpha1';
  }
}

customElements.define('vaadin-material-styles', Material);

export { Material };
