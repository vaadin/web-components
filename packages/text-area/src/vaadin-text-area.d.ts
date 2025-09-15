/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TextAreaMixin } from './vaadin-text-area-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type TextAreaChangeEvent = Event & {
  target: TextArea;
};

/**
 * Fired when the `invalid` property changes.
 */
export type TextAreaInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type TextAreaValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type TextAreaValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface TextAreaCustomEventMap {
  'invalid-changed': TextAreaInvalidChangedEvent;

  'value-changed': TextAreaValueChangedEvent;

  validated: TextAreaValidatedEvent;
}

export interface TextAreaEventMap extends HTMLElementEventMap, TextAreaCustomEventMap {
  change: TextAreaChangeEvent;
}

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
 * The following custom properties are available for styling:
 *
 * Custom property                | Description                | Default
 * -------------------------------|----------------------------|---------
 * `--vaadin-field-default-width` | Default width of the field | `12em`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and suffix
 * `field-button`       | Set on the clear button
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `has-value`          | Set when the element has a value
 * `has-label`          | Set when the element has a label
 * `has-helper`         | Set when the element has helper text or slot
 * `has-error-message`  | Set when the element has an error message
 * `has-tooltip`        | Set when the element has a slotted tooltip
 * `invalid`            | Set when the element is invalid
 * `input-prevented`    | Temporarily set when invalid input is prevented
 * `focused`            | Set when the element is focused
 * `focus-ring`         | Set when the element is keyboard focused
 * `readonly`           | Set when the element is readonly
 *
 * Note, the `input-prevented` state attribute is only supported when `allowedCharPattern` is set.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class TextArea extends TextAreaMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof TextAreaEventMap>(
    type: K,
    listener: (this: TextArea, ev: TextAreaEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof TextAreaEventMap>(
    type: K,
    listener: (this: TextArea, ev: TextAreaEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-text-area': TextArea;
  }
}

export { TextArea };
