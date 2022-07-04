/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Lumo extends HTMLElement {
  static get version() {
    return '23.1.3';
  }
}

customElements.define('vaadin-lumo-styles', Lumo);

export { Lumo };
