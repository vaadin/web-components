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
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar-button',
  css`
    [part='label'] ::slotted(vaadin-context-menu-item) {
      position: relative;
      z-index: 1;
    }
  `,
  { moduleId: 'vaadin-menu-bar-button-styles' },
);

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends Button
 * @private
 */
class MenuBarButton extends Button {
  static get is() {
    return 'vaadin-menu-bar-button';
  }
}

customElements.define(MenuBarButton.is, MenuBarButton);
