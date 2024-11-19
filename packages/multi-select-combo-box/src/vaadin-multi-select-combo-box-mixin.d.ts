/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ComboBoxDataProvider, ComboBoxItemModel } from '@vaadin/combo-box/src/vaadin-combo-box.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { MultiSelectComboBox } from './vaadin-multi-select-combo-box.js';

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

export declare function MultiSelectComboBoxMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ClearButtonMixinClass> &
  Constructor<ControllerMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputControlMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<MultiSelectComboBoxMixinClass<TItem>> &
  Constructor<ResizeMixinClass> &
  Constructor<SlotStylesMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class MultiSelectComboBoxMixinClass<TItem> {
  /**
   * Set to true to auto expand horizontally, causing input field to
   * grow until max width is reached.
   * @attr {boolean} auto-expand-horizontally
   */
  autoExpandHorizontally: boolean;

  /**
   * Set to true to not collapse selected items chips into the overflow
   * chip and instead always expand vertically, causing input field to
   * wrap into multiple lines when width is limited.
   * @attr {boolean} auto-expand-vertically
   */
  autoExpandVertically: boolean;

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
   * A function used to generate CSS class names for dropdown
   * items and selected chips based on the item. The return
   * value should be the generated class name as a string, or
   * multiple class names separated by whitespace characters.
   */
  itemClassNameGenerator: (item: TItem) => string;

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
   * When true, filter string isn't cleared after selecting an item.
   * @attr {boolean} keep-filter
   */
  keepFilter: boolean;

  /**
   * True when loading items from the data provider, false otherwise.
   */
  loading: boolean;

  /**
   * A space-delimited list of CSS class names to set on the overlay element.
   *
   * @attr {string} overlay-class
   */
  overlayClass: string;

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
   * Set to true to group selected items at the top of the overlay.
   * @attr {boolean} selected-items-on-top
   */
  selectedItemsOnTop: boolean;

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
}
