/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @extends Button
 * @protected
 */
declare class MessageInputButton extends Button {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-button': MessageInputButton;
  }
}
