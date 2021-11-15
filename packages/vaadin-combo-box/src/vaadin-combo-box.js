/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';
import '@vaadin/vaadin-text-field/src/vaadin-text-field.js';
import './vaadin-combo-box-dropdown-wrapper.js';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';

/**
 * `<vaadin-combo-box>` is a combo box element combining a dropdown list with an
 * input field for filtering the list of items. If you want to replace the default
 * input field with a custom implementation, you should use the
 * [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light) element.
 *
 * Items in the dropdown list must be provided as a list of `String` values.
 * Defining the items is done using the `items` property, which can be assigned
 * with data-binding, using an attribute or directly with the JavaScript property.
 *
 * ```html
 * <vaadin-combo-box
 *     label="Fruit"
 *     items="[[data]]">
 * </vaadin-combo-box>
 * ```
 *
 * ```js
 * combobox.items = ['apple', 'orange', 'banana'];
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Item rendering
 *
 * `<vaadin-combo-box>` supports using custom renderer callback function for defining the
 * content of `<vaadin-combo-box-item>`.
 *
 * The renderer function provides `root`, `comboBox`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `comboBox`. Before generating new
 * content, users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-combo-box id="combo-box"></vaadin-combo-box>
 * ```
 * ```js
 * const comboBox = document.querySelector('#combo-box');
 * comboBox.items = [{'label': 'Hydrogen', 'value': 'H'}];
 * comboBox.renderer = function(root, comboBox, model) {
 *   root.innerHTML = model.index + ': ' +
 *                    model.item.label + ' ' +
 *                    '<b>' + model.item.value + '</b>';
 * };
 * ```
 *
 * Renderer is called on the opening of the combo-box and each time the related model is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * The following properties are available in the `model` argument:
 *
 * Property name | Type | Description
 * --------------|------|------------
 * `index`| Number | Index of the item in the `items` array
 * `item` | String or Object | The item reference
 * `selected` | Boolean | True when item is selected
 * `focused` | Boolean | True when item is focused
 *
 * ### Lazy Loading with Function Data Provider
 *
 * In addition to assigning an array to the items property, you can alternatively
 * provide the `<vaadin-combo-box>` data through the
 * [`dataProvider`](#/elements/vaadin-combo-box#property-dataProvider) function property.
 * The `<vaadin-combo-box>` calls this function lazily, only when it needs more data
 * to be displayed.
 *
 * See the [`dataProvider`](#/elements/vaadin-combo-box#property-dataProvider) in
 * the API reference below for the detailed data provider arguments description,
 * and the “Lazy Loading“ example on “Basics” page in the demos.
 *
 * __Note that when using function data providers, the total number of items
 * needs to be set manually. The total number of items can be returned
 * in the second argument of the data provider callback:__
 *
 * ```javascript
 * comboBox.dataProvider = function(params, callback) {
 *   var url = 'https://api.example/data' +
 *       '?page=' + params.page +        // the requested page index
 *       '&per_page=' + params.pageSize; // number of items on the page
 *   var xhr = new XMLHttpRequest();
 *   xhr.onload = function() {
 *     var response = JSON.parse(xhr.responseText);
 *     callback(
 *       response.employees, // requested page of items
 *       response.totalSize  // total number of items
 *     );
 *   };
 *   xhr.open('GET', url, true);
 *   xhr.send();
 * };
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vaadin-combo-box-overlay-max-height` | Property that determines the max height of overlay | `65vh`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `text-field` | The text field
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `opened` | Set when the combo box dropdown is open | :host
 * `disabled` | Set to a disabled combo box | :host
 * `readonly` | Set to a read only combo box | :host
 * `has-value` | Set when the element has a value | :host
 * `invalid` | Set when the element is invalid | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `loading` | Set when new items are expected | :host
 *
 * ### Internal components
 *
 * In addition to `<vaadin-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-combo-box-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - [`<vaadin-text-field>`](#/elements/vaadin-text-field)
 * - `<vaadin-combo-box-item>`
 *
 * Note: the `theme` attribute value set on `<vaadin-combo-box>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-item-changed - Fired when the `selectedItem` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControlStateMixin
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 * @mixes ThemableMixin
 */
