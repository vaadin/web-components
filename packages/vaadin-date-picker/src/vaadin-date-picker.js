/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';
import './vaadin-date-picker-overlay.js';
import './vaadin-date-picker-overlay-content.js';
import { DatePickerMixin } from './vaadin-date-picker-mixin.js';
import './vaadin-date-picker-text-field.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

/**
 * `<vaadin-date-picker>` is a date selection field which includes a scrollable
 * month calendar view.
 * ```html
 * <vaadin-date-picker label="Birthday"></vaadin-date-picker>
 * ```
 * ```js
 * datePicker.value = '2016-03-02';
 * ```
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description | Theme for Element
 * ----------------|----------------|----------------
 * `text-field` | Input element | vaadin-date-picker
 * `clear-button` | Clear button | vaadin-date-picker
 * `toggle-button` | Toggle button | vaadin-date-picker
 * `overlay-content` | The overlay element | vaadin-date-picker
 * `overlay-header` | Fullscreen mode header | vaadin-date-picker-overlay-content
 * `label` | Fullscreen mode value/label | vaadin-date-picker-overlay-content
 * `clear-button` | Fullscreen mode clear button | vaadin-date-picker-overlay-content
 * `toggle-button` | Fullscreen mode toggle button | vaadin-date-picker-overlay-content
 * `years-toggle-button` | Fullscreen mode years scroller toggle | vaadin-date-picker-overlay-content
 * `months` | Months scroller | vaadin-date-picker-overlay-content
 * `years` | Years scroller | vaadin-date-picker-overlay-content
 * `toolbar` | Footer bar with buttons | vaadin-date-picker-overlay-content
 * `today-button` | Today button | vaadin-date-picker-overlay-content
 * `cancel-button` | Cancel button | vaadin-date-picker-overlay-content
 * `month` | Month calendar | vaadin-date-picker-overlay-content
 * `year-number` | Year number | vaadin-date-picker-overlay-content
 * `year-separator` | Year separator | vaadin-date-picker-overlay-content
 * `month-header` | Month title | vaadin-month-calendar
 * `weekdays` | Weekday container | vaadin-month-calendar
 * `weekday` | Weekday element | vaadin-month-calendar
 * `week-numbers` | Week numbers container | vaadin-month-calendar
 * `week-number` | Week number element | vaadin-month-calendar
 * `date` | Date element | vaadin-month-calendar
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `invalid` | Set when the element is invalid | :host
 * `opened` | Set when the date selector overlay is opened | :host
 * `readonly` | Set when the element is readonly | :host
 * `disabled` | Set when the element is disabled | :host
 * `today` | Set on the date corresponding to the current day | date
 * `focused` | Set on the focused date | date
 * `disabled` | Set on the date out of the allowed range | date
 * `selected` | Set on the selected date | date
 *
 * If you want to replace the default input field with a custom implementation, you should use the
 * [`<vaadin-date-picker-light>`](#vaadin-date-picker-light) element.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-date-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-date-picker-text-field>` - has the same API as [`<vaadin-text-field>`](#/elements/vaadin-text-field).
 * - `<vaadin-date-picker-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-date-picker-overlay-content>`
 * - `<vaadin-month-calendar>`
 *
 * Note: the `theme` attribute value set on `<vaadin-date-picker>` is
 * propagated to the internal components listed above.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControlStateMixin
 * @mixes ThemableMixin
 * @mixes DatePickerMixin
 * @mixes GestureEventListeners
 */
