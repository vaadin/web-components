/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 */
declare class MenuBarButton extends Button {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-menu-bar-button': MenuBarButton;
  }
}

export { MenuBarButton };