class ComboBoxElement extends ElementMixin(
  ControlStateMixin(ThemableMixin(ComboBoxDataProviderMixin(ComboBoxMixin(PolymerElement))))
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

      <vaadin-text-field
        part="text-field"
        id="input"
        pattern="[[pattern]]"
        prevent-invalid-input="[[preventInvalidInput]]"
        value="{{_inputElementValue}}"
        autocomplete="off"
        invalid="[[invalid]]"
        label="[[label]]"
        name="[[name]]"
        placeholder="[[placeholder]]"
        required="[[required]]"
        disabled="[[disabled]]"
        readonly="[[readonly]]"
        helper-text="[[helperText]]"
        error-message="[[errorMessage]]"
        autocapitalize="none"
        autofocus="[[autofocus]]"
        on-change="_stopPropagation"
        on-input="_inputValueChanged"
        clear-button-visible="[[clearButtonVisible]]"
        theme$="[[theme]]"
      >
        <slot name="prefix" slot="prefix"></slot>
        <slot name="helper" slot="helper">[[helperText]]</slot>

        <div part="toggle-button" id="toggleButton" slot="suffix" role="button" aria-label="Toggle"></div>
      </vaadin-text-field>

      <vaadin-combo-box-dropdown-wrapper
        id="overlay"
        opened="[[opened]]"
        renderer="[[renderer]]"
        position-target="[[_getPositionTarget()]]"
        _focused-index="[[_focusedIndex]]"
        _item-id-path="[[itemIdPath]]"
        _item-label-path="[[itemLabelPath]]"
        loading="[[loading]]"
        theme="[[theme]]"
      ></vaadin-combo-box-dropdown-wrapper>
    `;
  }

  constructor() {
    super();
    /**
     * @property
     */
    this.theme;
  }

  static get is() {
    return 'vaadin-combo-box';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * The label for this element.
       */
      label: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Set to true to mark the input as required.
       * @type {boolean}
       */
      required: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to disable this input.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to prevent the user from entering invalid input.
       * @attr {boolean} prevent-invalid-input
       */
      preventInvalidInput: {
        type: Boolean
      },

      /**
       * A pattern to validate the `input` with.
       */
      pattern: {
        type: String
      },

      /**
       * The error message to display when the input is invalid.
       * @attr {string} error-message
       */
      errorMessage: {
        type: String
      },

      /** @type {boolean} */
      autofocus: {
        type: Boolean
      },

      /**
       * A placeholder string in addition to the label.
       * @type {string}
       */
      placeholder: {
        type: String,
        value: ''
      },

      /**
       * String used for the helper text.
       * @attr {string} helper-text
       */
      helperText: {
        type: String,
        value: ''
      },

      /**
       * Set to true to prevent the user from picking a value or typing in the input.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Set to true to display the clear icon which clears the input.
       * @attr {boolean} clear-button-visible
       * @type {boolean}
       */
      clearButtonVisible: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return ['_updateAriaExpanded(opened)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this._nativeInput = this.inputElement.focusElement;
    this._toggleElement = this.$.toggleButton;
    this._clearElement = this.inputElement.shadowRoot.querySelector('[part="clear-button"]');

    // Stop propagation of Esc in capturing phase so that
    // vaadin-text-field will not handle Esc as a shortcut
    // to clear the value.
    // We need to set this listener for "this.inputElement"
    // instead of just "this", otherwise keyboard navigation behaviour
    // breaks a bit on Safari and some related tests fail.
    this.inputElement.addEventListener(
      'keydown',
      (e) => {
        if (e.keyCode === 27) {
          this._stopPropagation(e);
          // Trigger _onEscape method of vaadin-combo-box-mixin because
          // bubbling phase is not reached.
          this._onEscape(e);
        }
      },
      true
    );

    this._nativeInput.setAttribute('role', 'combobox');
    this._nativeInput.setAttribute('aria-autocomplete', 'list');
    this._updateAriaExpanded();
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._preventInputBlur();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._restoreInputBlur();
  }

  /** @private */
  _getPositionTarget() {
    return this.$.input;
  }

  /** @private */
  _updateAriaExpanded() {
    if (this._nativeInput) {
      this._nativeInput.setAttribute('aria-expanded', this.opened);
      this._toggleElement.setAttribute('aria-expanded', this.opened);
    }
  }

  /** @return {!TextFieldElement | undefined} */
  get inputElement() {
    return this.$.input;
  }

  /**
   * Focusable element used by vaadin-control-state-mixin
   * @return {!HTMLElement}
   */
  get focusElement() {
    // inputElement might not be defined on property changes before ready.
    return this.inputElement || this;
  }
}

customElements.define(ComboBoxElement.is, ComboBoxElement);

export { ComboBoxElement };
