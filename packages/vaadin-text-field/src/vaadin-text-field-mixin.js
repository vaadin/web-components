/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut, animationFrame } from '@polymer/polymer/lib/utils/async.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  '',
  css`
    :host {
      display: inline-flex;
      outline: none;
    }

    :host::before {
      content: '\\2003';
      width: 0;
      display: inline-block;
      /* Size and position this element on the same vertical position as the input-field element
          to make vertical align for the host element work as expected */
    }

    :host([hidden]) {
      display: none !important;
    }

    .vaadin-text-field-container,
    .vaadin-text-area-container {
      display: flex;
      flex-direction: column;
      min-width: 100%;
      max-width: 100%;
      width: var(--vaadin-text-field-default-width, 12em);
    }

    [part='label']:empty {
      display: none;
    }

    [part='input-field'] {
      display: flex;
      align-items: center;
      flex: auto;
    }

    .vaadin-text-field-container [part='input-field'] {
      flex-grow: 0;
    }

    /* Reset the native input styles */
    [part='value'],
    [part='input-field'] ::slotted(input),
    [part='input-field'] ::slotted(textarea) {
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: none;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      min-width: 0;
      font: inherit;
      font-size: 1em;
      line-height: normal;
      color: inherit;
      background-color: transparent;
      /* Disable default invalid style in Firefox */
      box-shadow: none;
    }

    [part='input-field'] ::slotted(*) {
      flex: none;
    }

    [part='value'],
    [part='input-field'] ::slotted(input),
    [part='input-field'] ::slotted(textarea),
    [part='input-field'] ::slotted([part='value']) {
      flex: auto;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    [part='input-field'] ::slotted(textarea) {
      resize: none;
    }

    [part='clear-button'] {
      display: none;
      cursor: default;
    }

    [part='clear-button']::before {
      content: '✕';
    }

    :host([clear-button-visible][has-value]:not([disabled]):not([readonly])) [part='clear-button'] {
      display: block;
    }
  `,
  { moduleId: 'vaadin-text-field-shared-styles' }
);

const HOST_PROPS = {
  default: [
    'autofocus',
    'pattern',
    'autocapitalize',
    'autocorrect',
    'maxlength',
    'minlength',
    'name',
    'placeholder',
    'autocomplete',
    'title',
    'disabled',
    'readonly',
    'required'
  ],
  accessible: ['invalid']
};

const PROP_TYPE = {
  DEFAULT: 'default',
  ACCESSIBLE: 'accessible'
};

/**
 * @polymerMixin
 */
