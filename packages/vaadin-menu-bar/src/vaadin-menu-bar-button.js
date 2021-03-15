/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonElement } from '@vaadin/vaadin-button/src/vaadin-button.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-menu-bar-button',
  css`
    [part='label'] ::slotted(vaadin-context-menu-item) {
      position: relative;
      z-index: 1;
    }
  `,
  { moduleId: 'vaadin-menu-bar-button-styles' }
);

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends ButtonElement
 * @private
 */
class MenuBarButtonElement extends ButtonElement {
  static get is() {
    return 'vaadin-menu-bar-button';
  }
}

customElements.define(MenuBarButtonElement.is, MenuBarButtonElement);
