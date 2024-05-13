/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ComboBox } from './vaadin-combo-box.js';
import type { ComboBoxDefaultItem, ComboBoxItemModel, ComboBoxItemRenderer } from './vaadin-combo-box-item-mixin.js';

export type { ComboBoxDefaultItem, ComboBoxItemModel };

export type ComboBoxRenderer<TItem> = ComboBoxItemRenderer<TItem, ComboBox<TItem>>;

export declare function ComboBoxMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxMixinClass<TItem>> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<OverlayClassMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class ComboBoxMixinClass<TItem> {
  /**
   * True if the dropdown is open, false otherwise.
   */
  opened: boolean;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * When present, it specifies that the field is read-only.
   */
  readonly: boolean;

  /**
   * Custom function for rendering the content of every item.
   * Receives three arguments:
   *
   * - `root` The `<vaadin-combo-box-item>` internal container DOM element.
   * - `comboBox` The reference to the `<vaadin-combo-box>` element.
   * - `model` The object with the properties related with the rendered
   *   item, contains:
   *   - `model.index` The index of the rendered item.
   *   - `model.item` The item.
   */
  renderer: ComboBoxRenderer<TItem> | null | undefined;

  /**
   * A full set of items to filter the visible options from.
   * The items can be of either `String` or `Object` type.
   */
  items: TItem[] | undefined;

  /**
   * A function used to generate CSS class names for dropdown
   * items based on the item. The return value should be the
   * generated class name as a string, or multiple class names
   * separated by whitespace characters.
   */
  itemClassNameGenerator: (item: TItem) => string;

  /**
   * If `true`, the user can input a value that is not present in the items list.
   * `value` property will be set to the input value in this case.
   * Also, when `value` is set programmatically, the input value will be set
   * to reflect that value.
   * @attr {boolean} allow-custom-value
   */
  allowCustomValue: boolean;

  /**
   * A subset of items, filtered based on the user input. Filtered items
   * can be assigned directly to omit the internal filtering functionality.
   * The items can be of either `String` or `Object` type.
   */
  filteredItems: TItem[] | undefined;

  /**
   * The `String` value for the selected item of the combo box.
   *
   * When there is no item selected, the value is an empty string.
   *
   * Use `selectedItem` property to get the raw selected item from
   * the `items` array.
   */
  value: string;

  /**
   * When set to `true`, "loading" attribute is added to host and the overlay element.
   */
  loading: boolean;

  /**
   * Filtering string the user has typed into the input field.
   */
  filter: string;

  /**
   * The selected item from the `items` array.
   */
  selectedItem: TItem | null | undefined;

  /**
   * Path for label of the item. If `items` is an array of objects, the
   * `itemLabelPath` is used to fetch the displayed string label for each
   * item.
   *
   * The item label is also used for matching items when processing user
   * input, i.e., for filtering and selecting items.
   * @attr {string} item-label-path
   */
  itemLabelPath: string;

  /**
   * Path for the value of the item. If `items` is an array of objects, the
   * `itemValuePath:` is used to fetch the string value for the selected
   * item.
   *
   * The item value is used in the `value` property of the combo box,
   * to provide the form value.
   * @attr {string} item-value-path
   */
  itemValuePath: string;

  /**
   * Path for the id of the item. If `items` is an array of objects,
   * the `itemIdPath` is used to compare and identify the same item
   * in `selectedItem` and `filteredItems` (items given by the
   * `dataProvider` callback).
   * @attr {string} item-id-path
   */
  itemIdPath: string | null | undefined;

  /**
   * Tag name prefix used by scroller and items.
   */
  protected readonly _tagNamePrefix: string;

  /**
   * Requests an update for the content of items.
   * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;

  /**
   * Opens the dropdown list.
   */
  open(): void;

  /**
   * Closes the dropdown list.
   */
  close(): void;
}
