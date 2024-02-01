/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar-button',
  css`
    :host {
      flex-shrink: 0;
    }

    :host([slot='overflow']) {
      margin-inline-end: 0;
    }

    [part='label'] ::slotted(vaadin-menu-bar-item) {
      position: relative;
      z-index: 1;
    }
  `,
  { moduleId: 'vaadin-menu-bar-button-styles' },
);

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends Button
 * @private
 */
class MenuBarButton extends Button {
  static get is() {
    return 'vaadin-menu-bar-button';
  }

  /**
   * Override method inherited from `HTMLElement`. Dispatches a `mousedown` event before the click. This allows to communicate the nature of the click to the menu bar. Clicks triggered by Space or an Enter key presses should focus the first item in the submenu. These cases are handled in `VaadinMenuBarMixin`.
   *
   * @override
   */
  click() {
    if (!this.__triggeredWithActiveKeys) {
      window.dispatchEvent(new CustomEvent('mousedown'));
    }
    this.__triggeredWithActiveKeys = null;
    super.click();
  }

  /**
   * Override method inherited from `ButtonMixin`. Sets a flag based on whether the key is an active key.
   *
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    this.__triggeredWithActiveKeys = this._activeKeys.includes(event.key);
    super._onKeyDown(event);
  }
}

defineCustomElement(MenuBarButton);
