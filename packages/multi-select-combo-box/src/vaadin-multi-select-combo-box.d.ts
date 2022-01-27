/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxDataProvider, ComboBoxDefaultItem, ComboBoxRenderer } from '@vaadin/combo-box/src/vaadin-combo-box.js';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixinClass } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxMixinClass } from './vaadin-multi-select-combo-box-mixin.js';

export type MultiSelectComboBoxCompactModeLabelGenerator<TItem> = (items: Array<TItem>) => string;

/**
 * Fired when the user commits a value change.
 */
export type MultiSelectComboBoxChangeEvent<TItem> = Event & {
  target: MultiSelectComboBox<TItem>;
};

/**
 * Fired when the user sets a custom value.
 */
export type MultiSelectComboBoxCustomValuesSetEvent = CustomEvent<string>;

/**
 * Fired when the `filterValue` property changes.
 */
export type MultiSelectComboBoxFilterValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `invalid` property changes.
 */
export type MultiSelectComboBoxInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `selectedItems` property changes.
 */
export type MultiSelectComboBoxSelectedItemsChangedEvent<TItem> = CustomEvent<{ value: Array<TItem> }>;

export interface MultiSelectComboBoxEventMap<TItem> extends HTMLElementEventMap {
  change: MultiSelectComboBoxChangeEvent<TItem>;

  'custom-values-set': MultiSelectComboBoxCustomValuesSetEvent;

  'filter-value-changed': MultiSelectComboBoxFilterValueChangedEvent;

  'invalid-changed': MultiSelectComboBoxInvalidChangedEvent;

  'selected-items-changed': MultiSelectComboBoxSelectedItemsChangedEvent<TItem>;
}

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
 */
declare class MultiSelectComboBox<TItem = ComboBoxDefaultItem> extends HTMLElement {
  /**
   * When true, the user can input a value that is not present in the items list.
   * @attr {boolean} allow-custom-values
   */
  allowCustomValues: boolean;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean;

  /**
   * When true, the component does not render chips for every selected value.
   * Instead, only the number of currently selected items is shown.
   * @attr {boolean} compact-mode
   */
  compactMode: boolean;

  /**
   * Custom function for generating the display label when in compact mode.
   *
   * This function receives the array of selected items and should return
   * a string value that will be used as the display label.
   */
  compactModeLabelGenerator: MultiSelectComboBoxCompactModeLabelGenerator<TItem>;

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
  dataProvider: ComboBoxDataProvider<TItem> | null | undefined;

  /**
   * A subset of items, filtered based on the user input. Filtered items
   * can be assigned directly to omit the internal filtering functionality.
   * The items can be of either `String` or `Object` type.
   */
  filteredItems: Array<TItem> | undefined;

  /**
   * Filtering string the user has typed into the input field.
   * @attr {string} filter-value
   */
  filterValue: string;

  /**
   * Path for the id of the item, used to detect whether the item is selected.
   * @attr {string} item-id-path
   */
  itemIdPath: string;

  /**
   * Path for the value of the item. If `items` is an array of objects,
   * this property is used as a string value for the selected item.
   * @attr {string} item-value-path
   */
  itemValuePath: string;

  /**
   * True if the dropdown is open, false otherwise.
   */
  opened: boolean;

  /**
   * When true, the list of selected items is kept ordered in ascending lexical order.
   *
   * When `itemLabelPath` is specified, corresponding property is used for ordering.
   * Otherwise the items themselves are compared using `localCompare`.
   */
  ordered: boolean;

  /**
   * Number of items fetched at a time from the data provider.
   * @attr {number} page-size
   */
  pageSize: number;

  /**
   * The join separator used for the 'display value' when in read-only mode.
   * @attr {string} readonly-value-separator
   */
  readonlyValueSeparator: string;

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
  renderer: ComboBoxRenderer<TItem> | null | undefined;

  /**
   * The list of selected items.
   * Note: modifying the selected items creates a new array each time.
   */
  selectedItems: Array<TItem>;

  addEventListener<K extends keyof MultiSelectComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: MultiSelectComboBox<TItem>, ev: MultiSelectComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof MultiSelectComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: MultiSelectComboBox<TItem>, ev: MultiSelectComboBoxEventMap<TItem>[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

interface MultiSelectComboBox<TItem = ComboBoxDefaultItem>
  extends MultiSelectComboBoxMixinClass<TItem>,
    ValidateMixinClass,
    LabelMixinClass,
    KeyboardMixinClass,
    InputMixinClass,
    InputControlMixinClass,
    InputConstraintsMixinClass,
    FocusMixinClass,
    FieldMixinClass,
    DisabledMixinClass,
    DelegateStateMixinClass,
    DelegateFocusMixinClass,
    ThemableMixinClass,
    ElementMixinClass,
    ControllerMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box': MultiSelectComboBox;
  }
}

export { MultiSelectComboBox };
