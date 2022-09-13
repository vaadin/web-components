/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type {
  ComboBoxDataProvider,
  ComboBoxDefaultItem,
  ComboBoxItemModel,
} from '@vaadin/combo-box/src/vaadin-combo-box.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/field-base/src/delegate-state-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/field-base/src/slot-styles-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

export type MultiSelectComboBoxRenderer<TItem> = (
  root: HTMLElement,
  comboBox: MultiSelectComboBox<TItem>,
  model: ComboBoxItemModel<TItem>,
) => void;

export interface MultiSelectComboBoxI18n {
  cleared: string;
  focused: string;
  selected: string;
  deselected: string;
  total: string;
}

/**
 * Fired when the user commits a value change.
 */
export type MultiSelectComboBoxChangeEvent<TItem> = Event & {
  target: MultiSelectComboBox<TItem>;
};

/**
 * Fired when the user sets a custom value.
 */
export type MultiSelectComboBoxCustomValueSetEvent = CustomEvent<string>;

/**
 * Fired when the `filter` property changes.
 */
export type MultiSelectComboBoxFilterChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `invalid` property changes.
 */
export type MultiSelectComboBoxInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `selectedItems` property changes.
 */
export type MultiSelectComboBoxSelectedItemsChangedEvent<TItem> = CustomEvent<{ value: TItem[] }>;

/**
 * Fired whenever the field is validated.
 */
export type MultiSelectComboBoxValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface MultiSelectComboBoxEventMap<TItem> extends HTMLElementEventMap {
  change: MultiSelectComboBoxChangeEvent<TItem>;

  'custom-value-set': MultiSelectComboBoxCustomValueSetEvent;

  'filter-changed': MultiSelectComboBoxFilterChangedEvent;

  'invalid-changed': MultiSelectComboBoxInvalidChangedEvent;

  'selected-items-changed': MultiSelectComboBoxSelectedItemsChangedEvent<TItem>;

  validated: MultiSelectComboBoxValidatedEvent;
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
 */
declare class MultiSelectComboBox<TItem = ComboBoxDefaultItem> extends HTMLElement {
  /**
   * When true, the user can input a value that is not present in the items list.
   * @attr {boolean} allow-custom-value
   */
  allowCustomValue: boolean;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean;

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
  filteredItems: TItem[] | undefined;

  /**
   * Filtering string the user has typed into the input field.
   */
  filter: string;

  /**
   * A full set of items to filter the visible options from.
   * The items can be of either `String` or `Object` type.
   */
  items: TItem[] | undefined;

  /**
   * The item property used for a visual representation of the item.
   * @attr {string} item-label-path
   */
  itemLabelPath: string;

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
   */
  i18n: MultiSelectComboBoxI18n;

  /**
   * True when loading items from the data provider, false otherwise.
   */
  loading: boolean;

  /**
   * True if the dropdown is open, false otherwise.
   */
  opened: boolean;

  /**
   * Number of items fetched at a time from the data provider.
   * @attr {number} page-size
   */
  pageSize: number;

  /**
   * A hint to the user of what can be entered in the control.
   * The placeholder will be only displayed in the case when
   * there is no item selected.
   */
  placeholder: string;

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
  renderer: MultiSelectComboBoxRenderer<TItem> | null | undefined;

  /**
   * The list of selected items.
   * Note: modifying the selected items creates a new array each time.
   */
  selectedItems: TItem[];

  /**
   * Total number of items.
   */
  size: number | undefined;

  /**
   * Clears the cached pages and reloads data from data provider when needed.
   */
  clearCache(): void;

  /**
   * Clears the selected items.
   */
  clear(): void;

  /**
   * Requests an update for the content of items.
   * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  addEventListener<K extends keyof MultiSelectComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: MultiSelectComboBox<TItem>, ev: MultiSelectComboBoxEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MultiSelectComboBoxEventMap<TItem>>(
    type: K,
    listener: (this: MultiSelectComboBox<TItem>, ev: MultiSelectComboBoxEventMap<TItem>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

interface MultiSelectComboBox
  extends ValidateMixinClass,
    SlotStylesMixinClass,
    LabelMixinClass,
    KeyboardMixinClass,
    Omit<InputMixinClass, 'value'>,
    InputControlMixinClass,
    InputConstraintsMixinClass,
    FocusMixinClass,
    FieldMixinClass,
    DisabledMixinClass,
    DelegateStateMixinClass,
    DelegateFocusMixinClass,
    ResizeMixinClass,
    ThemableMixinClass,
    ThemePropertyMixinClass,
    ElementMixinClass,
    ControllerMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box': MultiSelectComboBox;
  }
}

export { MultiSelectComboBox };
