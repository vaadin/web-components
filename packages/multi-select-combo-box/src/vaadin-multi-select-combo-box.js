/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-chip.js';
import './vaadin-multi-select-combo-box-container.js';
import './vaadin-multi-select-combo-box-internal.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { announce } from '@vaadin/component-base/src/a11y-announcer.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBox = css`
  :host {
    --input-min-width: var(--vaadin-multi-select-combo-box-input-min-width, 4em);
  }

  [hidden] {
    display: none !important;
  }

  #chips {
    display: flex;
    align-items: center;
  }

  ::slotted(input) {
    box-sizing: border-box;
    flex: 1 0 var(--input-min-width);
  }

  [part='chip'] {
    flex: 0 1 auto;
  }

  :host(:is([readonly], [disabled])) ::slotted(input) {
    flex-grow: 0;
    flex-basis: 0;
    padding: 0;
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'vaadin-multi-select-combo-box-styles',
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
 * `chips`                | The element that wraps chips for selected items
 * `chip`                 | Chip shown for every selected item
 * `label`                | The label element
 * `input-field`          | The element that wraps prefix, value and suffix
 * `clear-button`         | The clear button
 * `error-message`        | The error message element
 * `helper-text`          | The helper text element wrapper
 * `required-indicator`   | The `required` state indicator element
 * `overflow`             | The chip shown when component width is not enough to fit all chips
 * `overflow-one`         | Set on the overflow chip when only one chip does not fit
 * `overflow-two`         | Set on the overflow chip when two chips do not fit
 * `toggle-button`        | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute              | Description
 * -----------------------|-----------------
 * `disabled`             | Set to a disabled element
 * `has-value`            | Set when the element has a value
 * `has-label`            | Set when the element has a label
 * `has-helper`           | Set when the element has helper text or slot
 * `has-error-message`    | Set when the element has an error message
 * `invalid`              | Set when the element is invalid
 * `focused`              | Set when the element is focused
 * `focus-ring`           | Set when the element is keyboard focused
 * `loading`              | Set when loading items from the data provider
 * `opened`               | Set when the dropdown is open
 * `readonly`             | Set to a readonly element
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom property                                      | Description                | Default
 * -----------------------------------------------------|----------------------------|--------
 * `--vaadin-field-default-width`                       | Default width of the field | `12em`
 * `--vaadin-multi-select-combo-box-overlay-width`      | Width of the overlay       | `auto`
 * `--vaadin-multi-select-combo-box-overlay-max-height` | Max height of the overlay  | `65vh`
 * `--vaadin-multi-select-combo-box-input-min-width`    | Min width of the input     | `4em`
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes InputControlMixin
 * @mixes ResizeMixin
 */
class MultiSelectComboBox extends ResizeMixin(InputControlMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
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
          items="[[__effectiveItems]]"
          item-id-path="[[itemIdPath]]"
          item-label-path="[[itemLabelPath]]"
          item-value-path="[[itemValuePath]]"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          allow-custom-value="[[allowCustomValue]]"
          data-provider="[[dataProvider]]"
          filter="{{filter}}"
          last-filter="{{_lastFilter}}"
          loading="{{loading}}"
          size="{{size}}"
          filtered-items="[[__effectiveFilteredItems]]"
          selected-items="[[selectedItems]]"
          opened="{{opened}}"
          renderer="[[renderer]]"
          theme$="[[_theme]]"
          on-combo-box-item-selected="_onComboBoxItemSelected"
          on-change="_onComboBoxChange"
          on-custom-value-set="_onCustomValueSet"
          on-filtered-items-changed="_onFilteredItemsChanged"
        >
          <vaadin-multi-select-combo-box-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[_theme]]"
          >
            <vaadin-multi-select-combo-box-chip
              id="overflow"
              slot="prefix"
              part$="[[_getOverflowPart(_overflowItems.length)]]"
              disabled="[[disabled]]"
              readonly="[[readonly]]"
              label="[[_getOverflowLabel(_overflowItems.length)]]"
              title$="[[_getOverflowTitle(_overflowItems)]]"
              hidden$="[[_isOverflowHidden(_overflowItems.length)]]"
              on-mousedown="_preventBlur"
            ></vaadin-multi-select-combo-box-chip>
            <div id="chips" part="chips" slot="prefix"></div>
            <slot name="input"></slot>
            <div
              id="clearButton"
              part="clear-button"
              slot="suffix"
              on-touchend="_onClearButtonTouchend"
              aria-hidden="true"
            ></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix" aria-hidden="true"></div>
          </vaadin-multi-select-combo-box-container>
        </vaadin-multi-select-combo-box-internal>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
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
       * Set to true to display the clear icon which clears the input.
       * @attr {boolean} clear-button-visible
       */
      clearButtonVisible: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_clearButtonVisibleChanged',
        value: false,
      },

      /**
       * A full set of items to filter the visible options from.
       * The items can be of either `String` or `Object` type.
       */
      items: {
        type: Array,
      },

      /**
       * The item property used for a visual representation of the item.
       * @attr {string} item-label-path
       */
      itemLabelPath: {
        type: String,
        value: 'label',
      },

      /**
       * Path for the value of the item. If `items` is an array of objects,
       * this property is used as a string value for the selected item.
       * @attr {string} item-value-path
       */
      itemValuePath: {
        type: String,
        value: 'value',
      },

      /**
       * Path for the id of the item, used to detect whether the item is selected.
       * @attr {string} item-id-path
       */
      itemIdPath: {
        type: String,
      },

      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure and default values:
       * ```
       * {
       *   // Screen reader announcement on clear button click.
       *   cleared: 'Selection cleared',
       *   // Screen reader announcement when a chip is focused.
       *   focused: ' focused. Press Backspace to remove',
       *   // Screen reader announcement when item is selected.
       *   selected: 'added to selection',
       *   // Screen reader announcement when item is deselected.
       *   deselected: 'removed from selection',
       *   // Screen reader announcement of the selected items count.
       *   // {count} is replaced with the actual count of items.
       *   total: '{count} items selected',
       * }
       * ```
       * @type {!MultiSelectComboBoxI18n}
       * @default {English/US}
       */
      i18n: {
        type: Object,
        value: () => {
          return {
            cleared: 'Selection cleared',
            focused: 'focused. Press Backspace to remove',
            selected: 'added to selection',
            deselected: 'removed from selection',
            total: '{count} items selected',
          };
        },
      },

      /**
       * True when loading items from the data provider, false otherwise.
       */
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * When present, it specifies that the field is read-only.
       */
      readonly: {
        type: Boolean,
        value: false,
        observer: '_readonlyChanged',
        reflectToAttribute: true,
      },

      /**
       * The list of selected items.
       * Note: modifying the selected items creates a new array each time.
       */
      selectedItems: {
        type: Array,
        value: () => [],
        notify: true,
      },

      /**
       * True if the dropdown is open, false otherwise.
       */
      opened: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Total number of items.
       */
      size: {
        type: Number,
      },

      /**
       * Number of items fetched at a time from the data provider.
       * @attr {number} page-size
       */
      pageSize: {
        type: Number,
        value: 50,
        observer: '_pageSizeChanged',
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
      },

      /**
       * When true, the user can input a value that is not present in the items list.
       * @attr {boolean} allow-custom-value
       */
      allowCustomValue: {
        type: Boolean,
        value: false,
      },

      /**
       * A hint to the user of what can be entered in the control.
       * The placeholder will be only displayed in the case when
       * there is no item selected.
       */
      placeholder: {
        type: String,
        value: '',
        observer: '_placeholderChanged',
      },

      /**
       * Custom function for rendering the content of every item.
       * Receives three arguments:
       *
       * - `root` The `<vaadin-multi-select-combo-box-item>` internal container DOM element.
       * - `comboBox` The reference to the `<vaadin-multi-select-combo-box>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.index` The index of the rendered item.
       *   - `model.item` The item.
       */
      renderer: Function,

      /**
       * Filtering string the user has typed into the input field.
       */
      filter: {
        type: String,
        value: '',
        notify: true,
      },

      /**
       * A subset of items, filtered based on the user input. Filtered items
       * can be assigned directly to omit the internal filtering functionality.
       * The items can be of either `String` or `Object` type.
       */
      filteredItems: Array,

      /** @private */
      value: {
        type: String,
      },

      /** @private */
      __effectiveItems: {
        type: Array,
        computed: '__computeEffectiveItems(items, selectedItems, readonly)',
      },

      /** @private */
      __effectiveFilteredItems: {
        type: Array,
        computed: '__computeEffectiveFilteredItems(items, filteredItems, selectedItems, readonly)',
      },

      /** @private */
      _overflowItems: {
        type: Array,
        value: () => [],
      },

      /** @private */
      _focusedChipIndex: {
        type: Number,
        value: -1,
        observer: '_focusedChipIndexChanged',
      },

      /** @private */
      _lastFilter: {
        type: String,
      },
    };
  }

  static get observers() {
    return ['_selectedItemsChanged(selectedItems, selectedItems.*)'];
  }

  /** @protected */
  get slotStyles() {
    const tag = this.localName;
    return [
      ...super.slotStyles,
      `
        ${tag}[has-value] input::placeholder {
          color: transparent !important;
        }
      `,
    ];
  }

  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  get _chips() {
    return this.shadowRoot.querySelectorAll('[part~="chip"]');
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
      }),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
    this._tooltipController.setShouldShow((target) => !target.opened);

    this._inputField = this.shadowRoot.querySelector('[part="input-field"]');
    this.__updateChips();

    processTemplates(this);
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    return this.required && !this.readonly ? this._hasValue : true;
  }

  /**
   * Clears the selected items.
   */
  clear() {
    this.__updateSelection([]);

    announce(this.i18n.cleared);
  }

  /**
   * Clears the cached pages and reloads data from data provider when needed.
   */
  clearCache() {
    if (this.$ && this.$.comboBox) {
      this.$.comboBox.clearCache();
    }
  }

  /**
   * Requests an update for the content of items.
   * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this.$ && this.$.comboBox) {
      this.$.comboBox.requestContentUpdate();
    }
  }

  /**
   * Override method inherited from `DisabledMixin` to forward disabled to chips.
   * @protected
   * @override
   */
  _disabledChanged(disabled, oldDisabled) {
    super._disabledChanged(disabled, oldDisabled);

    if (disabled || oldDisabled) {
      this.__updateChips();
    }
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
      this._focusedChipIndex = -1;
      this.validate();
    }
  }

  /**
   * Implement callback from `ResizeMixin` to update chips.
   * @protected
   * @override
   */
  _onResize() {
    this.__updateChips();
  }

  /**
   * Override method from `DelegateStateMixin` to set required state
   * using `aria-required` attribute instead of `required`, in order
   * to prevent screen readers from announcing "invalid entry".
   * @protected
   * @override
   */
  _delegateAttribute(name, value) {
    if (!this.stateTarget) {
      return;
    }

    if (name === 'required') {
      this._delegateAttribute('aria-required', value ? 'true' : false);
      return;
    }

    super._delegateAttribute(name, value);
  }

  /**
   * Setting clear button visible reduces total space available
   * for rendering chips, and making it hidden increases it.
   * @private
   */
  _clearButtonVisibleChanged(visible, oldVisible) {
    if (visible || oldVisible) {
      this.__updateChips();
    }
  }

  /**
   * Implement two-way binding for the `filteredItems` property
   * that can be set on the internal combo-box element.
   *
   * @param {CustomEvent} event
   * @private
   */
  _onFilteredItemsChanged(event) {
    const { value } = event.detail;
    if (Array.isArray(value) || value == null) {
      this.filteredItems = value;
    }
  }

  /** @private */
  _readonlyChanged(readonly, oldReadonly) {
    if (readonly || oldReadonly) {
      this.__updateChips();
    }

    if (this.dataProvider) {
      this.clearCache();
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
  _placeholderChanged(placeholder) {
    const tmpPlaceholder = this.__tmpA11yPlaceholder;
    // Do not store temporary placeholder
    if (tmpPlaceholder !== placeholder) {
      this.__savedPlaceholder = placeholder;

      if (tmpPlaceholder) {
        this.placeholder = tmpPlaceholder;
      }
    }
  }

  /** @private */
  _selectedItemsChanged(selectedItems) {
    this._toggleHasValue(this._hasValue);

    // Use placeholder for announcing items
    if (this._hasValue) {
      const tmpPlaceholder = this._mergeItemLabels(selectedItems);
      this.__tmpA11yPlaceholder = tmpPlaceholder;
      this.placeholder = tmpPlaceholder;
    } else {
      delete this.__tmpA11yPlaceholder;
      this.placeholder = this.__savedPlaceholder;
    }

    // Re-render chips
    this.__updateChips();

    // Update selected for dropdown items
    this.requestContentUpdate();
  }

  /** @private */
  _getItemLabel(item) {
    return this.$.comboBox._getItemLabel(item);
  }

  /** @private */
  _getOverflowLabel(length) {
    return length;
  }

  /** @private */
  _getOverflowPart(length) {
    let part = `chip overflow`;

    if (length === 1) {
      part += ' overflow-one';
    } else if (length === 2) {
      part += ' overflow-two';
    }

    return part;
  }

  /** @private */
  _getOverflowTitle(items) {
    return this._mergeItemLabels(items);
  }

  /** @private */
  _isOverflowHidden(length) {
    return length === 0;
  }

  /** @private */
  _mergeItemLabels(items) {
    return items.map((item) => this._getItemLabel(item)).join(', ');
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
    this.filter = '';
    this.$.comboBox.clear();
  }

  /** @private */
  __announceItem(itemLabel, isSelected, itemCount) {
    const state = isSelected ? 'selected' : 'deselected';
    const total = this.i18n.total.replace('{count}', itemCount || 0);
    announce(`${itemLabel} ${this.i18n[state]} ${total}`);
  }

  /** @private */
  __removeItem(item) {
    const itemsCopy = [...this.selectedItems];
    itemsCopy.splice(itemsCopy.indexOf(item), 1);
    this.__updateSelection(itemsCopy);
    const itemLabel = this._getItemLabel(item);
    this.__announceItem(itemLabel, false, itemsCopy.length);
  }

  /** @private */
  __selectItem(item) {
    const itemsCopy = [...this.selectedItems];

    const index = this._findIndex(item, itemsCopy, this.itemIdPath);
    const itemLabel = this._getItemLabel(item);

    let isSelected = false;

    if (index !== -1) {
      const lastFilter = this._lastFilter;
      // Do not unselect when manually typing and committing an already selected item.
      if (lastFilter && lastFilter.toLowerCase() === itemLabel.toLowerCase()) {
        this.__clearFilter();
        return;
      }

      itemsCopy.splice(index, 1);
    } else {
      itemsCopy.push(item);
      isSelected = true;
    }

    this.__updateSelection(itemsCopy);

    // Suppress `value-changed` event.
    this.__clearFilter();

    this.__announceItem(itemLabel, isSelected, itemsCopy.length);
  }

  /** @private */
  __updateSelection(selectedItems) {
    this.selectedItems = selectedItems;

    this.validate();

    this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
  }

  /** @private */
  __createChip(item) {
    const chip = document.createElement('vaadin-multi-select-combo-box-chip');
    chip.setAttribute('part', 'chip');
    chip.setAttribute('slot', 'prefix');

    chip.item = item;
    chip.disabled = this.disabled;
    chip.readonly = this.readonly;

    const label = this._getItemLabel(item);
    chip.label = label;
    chip.setAttribute('title', label);

    chip.addEventListener('item-removed', (e) => this._onItemRemoved(e));
    chip.addEventListener('mousedown', (e) => this._preventBlur(e));

    return chip;
  }

  /** @private */
  __getOverflowWidth() {
    const chip = this.$.overflow;

    chip.style.visibility = 'hidden';
    chip.removeAttribute('hidden');

    // Detect max possible width of the overflow chip
    chip.setAttribute('part', 'chip overflow');
    const overflowStyle = getComputedStyle(chip);
    const overflowWidth = chip.clientWidth + parseInt(overflowStyle.marginInlineStart);

    chip.setAttribute('hidden', '');
    chip.style.visibility = '';

    return overflowWidth;
  }

  /** @private */
  __updateChips() {
    if (!this._inputField || !this.inputElement) {
      return;
    }

    // Clear all chips except the overflow
    Array.from(this._chips).forEach((chip) => {
      if (chip !== this.$.overflow) {
        chip.remove();
      }
    });

    const items = [...this.selectedItems];

    // Detect available remaining width for chips
    const totalWidth = this._inputField.$.wrapper.clientWidth;
    const inputWidth = parseInt(getComputedStyle(this.inputElement).flexBasis);

    let remainingWidth = totalWidth - inputWidth;

    if (items.length > 1) {
      remainingWidth -= this.__getOverflowWidth();
    }

    // Add chips until remaining width is exceeded
    for (let i = items.length - 1, refNode = null; i >= 0; i--) {
      const chip = this.__createChip(items[i]);
      this.$.chips.insertBefore(chip, refNode);

      if (this.$.chips.clientWidth > remainingWidth) {
        chip.remove();
        break;
      }

      items.pop();
      refNode = chip;
    }

    this._overflowItems = items;
  }

  /** @private */
  _onClearButtonTouchend(event) {
    // Cancel the following click and focus events
    event.preventDefault();

    this.clear();
  }

  /**
   * Override method inherited from `InputControlMixin` and clear items.
   * @protected
   * @override
   */
  _onClearButtonClick(event) {
    event.stopPropagation();

    this.clear();
  }

  /**
   * Override an event listener from `InputControlMixin` to
   * stop the change event re-targeted from the input.
   *
   * @param {!Event} event
   * @protected
   * @override
   */
  _onChange(event) {
    event.stopPropagation();
  }

  /**
   * Override an event listener from `KeyboardMixin`.
   * Do not call `super` in order to override clear
   * button logic defined in `InputControlMixin`.
   *
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onEscape(event) {
    if (this.clearButtonVisible && this.selectedItems && this.selectedItems.length) {
      event.stopPropagation();
      this.selectedItems = [];
    }
  }

  /**
   * Override an event listener from `KeyboardMixin`.
   * @param {KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    super._onKeyDown(event);

    const chips = Array.from(this._chips).slice(1);

    if (!this.readonly && chips.length > 0) {
      switch (event.key) {
        case 'Backspace':
          this._onBackSpace(chips);
          break;
        case 'ArrowLeft':
          this._onArrowLeft(chips, event);
          break;
        case 'ArrowRight':
          this._onArrowRight(chips, event);
          break;
        default:
          this._focusedChipIndex = -1;
          break;
      }
    }
  }

  /** @private */
  _onArrowLeft(chips, event) {
    if (this.inputElement.selectionStart !== 0) {
      return;
    }

    const idx = this._focusedChipIndex;
    if (idx !== -1) {
      event.preventDefault();
    }
    let newIdx;

    if (this.getAttribute('dir') !== 'rtl') {
      if (idx === -1) {
        // Focus last chip
        newIdx = chips.length - 1;
      } else if (idx > 0) {
        // Focus prev chip
        newIdx = idx - 1;
      }
    } else if (idx === chips.length - 1) {
      // Blur last chip
      newIdx = -1;
    } else if (idx > -1) {
      // Focus next chip
      newIdx = idx + 1;
    }

    if (newIdx !== undefined) {
      this._focusedChipIndex = newIdx;
    }
  }

  /** @private */
  _onArrowRight(chips, event) {
    if (this.inputElement.selectionStart !== 0) {
      return;
    }

    const idx = this._focusedChipIndex;
    if (idx !== -1) {
      event.preventDefault();
    }
    let newIdx;

    if (this.getAttribute('dir') === 'rtl') {
      if (idx === -1) {
        // Focus last chip
        newIdx = chips.length - 1;
      } else if (idx > 0) {
        // Focus prev chip
        newIdx = idx - 1;
      }
    } else if (idx === chips.length - 1) {
      // Blur last chip
      newIdx = -1;
    } else if (idx > -1) {
      // Focus next chip
      newIdx = idx + 1;
    }

    if (newIdx !== undefined) {
      this._focusedChipIndex = newIdx;
    }
  }

  /** @private */
  _onBackSpace(chips) {
    if (this.inputElement.selectionStart !== 0) {
      return;
    }

    const idx = this._focusedChipIndex;
    if (idx === -1) {
      this._focusedChipIndex = chips.length - 1;
    } else {
      this.__removeItem(chips[idx].item);
      this._focusedChipIndex = -1;
    }
  }

  /** @private */
  _focusedChipIndexChanged(focusedIndex, oldFocusedIndex) {
    if (focusedIndex > -1 || oldFocusedIndex > -1) {
      const chips = Array.from(this._chips).slice(1);
      chips.forEach((chip, index) => {
        chip.toggleAttribute('focused', index === focusedIndex);
      });

      // Announce focused chip
      if (focusedIndex > -1) {
        const item = chips[focusedIndex].item;
        const itemLabel = this._getItemLabel(item);
        announce(`${itemLabel} ${this.i18n.focused}`);
      }
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

    // Stop the original event
    event.stopPropagation();

    this.__clearFilter();

    this.dispatchEvent(
      new CustomEvent('custom-value-set', {
        detail: event.detail,
        composed: true,
        bubbles: true,
      }),
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

  /** @private */
  __computeEffectiveItems(items, selectedItems, readonly) {
    return items && readonly ? selectedItems : items;
  }

  /** @private */
  __computeEffectiveFilteredItems(items, filteredItems, selectedItems, readonly) {
    return !items && readonly ? selectedItems : filteredItems;
  }

  /**
   * Override a method from `InputMixin` to
   * compute the presence of value based on `selectedItems`.
   *
   * @protected
   * @override
   */
  get _hasValue() {
    return this.selectedItems && this.selectedItems.length > 0;
  }
}

customElements.define(MultiSelectComboBox.is, MultiSelectComboBox);

export { MultiSelectComboBox };
