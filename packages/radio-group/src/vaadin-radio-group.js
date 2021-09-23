/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RadioButton } from './vaadin-radio-button.js';

/**
 * `<vaadin-radio-group>` is a Web Component for grouping vaadin-radio-buttons.
 *
 * ```html
 * <vaadin-radio-group>
 *   <vaadin-radio-button name="foo">Foo</vaadin-radio-button>
 *   <vaadin-radio-button name="bar">Bar</vaadin-radio-button>
 *   <vaadin-radio-button name="baz">Baz</vaadin-radio-button>
 * </vaadin-radio-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `label` | The label element
 * `group-field` | The element that wraps radio-buttons
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `disabled`   | Set when the radio group and its children are disabled. | :host
 * `readonly` | Set to a readonly radio group | :host
 * `invalid` | Set when the element is invalid | :host
 * `has-label` | Set when the element has a label | :host
 * `has-value` | Set when the element has a value | :host
 * `has-helper` | Set when the element has helper text or slot | :host
 * `has-error-message` | Set when the element has an error message, regardless if the field is valid or not | :host
 * `focused` | Set when the element contains focus | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @element vaadin-radio-group
 */
class RadioGroupElement extends ThemableMixin(DirMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;

          /* Prevent horizontal overflow in IE 11 instead of wrapping radios */
          max-width: 100%;
        }

        :host::before {
          content: '\\2003';
          width: 0;
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        .vaadin-group-field-container {
          display: flex;
          flex-direction: column;

          /* Prevent horizontal overflow in IE 11 instead of wrapping radios */
          width: 100%;
        }

        [part='label']:empty {
          display: none;
        }
      </style>

      <div class="vaadin-group-field-container">
        <label part="label">[[label]]</label>

        <div part="group-field">
          <slot id="slot"></slot>
        </div>

        <div
          part="helper-text"
          id="[[_helperTextId]]"
          aria-live="assertive"
          aria-hidden$="[[_getHelperTextAriaHidden(helperText, _helperTextId, _hasSlottedHelper)]]"
        >
          <slot name="helper">[[helperText]]</slot>
        </div>

        <div
          part="error-message"
          id="[[_errorId]]"
          aria-live="assertive"
          aria-hidden$="[[_getErrorMessageAriaHidden(invalid, errorMessage, _errorId)]]"
          >[[errorMessage]]</div
        >
      </div>
    `;
  }

  static get is() {
    return 'vaadin-radio-group';
  }

  static get properties() {
    return {
      /**
       * The current disabled state of the radio group. True if group and all internal radio buttons are disabled.
       */
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_disabledChanged'
      },

      /**
       * This attribute indicates that the user cannot modify the value of the control.
       */
      readonly: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_readonlyChanged'
      },

      /**
       * This property is set to true when the value is invalid.
       * @type {boolean}
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false
      },

      /**
       * Specifies that the user must fill in a value.
       */
      required: {
        type: Boolean,
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

      /** @private */
      _errorId: {
        type: String
      },

      /** @private */
      _helperTextId: {
        type: String
      },

      /** @private */
      _hasSlottedHelper: Boolean,

      /** @private */
      _checkedButton: {
        type: Object
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
       * Value of the radio group.
       */
      value: {
        type: String,
        notify: true,
        observer: '_valueChanged'
      }
    };
  }

  /** @protected */
  ready() {
    super.ready();

    this._addListeners();

    // Ensure every instance has unique id
    const uniqueId = (RadioGroupElement._uniqueRadioGroupId = 1 + RadioGroupElement._uniqueRadioGroupId || 0);
    this._fieldName = `${this.localName}-${uniqueId}`;
    this._errorId = `${this.localName}-error-${uniqueId}`;
    this._helperTextId = `${this.localName}-helper-${uniqueId}`;

    this._observer = new FlattenedNodesObserver(this, (info) => {
      const checkedChangedListener = (e) => {
        if (e.target.checked) {
          this._changeSelectedButton(e.target);
        }
      };

      // reverse() is used to set the last checked radio button value to radio group value
      this._filterRadioButtons(info.addedNodes)
        .reverse()
        .forEach((button) => {
          button.name = this._fieldName;
          button.addEventListener('checked-changed', checkedChangedListener);
          if (this.disabled) {
            button.disabled = true;
          }
          if (button.checked) {
            this._changeSelectedButton(button);
          }
        });

      this._filterRadioButtons(info.removedNodes).forEach((button) => {
        button.removeEventListener('checked-changed', checkedChangedListener);
        if (button == this._checkedButton) {
          this.value = undefined;
        }
      });

      this._setOrToggleHasHelperAttribute();
    });

    this.setAttribute('role', 'radiogroup');

    // Sometimes radio buttons are initialized after the radio group
    // (the actual order depends on the way they are added to the DOM).
    // That being so, `_setFocusable` should be called only after
    // all the radio buttons in the group have been initialized and rendered.
    // Otherwise, the radio button's focus element may be not available.
    customElements.whenDefined(RadioButton.is).then(() => {
      if (this._radioButtons.length) {
        this._setFocusable(0);
      }
    });
  }

  /** @private */
  get _radioButtons() {
    return this._filterRadioButtons(this.querySelectorAll('*'));
  }

  /**
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    if (focused) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }
  }

  /** @private */
  _filterRadioButtons(nodes) {
    return Array.from(nodes).filter((child) => child instanceof RadioButton);
  }

  /** @private */
  _disabledChanged(disabled) {
    this.setAttribute('aria-disabled', disabled);
    this._updateDisableButtons();
  }

  /** @private */
  _updateDisableButtons() {
    this._radioButtons.forEach((button) => {
      if (this.disabled) {
        button.disabled = true;
      } else if (this.readonly) {
        // it's not possible to set readonly to radio buttons, but we can
        // unchecked ones instead.
        button.disabled = button !== this._checkedButton && this.readonly;
      } else {
        button.disabled = false;
      }
    });
  }

  /** @private */
  _readonlyChanged(newV, oldV) {
    (newV || oldV) && this._updateDisableButtons();
  }

  /** @private */
  _addListeners() {
    this.addEventListener('keydown', (e) => {
      // if e.target is vaadin-radio-group then assign to checkedRadioButton currently checked radio button
      let checkedRadioButton;

      if (e.target === this) {
        checkedRadioButton = this._checkedButton;
      } else {
        checkedRadioButton = e.composedPath().find((element) => {
          return element instanceof RadioButton;
        });
      }
      const horizontalRTL = this.getAttribute('dir') === 'rtl' && this.theme !== 'vertical';

      // LEFT, UP - select previous radio button
      if (e.keyCode === 37 || e.keyCode === 38) {
        e.preventDefault();
        this._selectIncButton(horizontalRTL, checkedRadioButton);
      }

      // RIGHT, DOWN - select next radio button
      if (e.keyCode === 39 || e.keyCode === 40) {
        e.preventDefault();
        this._selectIncButton(!horizontalRTL, checkedRadioButton);
      }
    });

    this.addEventListener('focusin', () => this._setFocused(this._containsFocus()));

    this.addEventListener('focusout', () => {
      this.validate();
      this._setFocused(false);
    });
  }

  /**
   * @param {boolean} next
   * @param {!RadioButton} checkedRadioButton
   * @protected
   */
  _selectIncButton(next, checkedRadioButton) {
    if (next) {
      this._selectNextButton(checkedRadioButton);
    } else {
      this._selectPreviousButton(checkedRadioButton);
    }
  }

  /**
   * @param {!RadioButton} element
   * @param {boolean=} setFocusRing
   * @protected
   */
  _selectButton(element, setFocusRing) {
    if (this._containsFocus()) {
      element.focus();
      if (setFocusRing) {
        element.setAttribute('focus-ring', '');
      }
    }
    this._changeSelectedButton(element, setFocusRing);
  }

  /**
   * @return {boolean}
   * @protected
   */
  _containsFocus() {
    const activeElement = this.getRootNode().activeElement;
    return this.contains(activeElement);
  }

  /**
   * @return {boolean}
   * @protected
   */
  _hasEnabledButtons() {
    return !this._radioButtons.every((button) => button.disabled);
  }

  /**
   * @param {!RadioButton} element
   * @protected
   */
  _selectNextButton(element) {
    if (!this._hasEnabledButtons()) {
      return;
    }

    var nextButton = element.nextElementSibling || this.firstElementChild;

    if (nextButton.disabled) {
      this._selectNextButton(nextButton);
    } else {
      this._selectButton(nextButton, true);
    }
  }

  /**
   * @param {!RadioButton} element
   * @protected
   */
  _selectPreviousButton(element) {
    if (!this._hasEnabledButtons()) {
      return;
    }

    var previousButton = element.previousElementSibling || this.lastElementChild;

    if (previousButton.disabled) {
      this._selectPreviousButton(previousButton);
    } else {
      this._selectButton(previousButton, true);
    }
  }

  /**
   * @param {RadioButton} button
   * @param {boolean=} fireChangeEvent
   * @protected
   */
  _changeSelectedButton(button, fireChangeEvent) {
    if (this._checkedButton === button) {
      return;
    }

    this._checkedButton = button;

    if (this._checkedButton) {
      this.value = this._checkedButton.value;
    }

    this._radioButtons.forEach((button) => {
      if (button === this._checkedButton) {
        if (fireChangeEvent) {
          button.click();
        } else {
          button.checked = true;
        }
      } else {
        button.checked = false;
      }
    });

    this.validate();
    this.readonly && this._updateDisableButtons();
    button && this._setFocusable(this._radioButtons.indexOf(button));
  }

  /** @private */
  _valueChanged(newV, oldV) {
    if (oldV && (newV === '' || newV === null || newV === undefined)) {
      this._changeSelectedButton(null);
      this.removeAttribute('has-value');
      return;
    }

    if (!this._checkedButton || newV != this._checkedButton.value) {
      const newCheckedButton = this._radioButtons.filter((button) => button.value == newV)[0];

      if (newCheckedButton) {
        this._selectButton(newCheckedButton);
        this.setAttribute('has-value', '');
      } else {
        console.warn(`No <vaadin-radio-button> with value ${newV} found.`);
      }
    }
  }

  /**
   * Returns true if `value` is valid.
   *
   * @return {boolean} True if the value is valid.
   */
  validate() {
    return !(this.invalid = !this.checkValidity());
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   * @return {boolean}
   */
  checkValidity() {
    return !this.required || !!this.value;
  }

  /**
   * @param {number} idx
   * @protected
   */
  _setFocusable(idx) {
    this._radioButtons.forEach((radioButton, radioButtonIdx) => {
      if (radioButtonIdx === idx) {
        radioButton.focusElement.removeAttribute('tabindex');
      } else {
        radioButton.focusElement.setAttribute('tabindex', '-1');
      }
    });
  }

  /** @private */
  _labelChanged(label) {
    this._setOrToggleAttribute('has-label', !!label);
  }

  /** @private */
  _errorMessageChanged(errorMessage) {
    this._setOrToggleAttribute('has-error-message', !!errorMessage);
  }

  /** @private */
  _helperTextChanged(helperText) {
    this._setOrToggleAttribute('has-helper', !!helperText);
  }

  /** @private */
  _setOrToggleAttribute(name, value) {
    if (!name) {
      return;
    }

    if (value) {
      this.setAttribute(name, typeof value === 'boolean' ? '' : value);
    } else {
      this.removeAttribute(name);
    }
  }

  /** @private */
  _setOrToggleHasHelperAttribute() {
    const slottedNodes = this.shadowRoot.querySelector(`[name="helper"]`).assignedNodes();
    // Only has slotted helper if not a text node
    // Text nodes are added by the helperText prop and not the helper slot
    // The filter is added due to shady DOM triggering this slotchange event on helperText prop change
    this._hasSlottedHelper = slottedNodes.filter((node) => node.nodeType !== 3).length > 0;

    this._setOrToggleAttribute('has-helper', this._hasSlottedHelper ? 'slotted' : !!this.helperText);
  }

  /** @private */
  _getActiveErrorId(invalid, errorMessage, errorId) {
    return errorMessage && invalid ? errorId : undefined;
  }

  /** @private */
  _getErrorMessageAriaHidden(invalid, errorMessage, errorId) {
    return (!this._getActiveErrorId(invalid, errorMessage, errorId)).toString();
  }

  _getHelperTextAriaHidden(helperText, helperTextId, hasSlottedHelper) {
    return (!(helperText || hasSlottedHelper)).toString();
  }
}

customElements.define(RadioGroupElement.is, RadioGroupElement);

export { RadioGroupElement };
