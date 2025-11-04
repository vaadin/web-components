/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ComboBoxItemModel } from '@vaadin/combo-box/src/vaadin-combo-box.js';
import type { ComboBoxBaseMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-base-mixin.js';
import type { ComboBoxDataProviderMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import type { ComboBoxItemsMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-items-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
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
  cleared?: string;
  focused?: string;
  selected?: string;
  deselected?: string;
  total?: string;
}

export declare function MultiSelectComboBoxMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ClearButtonMixinClass> &
  Constructor<ComboBoxBaseMixinClass> &
  Constructor<ComboBoxDataProviderMixinClass<TItem>> &
  Constructor<ComboBoxItemsMixinClass<TItem>> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<I18nMixinClass<MultiSelectComboBoxI18n>> &
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
   * A function used to generate CSS class names for dropdown
   * items and selected chips based on the item. The return
   * value should be the generated class name as a string, or
   * multiple class names separated by whitespace characters.
   */
  itemClassNameGenerator: (item: TItem) => string;

  /**
   * Path for the id of the item, used to detect whether the item is selected.
   * @attr {string} item-id-path
   */
  itemIdPath: string;

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   * ```js
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
