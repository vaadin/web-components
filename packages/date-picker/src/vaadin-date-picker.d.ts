/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
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

export interface DatePickerCustomEventMap {
  'opened-changed': DatePickerOpenedChangedEvent;

  'invalid-changed': DatePickerInvalidChangedEvent;

  'value-changed': DatePickerValueChangedEvent;
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
 * `overlay-content`     | The overlay element
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute  | Description                                      | Part name
 * -----------|--------------------------------------------------|-----------
 * `opened`   | Set when the date selector overlay is opened     | :host
 * `today`    | Set on the date corresponding to the current day | date
 * `selected` | Set on the selected date                         | date
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
 * `months`              | Months scroller
 * `years`               | Years scroller
 * `toolbar`             | Footer bar with buttons
 * `today-button`        | Today button
 * `cancel-button`       | Cancel button
 * `month`               | Month calendar
 * `year-number`         | Year number
 * `year-separator`      | Year separator
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
 *
 * Note: the `theme` attribute value set on `<vaadin-date-picker>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
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
