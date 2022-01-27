/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './vaadin-multi-select-combo-box-chip.js';
import './vaadin-multi-select-combo-box-container.js';
import './vaadin-multi-select-combo-box-internal.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxMixin } from './vaadin-multi-select-combo-box-mixin.js';

const multiSelectComboBox = css`
  [hidden] {
    display: none !important;
  }

  :host([has-value]) ::slotted(input:placeholder-shown) {
    color: transparent !important;
  }

  :host([has-value]:not([readonly])) [class$='container'] {
    width: auto;
  }

  [part='compact-mode-prefix'] {
    display: flex;
    align-items: center;
  }

  ::slotted(input) {
    flex-basis: 80px;
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'vaadin-multi-select-combo-box-styles'
});

/**
 * `<vaadin-multi-select-combo-box>` is a web component that wraps `<vaadin-combo-box>` and extends
 * its functionality to allow selecting multiple items, in addition to basic features.
 *
 * ```html
 * <vaadin-multi-select-combo-box id="comboBox"></vaadin-multi-select-combo-box>
 * ```
 *
 * ```js
 * const comboBox = document.querySelector('#comboBox');
 * comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
 * comboBox.selectedItems = ['lemon', 'orange'];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name              | Description
 * -----------------------|----------------
 * `chip`                 | Chip shown for every selected item in default mode
 * `compact-mode-prefix`  | The selected items counter shown in compact mode
 * `label`                | The label element
 * `input-field`          | The element that wraps prefix, value and suffix
 * `clear-button`         | The clear button
 * `error-message`        | The error message element
 * `helper-text`          | The helper text element wrapper
 * `required-indicator`   | The `required` state indicator element
 * `toggle-button`        | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute              | Description
 * -----------------------|-----------------
 * `compact-mode`         | Set when the element uses compact mode
 * `disabled`             | Set to a disabled element
 * `has-value`            | Set when the element has a value
 * `has-label`            | Set when the element has a label
 * `has-helper`           | Set when the element has helper text or slot
 * `has-error-message`    | Set when the element has an error message
 * `invalid`              | Set when the element is invalid
 * `focused`              | Set when the element is focused
 * `focus-ring`           | Set when the element is keyboard focused
 * `opened`               | Set when the dropdown is open
 * `ordered`              | Set when the element uses ordered mode
 * `readonly`             | Set to a readonly element
 *
 * ### Internal components
 *
 * In addition to `<vaadin-multi-select-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-multi-select-combo-box-overlay>` - has the same API as `<vaadin-overlay>`.
 * - `<vaadin-multi-select-combo-box-item>` - has the same API as `<vaadin-item>`.
 * - `<vaadin-multi-select-combo-box-container>` - has the same API as `<vaadin-input-container>`.
 *
 * Note: the `theme` attribute value set on `<vaadin-multi-select-combo-box>` is
 * propagated to these components.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-values-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-value-changed - Fired when the `filterValue` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes InputControlMixin
 * @mixes MultiSelectComboBoxMixin
 */
