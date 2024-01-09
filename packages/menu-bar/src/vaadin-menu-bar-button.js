/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { menuBarButton } from './vaadin-menu-bar-button-styles.js';

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
    return [...super.styles, menuBarButton];
  }
}

defineCustomElement(MenuBarButton);
