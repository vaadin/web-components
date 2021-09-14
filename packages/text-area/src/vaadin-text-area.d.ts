/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/vaadin-element-mixin.js';
import { CharLengthMixin } from '@vaadin/field-base/src/char-length-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { TextAreaSlotMixin } from '@vaadin/field-base/src/text-area-slot-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `invalid` property changes.
 */
export type TextAreaInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type TextAreaValueChangedEvent = CustomEvent<{ value: string }>;

export interface TextAreaCustomEventMap {
  'invalid-changed': TextAreaInvalidChangedEvent;

  'value-changed': TextAreaValueChangedEvent;
}

export interface TextAreaEventMap extends HTMLElementEventMap, TextAreaCustomEventMap {}

/**
 * `<vaadin-text-area>` is a web component for multi-line text input.
 *
 * ```html
 * <vaadin-text-area label="Comment"></vaadin-text-area>
 * ```
 *
 * ### Prefixes and suffixes
 *
 * These are child elements of a `<vaadin-text-area>` that are displayed
 * inline with the input, before or after.
 * In order for an element to be considered as a prefix, it must have the slot
 * attribute set to `prefix` (and similarly for `suffix`).
 *
 * ```html
 * <vaadin-text-area label="Description">
 *   <div slot="prefix">Details:</div>
 *   <div slot="suffix">The end!</div>
 * </vaadin-text-area>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `label`         | The label element wrapper
 * `input-field`   | The element that wraps prefix, textarea and suffix
 * `error-message` | The error message element wrapper
 * `helper-text`   | The helper text element wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|----------
 * `disabled`          | Set when the element is disabled          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `focus-ring`        | Set when the element is keyboard focused  | :host
 * `readonly`          | Set when the element is readonly          | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class TextArea extends CharLengthMixin(
  InputFieldMixin(TextAreaSlotMixin(ThemableMixin(ElementMixin(HTMLElement))))
) {
  addEventListener<K extends keyof TextAreaEventMap>(
    type: K,
    listener: (this: TextArea, ev: TextAreaEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof TextAreaEventMap>(
    type: K,
    listener: (this: TextArea, ev: TextAreaEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-text-area': TextArea;
  }
}

export { TextArea };
