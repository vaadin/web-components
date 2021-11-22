/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Material extends HTMLElement {
  static get version() {
    return '23.0.0-alpha1';
  }
}

customElements.define('vaadin-material-styles', Material);

export { Material };
