/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
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
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and buttons
 * `field-button`       | Set on both clear and toggle buttons
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 * `toggle-button`      | The toggle button
 * `backdrop`           | Backdrop of the overlay
 * `overlay`            | The overlay container
 * `content`            | The overlay content
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
 * `focused`            | Set when the element is focused
 * `focus-ring`         | Set when the element is keyboard focused
 * `readonly`           | Set when the element is readonly
 * `opened`             | Set when the overlay is opened
 * `week-numbers`       | Set when week numbers are shown in the calendar
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                        |
 * :----------------------------------------------------------|
 * | `--vaadin-date-picker-date-border-radius`                |
 * | `--vaadin-date-picker-date-disabled-color`               |
 * | `--vaadin-date-picker-date-height`                       |
 * | `--vaadin-date-picker-date-selected-background`          |
 * | `--vaadin-date-picker-date-selected-color`               |
 * | `--vaadin-date-picker-date-today-color`                  |
 * | `--vaadin-date-picker-date-width`                        |
 * | `--vaadin-date-picker-month-header-color`                |
 * | `--vaadin-date-picker-month-header-font-size`            |
 * | `--vaadin-date-picker-month-header-font-weight`          |
 * | `--vaadin-date-picker-month-padding`                     |
 * | `--vaadin-date-picker-overlay-max-height`                |
 * | `--vaadin-date-picker-overlay-width`                     |
 * | `--vaadin-date-picker-toolbar-padding`                   |
 * | `--vaadin-date-picker-week-divider-color`                |
 * | `--vaadin-date-picker-week-number-color`                 |
 * | `--vaadin-date-picker-week-number-font-size`             |
 * | `--vaadin-date-picker-weekday-color`                     |
 * | `--vaadin-date-picker-weekday-font-size`                 |
 * | `--vaadin-date-picker-weekday-font-weight`               |
 * | `--vaadin-date-picker-year-scroller-background`          |
 * | `--vaadin-date-picker-year-scroller-border-color`        |
 * | `--vaadin-date-picker-year-scroller-current-year-color`  |
 * | `--vaadin-date-picker-year-scroller-width`               |
 * | `--vaadin-field-default-width`                           |
 * | `--vaadin-input-field-background`                        |
 * | `--vaadin-input-field-border-color`                      |
 * | `--vaadin-input-field-border-radius`                     |
 * | `--vaadin-input-field-border-width`                      |
 * | `--vaadin-input-field-bottom-end-radius`                 |
 * | `--vaadin-input-field-bottom-start-radius`               |
 * | `--vaadin-input-field-button-text-color`                 |
 * | `--vaadin-input-field-container-gap`                     |
 * | `--vaadin-input-field-disabled-background`               |
 * | `--vaadin-input-field-disabled-text-color`               |
 * | `--vaadin-input-field-error-color`                       |
 * | `--vaadin-input-field-error-font-size`                   |
 * | `--vaadin-input-field-error-font-weight`                 |
 * | `--vaadin-input-field-error-line-height`                 |
 * | `--vaadin-input-field-gap`                               |
 * | `--vaadin-input-field-helper-color`                      |
 * | `--vaadin-input-field-helper-font-size`                  |
 * | `--vaadin-input-field-helper-font-weight`                |
 * | `--vaadin-input-field-helper-line-height`                |
 * | `--vaadin-input-field-label-color`                       |
 * | `--vaadin-input-field-label-font-size`                   |
 * | `--vaadin-input-field-label-font-weight`                 |
 * | `--vaadin-input-field-label-line-height`                 |
 * | `--vaadin-input-field-padding`                           |
 * | `--vaadin-input-field-placeholder-color`                 |
 * | `--vaadin-input-field-required-indicator`                |
 * | `--vaadin-input-field-required-indicator-color`          |
 * | `--vaadin-input-field-top-end-radius`                    |
 * | `--vaadin-input-field-top-start-radius`                  |
 * | `--vaadin-input-field-value-color`                       |
 * | `--vaadin-input-field-value-font-size`                   |
 * | `--vaadin-input-field-value-font-weight`                 |
 * | `--vaadin-input-field-value-line-height`                 |
 *
 * ### Internal components
 *
 * In addition to `<vaadin-date-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-date-picker-overlay-content>`
 * - `<vaadin-date-picker-month-scroller>`
 * - `<vaadin-date-picker-year-scroller>`
 * - `<vaadin-date-picker-year>`
 * - `<vaadin-month-calendar>`
 *
 * In order to style the overlay content, use `<vaadin-date-picker-overlay-content>` shadow DOM parts:
 *
 * Part name             | Description
 * ----------------------|--------------------
 * `years-toggle-button` | Fullscreen mode years scroller toggle
 * `toolbar`             | Toolbar with slotted buttons
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
