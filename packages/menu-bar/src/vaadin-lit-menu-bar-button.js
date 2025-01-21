/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-lit-button.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          flex-shrink: 0;
        }

        :host([slot='overflow']) {
          margin-inline-end: 0;
        }
      `,
    ];
  }

  /**
   * Override method inherited from `ButtonMixin` to set a flag based on whether the key
   * is Enter and Space. Unlike mouse click, these keys should also focus the first item.
   * This flag is used in menu bar to identify the action that triggered the click.
   *
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    this.__triggeredWithActiveKeys = this._activeKeys.includes(event.key);
    super._onKeyDown(event);
    this.__triggeredWithActiveKeys = null;
  }

  /**
   * Override method inherited from `ButtonMixin` to allow keyboard navigation with
   * arrow keys in the menu bar when the button is focusable in the disabled state.
   *
   * @override
   */
  __shouldSuppressInteractionEvent(event) {
    if (event.type === 'keydown' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return false;
    }

    return super.__shouldSuppressInteractionEvent(event);
  }
}

defineCustomElement(MenuBarButton);
