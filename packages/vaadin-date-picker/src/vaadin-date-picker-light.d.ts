import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { DatePickerMixin } from './vaadin-date-picker-mixin.js';

import { DatePickerEventMap } from './interfaces';

/**
 * `<vaadin-date-picker-light>` is a customizable version of the `<vaadin-date-picker>` providing
 * only the scrollable month calendar view and leaving the input field definition to the user.
 *
 * To create a custom input field, you need to add a child element which has a two-way
 * data-bindable property representing the input value. The property name is expected
 * to be `bindValue` by default. See the example below for a simplest possible example
 * using an `<input>` element.
 *
 * ```html
 * <vaadin-date-picker-light attr-for-value="value">
 *   <input class="input">
 * </vaadin-date-picker-light>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description | Theme for Element
 * ----------------|----------------|----------------
 * `overlay-content` | The overlay element | vaadin-date-picker-light
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * In addition to `<vaadin-date-picker-light>` itself, the following
 * internal components are themable:
 *
 * - `<vaadin-date-picker-overlay>`
 * - `<vaadin-date-picker-overlay-content>`
 * - `<vaadin-month-calendar>`
 *
 * Note: the `theme` attribute value set on `<vaadin-date-picker-light>`
 * is propagated to the internal themable components listed above.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class DatePickerLightElement extends ThemableMixin(DatePickerMixin(HTMLElement)) {
  _overlayInitialized: boolean;

  _inputValue: string | undefined;

  /**
   * Name of the two-way data-bindable property representing the
   * value of the custom input field.
   */
  attrForValue: string;

  _input(): HTMLElement | null;

  addEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: (this: DatePickerLightElement, ev: DatePickerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: (this: DatePickerLightElement, ev: DatePickerEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-picker-light': DatePickerLightElement;
  }
}

export { DatePickerLightElement };
