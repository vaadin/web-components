/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
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
 * `<vaadin-text-area>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
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