class MultiSelectComboBox extends MultiSelectComboBoxMixin(
  InputControlMixin(ThemableMixin(ElementMixin(PolymerElement)))
) {
  static get is() {
    return 'vaadin-multi-select-combo-box';
  }

  static get template() {
    return html`
      <div class="vaadin-multi-select-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-multi-select-combo-box-internal
          id="comboBox"
          items="[[items]]"
          item-id-path="[[itemIdPath]]"
          item-label-path="[[itemLabelPath]]"
          item-value-path="[[itemValuePath]]"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          allow-custom-value="[[allowCustomValues]]"
          data-provider="[[dataProvider]]"
          filter="{{filterValue}}"
          filtered-items="[[filteredItems]]"
          opened="{{opened}}"
          renderer="[[renderer]]"
          theme$="[[theme]]"
          suppress-template-warning
          on-combo-box-item-selected="_onComboBoxItemSelected"
          on-change="_onComboBoxChange"
          on-custom-value-set="_onCustomValueSet"
        >
          <vaadin-multi-select-combo-box-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[theme]]"
          >
            <div
              part="compact-mode-prefix"
              hidden$="[[_isCompactModeHidden(readonly, compactMode, _hasValue)]]"
              slot="prefix"
            >
              [[_getCompactModeLabel(selectedItems, compactModeLabelGenerator)]]
            </div>
            <template id="repeat" is="dom-repeat" items="[[selectedItems]]" slot="prefix">
              <vaadin-multi-select-combo-box-chip
                slot="prefix"
                part="chip"
                item="[[item]]"
                label="[[_getItemLabel(item, itemLabelPath)]]"
                hidden$="[[_isTokensHidden(readonly, compactMode, _hasValue)]]"
                on-item-removed="_onItemRemoved"
                on-mousedown="_preventBlur"
              ></vaadin-multi-select-combo-box-chip>
            </template>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix"></div>
          </vaadin-multi-select-combo-box-container>
        </vaadin-multi-select-combo-box-internal>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /**
       * When true, the component does not render chips for every selected value.
       * Instead, only the number of currently selected items is shown.
       * @attr {boolean} compact-mode
       */
      compactMode: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Custom function for generating the display label when in compact mode.
       *
       * This function receives the array of selected items and should return
       * a string value that will be used as the display label.
       */
      compactModeLabelGenerator: {
        type: Object
      },

      /**
       * Path for the value of the item. If `items` is an array of objects,
       * this property is used as a string value for the selected item.
       * @attr {string} item-value-path
       */
      itemValuePath: String,

      /**
       * Path for the id of the item, used to detect whether the item is selected.
       * @attr {string} item-id-path
       */
      itemIdPath: {
        type: String
      },

      /**
       * The list of selected items.
       * Note: modifying the selected items creates a new array each time.
       */
      selectedItems: {
        type: Array,
        value: () => [],
        notify: true
      },

      /**
       * True if the dropdown is open, false otherwise.
       */
      opened: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },

      /**
       * When true, the list of selected items is kept ordered in ascending lexical order.
       *
       * When `itemLabelPath` is specified, corresponding property is used for ordering.
       * Otherwise the items themselves are compared using `localCompare`.
       */
      ordered: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Number of items fetched at a time from the data provider.
       * @attr {number} page-size
       */
      pageSize: {
        type: Number,
        value: 50,
        observer: '_pageSizeChanged'
      },

      /**
       * Function that provides items lazily. Receives two arguments:
       *
       * - `params` - Object with the following properties:
       *   - `params.page` Requested page index
       *   - `params.pageSize` Current page size
       *   - `params.filter` Currently applied filter
       *
       * - `callback(items, size)` - Callback function with arguments:
       *   - `items` Current page of items
       *   - `size` Total number of items.
       */
      dataProvider: {
        type: Object,
        observer: '_dataProviderChanged'
      },

      /**
       * The join separator used for the 'display value' when in read-only mode.
       * @attr {string} readonly-value-separator
       */
      readonlyValueSeparator: {
        type: String,
        value: ', '
      },

      /**
       * When true, the user can input a value that is not present in the items list.
       * @attr {boolean} allow-custom-values
       */
      allowCustomValues: {
        type: Boolean,
        value: false
      },

      /**
       * Custom function for rendering the content of every item.
       * Receives three arguments:
       *
       * - `root` The `<vaadin-multi-select-combo-box-item>` internal container DOM element.
       * - `comboBox` The reference to the `<vaadin-combo-box>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.index` The index of the rendered item.
       *   - `model.item` The item.
       */
      renderer: Function,

      /**
       * Filtering string the user has typed into the input field.
       * @attr {string} filter-value
       */
      filterValue: {
        type: String,
        value: '',
        notify: true
      },

      /**
       * A subset of items, filtered based on the user input. Filtered items
       * can be assigned directly to omit the internal filtering functionality.
       * The items can be of either `String` or `Object` type.
       */
      filteredItems: Array,

      /** @protected */
      _hasValue: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return [
      '_selectedItemsChanged(selectedItems, selectedItems.*)',
      '_updateReadOnlyMode(inputElement, readonly, itemLabelPath, compactMode, readonlyValueSeparator, selectedItems, selectedItems.*)',
      '_updateItems(ordered, compactMode, itemLabelPath, selectedItems, selectedItems.*)'
    ];
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      })
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    processTemplates(this);
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    return this.required ? this._hasValue : true;
  }

  /**
   * Override method inherited from `InputMixin` to forward the input to combo-box.
   * @protected
   * @override
   */
  _inputElementChanged(input) {
    super._inputElementChanged(input);

    if (input) {
      this.$.comboBox._setInputElement(input);
    }
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
    }
  }

  /**
   * Override method inherited from `InputMixin`
   * to keep attribute after clearing the input.
   * @protected
   * @override
   */
  _toggleHasValue() {
    super._toggleHasValue(this._hasValue);
  }

  /** @private */
  _isCompactModeHidden(readonly, compactMode, hasValue) {
    return readonly || !compactMode || !hasValue;
  }

  /** @private */
  _isTokensHidden(readonly, compactMode, hasValue) {
    return readonly || compactMode || !hasValue;
  }

  /** @private */
  _updateItems(ordered, compactMode, itemLabelPath, selectedItems) {
    // Set title when in compact mode to indicate which items are selected.
    this.title = compactMode ? this._getDisplayValue(selectedItems, itemLabelPath, ', ') : undefined;

    if (ordered && !compactMode) {
      this._sortSelectedItems(selectedItems);
    }
  }

  /** @private */
  // eslint-disable-next-line max-params
  _updateReadOnlyMode(inputElement, readonly, itemLabelPath, compactMode, separator, selectedItems) {
    if (inputElement) {
      inputElement.value = readonly ? this._getReadonlyValue(selectedItems, itemLabelPath, compactMode, separator) : '';
    }
  }

  /** @private */
  _pageSizeChanged(pageSize, oldPageSize) {
    if (Math.floor(pageSize) !== pageSize || pageSize <= 0) {
      this.pageSize = oldPageSize;
      console.error('"pageSize" value must be an integer > 0');
    }

    this.$.comboBox.pageSize = this.pageSize;
  }

  /** @private */
  _selectedItemsChanged(selectedItems) {
    this._hasValue = Boolean(selectedItems && selectedItems.length);

    this._toggleHasValue();

    // Re-render chips
    this.__updateChips();

    // Re-render scroller
    this.$.comboBox.$.dropdown._scroller.__virtualizer.update();

    // Wait for chips to render
    requestAnimationFrame(() => {
      this.$.comboBox.$.dropdown._setOverlayWidth();
    });
  }

  /** @private */
  _getCompactModeLabel(items) {
    if (typeof this.compactModeLabelGenerator === 'function') {
      return this.compactModeLabelGenerator(items);
    }

    const suffix = items.length === 0 || items.length > 1 ? 'values' : 'value';
    return `${items.length} ${suffix}`;
  }

  /** @private */
  _getReadonlyValue(selectedItems, itemLabelPath, compactMode, readonlyValueSeparator) {
    return compactMode
      ? this._getCompactModeLabel(selectedItems)
      : this._getDisplayValue(selectedItems, itemLabelPath, readonlyValueSeparator);
  }

  /** @private */
  _getDisplayValue(selectedItems, itemLabelPath, valueSeparator) {
    return selectedItems.map((item) => this._getItemLabel(item, itemLabelPath)).join(valueSeparator);
  }

  /** @private */
  _findIndex(item, selectedItems, itemIdPath) {
    if (itemIdPath && item) {
      for (let index = 0; index < selectedItems.length; index++) {
        if (selectedItems[index] && selectedItems[index][itemIdPath] === item[itemIdPath]) {
          return index;
        }
      }
      return -1;
    }

    return selectedItems.indexOf(item);
  }

  /** @private */
  __clearFilter() {
    this.$.comboBox.clear();
  }

  /** @private */
  __removeItem(item) {
    const itemsCopy = [...this.selectedItems];
    itemsCopy.splice(itemsCopy.indexOf(item), 1);
    this.__updateSelection(itemsCopy);
  }

  /** @private */
  __selectItem(item) {
    const itemsCopy = [...this.selectedItems];

    const index = this._findIndex(item, itemsCopy, this.itemIdPath);
    if (index !== -1) {
      itemsCopy.splice(index, 1);
    } else {
      itemsCopy.push(item);
    }

    this.__updateSelection(itemsCopy);

    // Reset the overlay focused index.
    this.$.comboBox._focusedIndex = -1;

    // Suppress `value-changed` event.
    this.__clearFilter();
  }

  /** @private */
  _sortSelectedItems(selectedItems) {
    this.selectedItems = selectedItems.sort((item1, item2) => {
      const item1Str = String(this._getItemLabel(item1, this.itemLabelPath));
      const item2Str = String(this._getItemLabel(item2, this.itemLabelPath));
      return item1Str.localeCompare(item2Str);
    });

    this.__updateChips();
  }

  /** @private */
  __updateSelection(selectedItems) {
    this.selectedItems = selectedItems;

    this.validate();

    this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
  }

  /** @private */
  __updateChips() {
    this.$.repeat.render();
  }

  /**
   * Override method inherited from `ClearButtonMixin` and clear items.
   * @protected
   * @override
   */
  _onClearButtonClick(event) {
    event.stopPropagation();

    this.__updateSelection([]);
  }

  /**
   * Override an event listener from `KeyboardMixin`.
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    const items = this.selectedItems || [];
    if (!this.compactMode && event.key === 'Backspace' && items.length && this.inputElement.value === '') {
      this.__removeItem(items[items.length - 1]);
    }
  }

  /** @private */
  _onComboBoxChange() {
    const item = this.$.comboBox.selectedItem;
    if (item) {
      this.__selectItem(item);
    }
  }

  /** @private */
  _onComboBoxItemSelected(event) {
    this.__selectItem(event.detail.item);
  }

  /** @private */
  _onCustomValueSet(event) {
    // Do not set combo-box value
    event.preventDefault();

    this.__clearFilter();

    this.dispatchEvent(
      new CustomEvent('custom-values-set', {
        detail: event.detail,
        composed: true,
        bubbles: true
      })
    );
  }

  /** @private */
  _onItemRemoved(event) {
    this.__removeItem(event.detail.item);
  }

  /** @private */
  _preventBlur(event) {
    // Prevent mousedown event to keep the input focused
    // and keep the overlay opened when clicking a chip.
    event.preventDefault();
  }
}

customElements.define(MultiSelectComboBox.is, MultiSelectComboBox);

export { MultiSelectComboBox };
