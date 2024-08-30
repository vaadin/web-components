/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerMixin } from './vaadin-date-picker-mixin.js';
export { DatePickerDate, DatePickerI18n } from './vaadin-date-picker-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type DatePickerChangeEvent = Event & {
  target: DatePicker;
};

/**
 * Fired when the user commits an unparsable value change and there is no change event.
 */
export type DatePickerUnparsableChangeEvent = CustomEvent;

/**
 * Fired when the `opened` property changes.
 */
export type DatePickerOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type DatePickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type DatePickerValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type DatePickerValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface DatePickerCustomEventMap {
  'opened-changed': DatePickerOpenedChangedEvent;

  'invalid-changed': DatePickerInvalidChangedEvent;

  'value-changed': DatePickerValueChangedEvent;

  'unparsable-change': DatePickerUnparsableChangeEvent;

  validated: DatePickerValidatedEvent;
}

export interface DatePickerEventMap extends HTMLElementEventMap, DatePickerCustomEventMap {
  change: DatePickerChangeEvent;
}

/**
 * `<vaadin-date-picker>` is an input field that allows to enter a date by typing or by selecting from a calendar overlay.
 *
 * ```html
 * <vaadin-date-picker label="Birthday"></vaadin-date-picker>
 * ```
 *
 * ```js
 * datePicker.value = '2016-03-02';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                | Description                | Default
 * -------------------------------|----------------------------|---------
 * `--vaadin-field-default-width` | Default width of the field | `12em`
 *
 * `<vaadin-date-picker>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name             | Description
 * ----------------------|--------------------
 * `toggle-button`       | Toggle button
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute  | Description                                      | Part name
 * -----------|--------------------------------------------------|-----------
 * `opened`   | Set when the date selector overlay is opened     | :host
 *
 * If you want to replace the default `<input>` and its container with a custom implementation to get full control
 * over the input field, consider using the [`<vaadin-date-picker-light>`](#/elements/vaadin-date-picker-light) element.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-date-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-date-picker-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-date-picker-overlay-content>`
 * - `<vaadin-date-picker-month-scroller>`
 * - `<vaadin-date-picker-year-scroller>`
 * - `<vaadin-date-picker-year>`
 * - `<vaadin-month-calendar>`
 * - [`<vaadin-input-container>`](#/elements/vaadin-input-container) - an internal element wrapping the input.
 *
 * In order to style the overlay content, use `<vaadin-date-picker-overlay-content>` shadow DOM parts:
 *
 * Part name             | Description
 * ----------------------|--------------------
 * `overlay-header`      | Fullscreen mode header
 * `label`               | Fullscreen mode value/label
 * `clear-button`        | Fullscreen mode clear button
 * `toggle-button`       | Fullscreen mode toggle button
 * `years-toggle-button` | Fullscreen mode years scroller toggle
 * `toolbar`             | Footer bar with slotted buttons
 *
 * The following state attributes are available on the `<vaadin-date-picker-overlay-content>` element:
 *
 * Attribute       | Description
 * ----------------|-------------------------------------------------
 * `desktop`       | Set when the overlay content is in desktop mode
 * `fullscreen`    | Set when the overlay content is in fullscreen mode
 * `years-visible` | Set when the year scroller is visible in fullscreen mode
 *
 * In order to style the month calendar, use `<vaadin-month-calendar>` shadow DOM parts:
 *
 * Part name             | Description
 * ----------------------|--------------------
 * `month-header`        | Month title
 * `weekdays`            | Weekday container
 * `weekday`             | Weekday element
 * `week-numbers`        | Week numbers container
 * `week-number`         | Week number element
 * `date`                | Date element
 * `disabled`            | Disabled date element
 * `focused`             | Focused date element
 * `selected`            | Selected date element
 * `today`               | Date element corresponding to the current day
 * `past`                | Date element corresponding to the date in the past
 * `future`              | Date element corresponding to the date in the future
 *
 * In order to style year scroller elements, use `<vaadin-date-picker-year>` shadow DOM parts:
 *
 * Part name             | Description
 * ----------------------|--------------------
 * `year-number`         | Year number
 * `year-separator`      | Year separator
 *
 * Note: the `theme` attribute value set on `<vaadin-date-picker>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Change events
 *
 * Depending on the nature of the value change that the user attempts to commit e.g. by pressing Enter,
 * the component can fire either a `change` event or an `unparsable-change` event:
 *
 * Value change             | Event
 * :------------------------|:------------------
 * empty => parsable        | change
 * empty => unparsable      | unparsable-change
 * parsable => empty        | change
 * parsable => parsable     | change
 * parsable => unparsable   | change
 * unparsable => empty      | unparsable-change
 * unparsable => parsable   | change
 * unparsable => unparsable | unparsable-change
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} unparsable-change Fired when the user commits an unparsable value change and there is no change event.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class DatePicker extends DatePickerMixin(InputControlMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  addEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: (this: DatePicker, ev: DatePickerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: (this: DatePicker, ev: DatePickerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-picker': DatePicker;
  }
}

export { DatePicker };
