/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TimePickerMixin } from './vaadin-time-picker-mixin.js';

export type { TimePickerTime } from './vaadin-time-picker-helper.js';
export type { TimePickerI18n } from './vaadin-time-picker-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type TimePickerChangeEvent = Event & {
  target: TimePicker;
};

/**
 * Fired when the `invalid` property changes.
 */
export type TimePickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `opened` property changes.
 */
export type TimePickerOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type TimePickerValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type TimePickerValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface TimePickerCustomEventMap {
  'invalid-changed': TimePickerInvalidChangedEvent;

  'opened-changed': TimePickerOpenedChangedEvent;

  'value-changed': TimePickerValueChangedEvent;

  validated: TimePickerValidatedEvent;
}

export interface TimePickerEventMap extends HTMLElementEventMap, TimePickerCustomEventMap {
  change: TimePickerChangeEvent;
}

/**
 * `<vaadin-time-picker>` is a Web Component providing a time-selection field.
 *
 * ```html
 * <vaadin-time-picker></vaadin-time-picker>
 * ```
 * ```js
 * timePicker.value = '14:30';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                          | Description                | Default
 * -----------------------------------------|----------------------------|---------
 * `--vaadin-field-default-width`           | Default width of the field | `12em`
 * `--vaadin-time-picker-overlay-width`     | Width of the overlay       | `auto`
 * `--vaadin-time-picker-overlay-max-height`| Max height of the overlay  | `65vh`
 *
 * `<vaadin-time-picker>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------
 * `toggle-button` | The toggle button
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute | Description
 * ----------|------------------------------------------
 * `opened`  | Set when the time-picker dropdown is open
 *
 * ### Internal components
 *
 * In addition to `<vaadin-time-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-time-picker-combo-box>` - has the same API as [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light).
 * - `<vaadin-time-picker-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-time-picker-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - [`<vaadin-input-container>`](#/elements/vaadin-input-container) - an internal element wrapping the input.
 *
 * Note: the `theme` attribute value set on `<vaadin-time-picker>` is
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
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class TimePicker extends TimePickerMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof TimePickerEventMap>(
    type: K,
    listener: (this: TimePicker, ev: TimePickerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof TimePickerEventMap>(
    type: K,
    listener: (this: TimePicker, ev: TimePickerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-time-picker': TimePicker;
  }
}

export { TimePicker };
