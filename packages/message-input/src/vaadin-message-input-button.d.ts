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
