/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Lumo extends HTMLElement {
  static get version() {
    return '20.0.0';
  }
}

customElements.define('vaadin-lumo-styles', Lumo);

export { Lumo };