export const TextFieldMixin = (subclass) =>
  class VaadinTextFieldMixin extends subclass {
    static get properties() {
      return {
        /**
         * Whether the value of the control can be automatically completed by the browser.
         * List of available options at:
         * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
         */
        autocomplete: {
          type: String
        },

        /**
         * This is a property supported by Safari that is used to control whether
         * autocorrection should be enabled when the user is entering/editing the text.
         * Possible values are:
         * on: Enable autocorrection.
         * off: Disable autocorrection.
         * @type {!TextFieldAutoCorrect | undefined}
         */
        autocorrect: {
          type: String
        },

        /**
         * This is a property supported by Safari and Chrome that is used to control whether
         * autocapitalization should be enabled when the user is entering/editing the text.
         * Possible values are:
         * characters: Characters capitalization.
         * words: Words capitalization.
         * sentences: Sentences capitalization.
         * none: No capitalization.
         * @type {!TextFieldAutoCapitalize | undefined}
         */
        autocapitalize: {
          type: String
        },

        /**
         * Specify that the value should be automatically selected when the field gains focus.
         * @type {boolean}
         */
        autoselect: {
          type: Boolean,
          value: false
        },

        /**
         * Set to true to display the clear icon which clears the input.
         * @attr {boolean} clear-button-visible
         * @type {boolean}
         */
        clearButtonVisible: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * Error to show when the input value is invalid.
         * @attr {string} error-message
         * @type {string}
         */
        errorMessage: {
          type: String,
          value: '',
          observer: '_errorMessageChanged'
        },

        /**
         * Object with translated strings used for localization. Has
         * the following structure and default values:
         *
         * ```
         * {
         *   // Translation of the clear icon button accessible label
         *   clear: 'Clear'
         * }
         * ```
         * @type {{clear: string}}
         */
        i18n: {
          type: Object,
          value: () => {
            return {
              clear: 'Clear'
            };
          }
        },

        /**
         * String used for the label element.
         * @type {string}
         */
        label: {
          type: String,
          value: '',
          observer: '_labelChanged'
        },

        /**
         * String used for the helper text.
         * @attr {string} helper-text
         * @type {string | null}
         */
        helperText: {
          type: String,
          value: '',
          observer: '_helperTextChanged'
        },

        /**
         * Maximum number of characters (in Unicode code points) that the user can enter.
         */
        maxlength: {
          type: Number
        },

        /**
         * Minimum number of characters (in Unicode code points) that the user can enter.
         */
        minlength: {
          type: Number
        },

        /**
         * The name of the control, which is submitted with the form data.
         */
        name: {
          type: String
        },

        /**
         * A hint to the user of what can be entered in the control.
         */
        placeholder: {
          type: String
        },

        /**
         * This attribute indicates that the user cannot modify the value of the control.
         */
        readonly: {
          type: Boolean,
          reflectToAttribute: true
        },

        /**
         * Specifies that the user must fill in a value.
         */
        required: {
          type: Boolean,
          reflectToAttribute: true
        },

        /**
         * The initial value of the control.
         * It can be used for two-way data binding.
         * @type {string}
         */
        value: {
          type: String,
          value: '',
          observer: '_valueChanged',
          notify: true
        },

        /**
         * This property is set to true when the control value is invalid.
         * @type {boolean}
         */
        invalid: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          value: false
        },

        /**
         * When set to true, user is prevented from typing a value that
         * conflicts with the given `pattern`.
         * @attr {boolean} prevent-invalid-input
         */
        preventInvalidInput: {
          type: Boolean
        },

        /**
         * A pattern matched against individual characters the user inputs.
         * When set, the field will prevent:
         * - `keyDown` events if the entered key doesn't match `/^_enabledCharPattern$/`
         * - `paste` events if the pasted text doesn't match `/^_enabledCharPattern*$/`
         * - `drop` events if the dropped text doesn't match `/^_enabledCharPattern*$/`
         *
         * For example, to enable entering only numbers and minus signs,
         * `_enabledCharPattern = "[\\d-]"`
         * @protected
         */
        _enabledCharPattern: String,

        /** @private */
        _labelId: String,

        /** @private */
        _helperTextId: String,

        /** @private */
        _errorId: String,

        /** @private */
        _inputId: String,

        /** @private */
        _hasSlottedHelper: Boolean
      };
    }

    static get observers() {
      return [
        '_hostPropsChanged(' + HOST_PROPS.default.join(', ') + ')',
        '_hostAccessiblePropsChanged(' + HOST_PROPS.accessible.join(', ') + ')',
        '_getActiveErrorId(invalid, errorMessage, _errorId, helperText, _helperTextId, _hasSlottedHelper)',
        '_getActiveLabelId(label, _labelId, _inputId)',
        '__observeOffsetHeight(errorMessage, invalid, label, helperText)',
        '__enabledCharPatternChanged(_enabledCharPattern)'
      ];
    }

    /**
     * @return {HTMLElement | undefined}
     * @protected
     */
    get focusElement() {
      if (!this.shadowRoot) {
        return undefined;
      }
      const slotted = this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);
      if (slotted) {
        return slotted;
      }
      return this.shadowRoot.querySelector('[part="value"]');
    }

    /**
     * @return {HTMLElement | undefined}}
     * @protected
     */
    get inputElement() {
      return this.focusElement;
    }

    /**
     * @return {string}
     * @protected
     */
    get _slottedTagName() {
      return 'input';
    }

    /** @protected */
    _createConstraintsObserver() {
      // This complex observer needs to be added dynamically here (instead of defining it above in the `get observers()`)
      // so that it runs after complex observers of inheriting classes. Otherwise e.g. `_stepOrMinChanged()` observer of
      // vaadin-number-field would run after this and the `min` and `step` properties would not yet be propagated to
      // the `inputElement` when this runs.
      this._createMethodObserver('_constraintsChanged(required, minlength, maxlength, pattern)');
    }

    /** @private */
    _onInput(e) {
      if (this.preventInvalidInput) {
        const input = this.inputElement;
        if (input.value.length > 0 && !this.checkValidity()) {
          input.value = this.value || '';
          // add input-prevented attribute for 200ms
          this.setAttribute('input-prevented', '');
          this._inputDebouncer = Debouncer.debounce(this._inputDebouncer, timeOut.after(200), () => {
            this.removeAttribute('input-prevented');
          });
          return;
        }
      }

      if (!e.__fromClearButton) {
        this.__userInput = true;
      }

      this.value = e.target.value;
      this.__userInput = false;
    }

    /**
     * @param {!Event} e
     * @protected
     */
    _onChange(e) {
      if (this._valueClearing) {
        return;
      }

      // In the Shadow DOM, the `change` event is not leaked into the
      // ancestor tree, so we must do this manually.
      const changeEvent = new CustomEvent('change', {
        detail: {
          sourceEvent: e
        },
        bubbles: e.bubbles,
        cancelable: e.cancelable
      });
      this.dispatchEvent(changeEvent);
    }

    /**
     * @param {unknown} newVal
     * @param {unknown} oldVal
     * @protected
     */
    _valueChanged(newVal, oldVal) {
      // setting initial value to empty string, skip validation
      if (newVal === '' && oldVal === undefined) {
        return;
      }

      if (newVal !== '' && newVal != null) {
        this.setAttribute('has-value', '');
      } else {
        this.removeAttribute('has-value');
      }

      if (this.__userInput) {
        return;
      } else if (newVal !== undefined) {
        this.inputElement.value = newVal;
      } else {
        this.value = this.inputElement.value = '';
      }

      if (this.invalid) {
        this.validate();
      }
    }

    /** @private */
    _labelChanged(label) {
      this._setOrToggleAttribute('has-label', !!label, this);
    }

    /** @private */
    _helperTextChanged(helperText) {
      this._setOrToggleAttribute('has-helper', !!helperText, this);
    }

    /** @private */
    _errorMessageChanged(errorMessage) {
      this._setOrToggleAttribute('has-error-message', !!errorMessage, this);
    }

    /** @private */
    _onHelperSlotChange() {
      const slottedNodes = this.shadowRoot.querySelector(`[name="helper"]`).assignedNodes({ flatten: true });
      // Only has slotted helper if not a text node
      // Text nodes are added by the helperText prop and not the helper slot
      // The filter is added due to shady DOM triggering this callback on helperText prop change
      this._hasSlottedHelper = slottedNodes.filter((node) => node.nodeType !== 3).length;

      if (this._hasSlottedHelper) {
        this.setAttribute('has-helper', 'slotted');
      } else if (this.helperText === '' || this.helperText === null) {
        this.removeAttribute('has-helper');
      }
    }

    /** @private */
    _onSlotChange() {
      const slotted = this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);

      if (this.value) {
        this.inputElement.value = this.value;
        this.validate();
      }

      if (slotted && !this._slottedInput) {
        this._validateSlottedValue(slotted);
        this._addInputListeners(slotted);
        this._slottedInput = slotted;
      } else if (!slotted && this._slottedInput) {
        this._removeInputListeners(this._slottedInput);
        this._slottedInput = undefined;
      }

      Object.keys(PROP_TYPE)
        .map((key) => PROP_TYPE[key])
        .forEach((type) =>
          this._propagateHostAttributes(
            HOST_PROPS[type].map((attr) => this[attr]),
            type
          )
        );
    }

    /** @private */
    _hostPropsChanged(...attributesValues) {
      this._propagateHostAttributes(attributesValues, PROP_TYPE.DEFAULT);
    }

    /** @private */
    _hostAccessiblePropsChanged(...attributesValues) {
      this._propagateHostAttributes(attributesValues, PROP_TYPE.ACCESSIBLE);
    }

    /** @private */
    _validateSlottedValue(slotted) {
      if (slotted.value !== this.value) {
        console.warn('Please define value on the vaadin-text-field component!');
        slotted.value = '';
      }
    }

    /** @private */
    _propagateHostAttributes(attributesValues, type) {
      const input = this.inputElement;
      const attributeNames = HOST_PROPS[type];

      if (type === PROP_TYPE.ACCESSIBLE) {
        attributeNames.forEach((attr, index) => {
          this._setOrToggleAttribute(attr, attributesValues[index], input);
          this._setOrToggleAttribute(`aria-${attr}`, attributesValues[index] ? 'true' : false, input);
        });
      } else {
        attributeNames.forEach((attr, index) => {
          this._setOrToggleAttribute(attr, attributesValues[index], input);
        });
      }
    }

    /** @private */
    _setOrToggleAttribute(name, value, node) {
      if (!name || !node) {
        return;
      }

      if (value) {
        node.setAttribute(name, typeof value === 'boolean' ? '' : value);
      } else {
        node.removeAttribute(name);
      }
    }

    /**
     * @param {boolean | undefined} required
     * @param {number | undefined} minlength
     * @param {number | undefined} maxlength
     * @param {string | undefined} maxlength
     * @protected
     */
    _constraintsChanged(required, minlength, maxlength, pattern) {
      if (!this.invalid) {
        return;
      }

      if (!required && !minlength && !maxlength && !pattern) {
        this.invalid = false;
      } else {
        this.validate();
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any)
     * @return {boolean}
     */
    checkValidity() {
      // Note (Yuriy): `__forceCheckValidity` is used in containing components (i.e. `vaadin-date-picker`) in order
      // to force the checkValidity instead of returning the previous invalid state.
      if (this.required || this.pattern || this.maxlength || this.minlength || this.__forceCheckValidity) {
        return this.inputElement.checkValidity();
      } else {
        return !this.invalid;
      }
    }

    /** @private */
    _addInputListeners(node) {
      node.addEventListener('input', this._boundOnInput);
      node.addEventListener('change', this._boundOnChange);
      node.addEventListener('blur', this._boundOnBlur);
      node.addEventListener('focus', this._boundOnFocus);
      node.addEventListener('paste', this._boundOnPaste);
      node.addEventListener('drop', this._boundOnDrop);
      node.addEventListener('beforeinput', this._boundOnBeforeInput);
    }

    /** @private */
    _removeInputListeners(node) {
      node.removeEventListener('input', this._boundOnInput);
      node.removeEventListener('change', this._boundOnChange);
      node.removeEventListener('blur', this._boundOnBlur);
      node.removeEventListener('focus', this._boundOnFocus);
      node.removeEventListener('paste', this._boundOnPaste);
      node.removeEventListener('drop', this._boundOnDrop);
      node.removeEventListener('beforeinput', this._boundOnBeforeInput);
    }

    /** @protected */
    ready() {
      super.ready();

      this._createConstraintsObserver();

      this._boundOnInput = this._onInput.bind(this);
      this._boundOnChange = this._onChange.bind(this);
      this._boundOnBlur = this._onBlur.bind(this);
      this._boundOnFocus = this._onFocus.bind(this);
      this._boundOnPaste = this._onPaste.bind(this);
      this._boundOnDrop = this._onDrop.bind(this);
      this._boundOnBeforeInput = this._onBeforeInput.bind(this);

      const defaultInput = this.shadowRoot.querySelector('[part="value"]');
      this._slottedInput = this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);
      this._addInputListeners(defaultInput);
      if (this._slottedInput) {
        this._addInputListeners(this._slottedInput);
      }

      this.shadowRoot
        .querySelector('[name="input"], [name="textarea"]')
        .addEventListener('slotchange', this._onSlotChange.bind(this));

      this._onHelperSlotChange();
      this.shadowRoot
        .querySelector('[name="helper"]')
        .addEventListener('slotchange', this._onHelperSlotChange.bind(this));

      this.$.clearButton.addEventListener('mousedown', () => (this._valueClearing = true));
      this.$.clearButton.addEventListener('mouseleave', () => (this._valueClearing = false));
      this.$.clearButton.addEventListener('click', this._onClearButtonClick.bind(this));
      this.addEventListener('keydown', this._onKeyDown.bind(this));

      var uniqueId = (TextFieldMixin._uniqueId = 1 + TextFieldMixin._uniqueId || 0);
      this._errorId = `${this.constructor.is}-error-${uniqueId}`;
      this._labelId = `${this.constructor.is}-label-${uniqueId}`;
      this._helperTextId = `${this.constructor.is}-helper-${uniqueId}`;
      this._inputId = `${this.constructor.is}-input-${uniqueId}`;

      // Lumo theme defines a max-height transition for the "error-message"
      // part on invalid state change.
      this.shadowRoot.querySelector('[part="error-message"]').addEventListener('transitionend', () => {
        this.__observeOffsetHeight();
      });
    }

    /**
     * Returns true if `value` is valid.
     *
     * @return {boolean} True if the value is valid.
     */
    validate() {
      return !(this.invalid = !this.checkValidity());
    }

    clear() {
      this.value = '';
    }

    /** @private */
    _onBlur() {
      this.validate();
    }

    /** @private */
    _onFocus() {
      if (this.autoselect) {
        this.inputElement.select();
        // iOS 9 workaround: https://stackoverflow.com/a/7436574
        setTimeout(() => {
          try {
            this.inputElement.setSelectionRange(0, 9999);
          } catch (e) {
            // The workaround may cause errors on different input types.
            // Needs to be suppressed. See https://github.com/vaadin/flow/issues/6070
          }
        });
      }
    }

    /** @private */
    _onClearButtonClick(e) {
      e.preventDefault();
      // NOTE(yuriy): This line won't affect focus on the host. Cannot be properly tested.
      this.inputElement.focus();
      this.clear();
      this._valueClearing = false;
      const inputEvent = new Event('input', { bubbles: true, composed: true });
      inputEvent.__fromClearButton = true;
      const changeEvent = new Event('change', { bubbles: !this._slottedInput });
      changeEvent.__fromClearButton = true;
      this.inputElement.dispatchEvent(inputEvent);
      this.inputElement.dispatchEvent(changeEvent);
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    _onKeyDown(e) {
      if (e.keyCode === 27 && this.clearButtonVisible) {
        const dispatchChange = !!this.value;
        this.clear();
        dispatchChange && this.inputElement.dispatchEvent(new Event('change', { bubbles: !this._slottedInput }));
      }

      if (this._enabledCharPattern && !this.__shouldAcceptKey(e)) {
        e.preventDefault();
      }
    }

    /** @private */
    __shouldAcceptKey(event) {
      return (
        event.metaKey ||
        event.ctrlKey ||
        !event.key || // allow typing anything if event.key is not supported
        event.key.length !== 1 || // allow "Backspace", "ArrowLeft" etc.
        this.__enabledCharRegExp.test(event.key)
      );
    }

    /** @private */
    _onPaste(e) {
      if (this._enabledCharPattern) {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!this.__enabledTextRegExp.test(pastedText)) {
          e.preventDefault();
        }
      }
    }

    /** @private */
    _onDrop(e) {
      if (this._enabledCharPattern) {
        const draggedText = e.dataTransfer.getData('text');
        if (!this.__enabledTextRegExp.test(draggedText)) {
          e.preventDefault();
        }
      }
    }

    /** @private */
    _onBeforeInput(e) {
      // The `beforeinput` event covers all the cases for `_enabledCharPattern`: keyboard, pasting and dropping,
      // but it is still experimental technology so we can't rely on it. It's used here just as an additional check,
      // because it seems to be the only way to detect and prevent specific keys on mobile devices. See issue #429.
      if (this._enabledCharPattern && e.data && !this.__enabledTextRegExp.test(e.data)) {
        e.preventDefault();
      }
    }

    /** @private */
    __enabledCharPatternChanged(_enabledCharPattern) {
      this.__enabledCharRegExp = _enabledCharPattern && new RegExp('^' + _enabledCharPattern + '$');
      this.__enabledTextRegExp = _enabledCharPattern && new RegExp('^' + _enabledCharPattern + '*$');
    }

    /** @private */
    _getActiveErrorId(invalid, errorMessage, errorId, helperText, helperTextId, hasSlottedHelper) {
      const ids = [];
      if (helperText || hasSlottedHelper) {
        ids.push(helperTextId);
      }
      if (errorMessage && invalid) {
        ids.push(errorId);
      }
      this._setOrToggleAttribute('aria-describedby', ids.join(' '), this.focusElement);
    }

    /** @private */
    _getActiveLabelId(label, _labelId, _inputId) {
      let ids = _inputId;
      if (label) {
        ids = `${_labelId} ${_inputId}`;
      }
      this.focusElement.setAttribute('aria-labelledby', ids);
    }

    /** @private */
    _getErrorMessageAriaHidden(invalid, errorMessage, errorId) {
      return (!(errorMessage && invalid ? errorId : undefined)).toString();
    }

    /** @private */
    _dispatchIronResizeEventIfNeeded(sizePropertyName, value) {
      const previousSizePropertyName = '__previous' + sizePropertyName;
      if (this[previousSizePropertyName] !== undefined && this[previousSizePropertyName] !== value) {
        this.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true, composed: true }));
      }

      this[previousSizePropertyName] = value;
    }

    /** @private */
    __observeOffsetHeight() {
      this.__observeOffsetHeightDebouncer = Debouncer.debounce(
        this.__observeOffsetHeightDebouncer,
        animationFrame,
        () => {
          this._dispatchIronResizeEventIfNeeded('Height', this.offsetHeight);
        }
      );
    }

    // Workaround for https://github.com/Polymer/polymer/issues/5259
    get __data() {
      return this.__dataValue || {};
    }

    set __data(value) {
      this.__dataValue = value;
    }

    /**
     * Fired when the user commits a value change.
     *
     * @event change
     */

    /**
     * Fired when the value is changed by the user: on every typing keystroke,
     * and the value is cleared using the clear button.
     *
     * @event input
     */

    /**
     * Fired when the size of the element changes.
     *
     * DEPRECATED: This event will be dropped in one of the future Vaadin versions. Use a ResizeObserver instead.
     * @event iron-resize
     */
  };
