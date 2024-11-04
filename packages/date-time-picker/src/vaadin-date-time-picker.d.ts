/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DateTimePickerMixin } from './vaadin-date-time-picker-mixin.js';

export { DateTimePickerI18n } from './vaadin-date-time-picker-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type DateTimePickerChangeEvent = Event & {
  target: DateTimePicker;
};

/**
 * Fired when the `invalid` property changes.
 */
export type DateTimePickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type DateTimePickerValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type DateTimePickerValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface DateTimePickerCustomEventMap {
  'invalid-changed': DateTimePickerInvalidChangedEvent;

  'value-changed': DateTimePickerValueChangedEvent;

  validated: DateTimePickerValidatedEvent;
}

export interface DateTimePickerEventMap extends DateTimePickerCustomEventMap, HTMLElementEventMap {
  change: DateTimePickerChangeEvent;
}

/**
 * `<vaadin-date-time-picker>` is a Web Component providing a date time selection field.
 *
 * ```html
 * <vaadin-date-time-picker value="2019-09-16T15:00"></vaadin-date-time-picker>
 * ```
 *
 * ```js
 * dateTimePicker.value = '2019-09-16T15:00';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
 * `focused`           | Set when the element is focused           | :host
 * `focus-ring`        | Set when the element is keyboard focused  | :host
 * `readonly`          | Set when the element is readonly          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * ### Internal components
 *
 * The following components are created by `<vaadin-date-time-picker>` and placed in light DOM:
 *
 * - [`<vaadin-date-picker>`](#/elements/vaadin-date-picker).
 * - [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
 *
 * Note: the `theme` attribute value set on `<vaadin-date-time-picker>` is
 * propagated to these components.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class DateTimePicker extends DateTimePickerMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof DateTimePickerEventMap>(
    type: K,
    listener: (this: DateTimePicker, ev: DateTimePickerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DateTimePickerEventMap>(
    type: K,
    listener: (this: DateTimePicker, ev: DateTimePickerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-time-picker': DateTimePicker;
  }
}

export { DateTimePicker };