class DatePickerElement extends ElementMixin(
  ControlStateMixin(ThemableMixin(DatePickerMixin(GestureEventListeners(PolymerElement))))
) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([opened]) {
          pointer-events: auto;
        }

        [part='text-field'] {
          width: 100%;
          min-width: 0;
        }
      </style>

      <vaadin-date-picker-text-field
        id="input"
        role="application"
        autocomplete="off"
        on-focus="_focus"
        value="{{_userInputValue}}"
        invalid="[[invalid]]"
        label="[[label]]"
        name="[[name]]"
        placeholder="[[placeholder]]"
        required="[[required]]"
        disabled="[[disabled]]"
        readonly="[[readonly]]"
        error-message="[[errorMessage]]"
        clear-button-visible="[[clearButtonVisible]]"
        aria-label$="[[label]]"
        part="text-field"
        helper-text="[[helperText]]"
        theme$="[[theme]]"
      >
        <slot name="prefix" slot="prefix"></slot>
        <slot name="helper" slot="helper">[[helperText]]</slot>
        <div
          part="toggle-button"
          slot="suffix"
          on-tap="_toggle"
          role="button"
          aria-label$="[[i18n.calendar]]"
          aria-expanded$="[[_getAriaExpanded(opened)]]"
        ></div>
      </vaadin-date-picker-text-field>

      <vaadin-date-picker-overlay
        id="overlay"
        fullscreen$="[[_fullscreen]]"
        theme$="[[__getOverlayTheme(theme, _overlayInitialized)]]"
        on-vaadin-overlay-open="_onOverlayOpened"
        on-vaadin-overlay-close="_onOverlayClosed"
        disable-upgrade
      >
        <template>
          <vaadin-date-picker-overlay-content
            id="overlay-content"
            i18n="[[i18n]]"
            fullscreen$="[[_fullscreen]]"
            label="[[label]]"
            selected-date="{{_selectedDate}}"
            slot="dropdown-content"
            focused-date="{{_focusedDate}}"
            show-week-numbers="[[showWeekNumbers]]"
            min-date="[[_minDate]]"
            max-date="[[_maxDate]]"
            role="dialog"
            on-date-tap="_close"
            part="overlay-content"
            theme$="[[__getOverlayTheme(theme, _overlayInitialized)]]"
          >
          </vaadin-date-picker-overlay-content>
        </template>
      </vaadin-date-picker-overlay>

      <iron-media-query query="[[_fullscreenMediaQuery]]" query-matches="{{_fullscreen}}"> </iron-media-query>
    `;
  }

  static get is() {
    return 'vaadin-date-picker';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * Set to true to display the clear icon which clears the input.
       * @attr {boolean} clear-button-visible
       * @type {boolean}
       */
      clearButtonVisible: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable this element.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The error message to display when the input is invalid.
       * @attr {string} error-message
       */
      errorMessage: String,

      /**
       * A placeholder string in addition to the label. If this is set, the label will always float.
       */
      placeholder: String,

      /**
       * String used for the helper text.
       * @attr {string} helper-text
       */
      helperText: {
        type: String,
        value: ''
      },

      /**
       * Set to true to make this element read-only.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * This property is set to true when the control value invalid.
       * @type {boolean}
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false
      },

      /** @private */
      _userInputValue: String
    };
  }

  static get observers() {
    return ['_userInputValueChanged(_userInputValue)', '_setClearButtonLabel(i18n.clear)'];
  }

  /** @protected */
  ready() {
    super.ready();

    // In order to have synchronized invalid property, we need to use the same validate logic.
    afterNextRender(this, () => {
      this._inputElement.validate = () => {};
    });

    this._inputElement.addEventListener('change', (e) => {
      // For change event on text-field blur, after the field is cleared,
      // we schedule change event to be dispatched on date-picker blur.
      if (this._inputElement.value === '' && !e.__fromClearButton) {
        this.__dispatchChange = true;
      }
    });
  }

  /** @private */
  _onVaadinOverlayClose(e) {
    if (this._openedWithFocusRing && this.hasAttribute('focused')) {
      this.focusElement.setAttribute('focus-ring', '');
    } else if (!this.hasAttribute('focused')) {
      this.focusElement.blur();
    }
    if (e.detail.sourceEvent && e.detail.sourceEvent.composedPath().indexOf(this) !== -1) {
      e.preventDefault();
    }
  }

  /** @private */
  _toggle(e) {
    e.stopPropagation();
    this[this._overlayInitialized && this.$.overlay.opened ? 'close' : 'open']();
  }

  /**
   * @return {HTMLElement}
   * @protected
   */
  _input() {
    return this.$.input;
  }

  set _inputValue(value) {
    this._inputElement.value = value;
  }

  /** @return {string} */
  get _inputValue() {
    return this._inputElement.value;
  }

  /** @private */
  _getAriaExpanded(opened) {
    return Boolean(opened).toString();
  }

  /**
   * Focusable element used by vaadin-control-state-mixin
   * @return {!HTMLElement}
   * @protected
   */
  get focusElement() {
    return this._input() || this;
  }

  /** @private */
  _setClearButtonLabel(i18nClear) {
    // FIXME(platosha): expose i18n API in <vaadin-text-field>
    // https://github.com/vaadin/vaadin-text-field/issues/348
    this._inputElement.shadowRoot.querySelector('[part="clear-button"]').setAttribute('aria-label', i18nClear);
  }
}

customElements.define(DatePickerElement.is, DatePickerElement);

export { DatePickerElement };
