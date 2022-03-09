/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-date-picker-overlay.js';
import './vaadin-date-picker-overlay-content.js';
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerMixin } from './vaadin-date-picker-mixin.js';

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
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DatePickerMixin
 */
class DatePickerLight extends ThemableMixin(DatePickerMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([opened]) {
          pointer-events: auto;
        }
      </style>
      <slot></slot>

      <vaadin-date-picker-overlay
        id="overlay"
        fullscreen$="[[_fullscreen]]"
        opened="{{opened}}"
        on-vaadin-overlay-open="_onOverlayOpened"
        on-vaadin-overlay-close="_onOverlayClosed"
        restore-focus-on-close
        restore-focus-node="[[inputElement]]"
        theme$="[[__getOverlayTheme(theme, _overlayInitialized)]]"
      >
        <template>
          <vaadin-date-picker-overlay-content
            id="overlay-content"
            i18n="[[i18n]]"
            fullscreen$="[[_fullscreen]]"
            label="[[label]]"
            selected-date="[[_selectedDate]]"
            slot="dropdown-content"
            focused-date="{{_focusedDate}}"
            show-week-numbers="[[showWeekNumbers]]"
            min-date="[[_minDate]]"
            max-date="[[_maxDate]]"
            on-date-tap="_close"
            role="dialog"
            part="overlay-content"
            theme$="[[__getOverlayTheme(theme, _overlayInitialized)]]"
          >
          </vaadin-date-picker-overlay-content>
        </template>
      </vaadin-date-picker-overlay>
    `;
  }

  static get is() {
    return 'vaadin-date-picker-light';
  }

  static get properties() {
    return {
      /**
       * Name of the two-way data-bindable property representing the
       * value of the custom input field.
       * @attr {string} attr-for-value
       * @type {string}
       */
      attrForValue: {
        type: String,
        value: 'value'
      },

      /**
       * @type {boolean}
       * @protected
       */
      _overlayInitialized: {
        type: Boolean,
        value: true
      }
    };
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    const cssSelector = 'vaadin-text-field,iron-input,paper-input,.paper-input-input,.input';
    this._setInputElement(this.querySelector(cssSelector));
    this._setFocusElement(this.inputElement);
  }

  /** @return {string | undefined} */
  get _inputValue() {
    return this.inputElement && this.inputElement[dashToCamelCase(this.attrForValue)];
  }

  set _inputValue(value) {
    if (this.inputElement) {
      this.inputElement[dashToCamelCase(this.attrForValue)] = value;
    }
  }

  // Workaround https://github.com/vaadin/web-components/issues/2855
  /** @protected */
  _openedChanged(opened) {
    super._openedChanged(opened);

    this.$.overlay.positionTarget = this.inputElement;
    this.$.overlay.noVerticalOverlap = true;
  }
}

customElements.define(DatePickerLight.is, DatePickerLight);

export { DatePickerLight };
