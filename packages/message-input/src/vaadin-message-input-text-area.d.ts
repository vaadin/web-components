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
import { TextArea } from '@vaadin/text-area/src/vaadin-text-area.js';

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @protected
 */
declare class MessageInputTextArea extends TextArea {
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-text-area': MessageInputTextArea;
  }
}
