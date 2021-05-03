import { TextFieldMixin } from './vaadin-text-field-mixin.js';

import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { TextFieldEventMap } from './interfaces';

/**
 * `<vaadin-text-area>` is a Web Component for text area control in forms.
 *
 * ```html
 * <vaadin-text-area label="Add description">
 * </vaadin-text-area>
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
 * <vaadin-text-area label="Add description">
 *   <div slot="prefix">Details:</div>
 *   <div slot="suffix">The end!</div>
 * </vaadin-text-area>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `label` | The label element
 * `input-field` | The element that wraps prefix, value and suffix
 * `value` | The text value element inside the `input-field` element
 * `error-message` | The error message element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `disabled` | Set to a disabled text field | :host
 * `has-value` | Set when the element has a value | :host
 * `has-label` | Set when the element has a label | :host
 * `has-helper` | Set when the element has helper text | :host
 * `has-error-message` | Set when the element has an error message | :host
 * `invalid` | Set when the element is invalid | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `readonly` | Set to a readonly text field | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class TextAreaElement extends TextFieldMixin(ControlStateMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  readonly _slottedTagName: string;

  _valueChanged(newVal: unknown | null, oldVal: unknown | null): void;

  addEventListener<K extends keyof TextFieldEventMap>(
    type: K,
    listener: (this: TextAreaElement, ev: TextFieldEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof TextFieldEventMap>(
    type: K,
    listener: (this: TextAreaElement, ev: TextFieldEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-text-area': TextAreaElement;
  }
}

export { TextAreaElement };
