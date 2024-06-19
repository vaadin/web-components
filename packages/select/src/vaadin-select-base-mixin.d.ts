/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { SelectItem, SelectRenderer } from './vaadin-select.js';

export declare function SelectBaseMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<OverlayClassMixinClass> &
  Constructor<SelectBaseMixinClass> &
  Constructor<TabindexMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class SelectBaseMixinClass {
  /**
   * An array containing items that will be rendered as the options of the select.
   *
   * #### Example
   * ```js
   * select.items = [
   *   { label: 'Most recent first', value: 'recent' },
   *   { component: 'hr' },
   *   { label: 'Rating: low to high', value: 'rating-asc', className: 'asc' },
   *   { label: 'Rating: high to low', value: 'rating-desc', className: 'desc' },
   *   { component: 'hr' },
   *   { label: 'Price: low to high', value: 'price-asc', disabled: true },
   *   { label: 'Price: high to low', value: 'price-desc', disabled: true }
   * ];
   * ```
   *
   * Note: each item is rendered by default as the internal `<vaadin-select-item>` that is an extension of `<vaadin-item>`.
   * To render the item with a custom component, provide a tag name by the `component` property.
   *
   * @type {!Array<!SelectItem>}
   */
  items: SelectItem[] | null | undefined;

  /**
   * Set when the select is open
   */
  opened: boolean;

  /**
   * Custom function for rendering the content of the `<vaadin-select>`.
   * Receives two arguments:
   *
   * - `root` The `<vaadin-select-overlay>` internal container
   *   DOM element. Append your content to it.
   * - `select` The reference to the `<vaadin-select>` element.
   */
  renderer: SelectRenderer | undefined;

  /**
   * The `value` property of the selected item, or an empty string
   * if no item is selected.
   * On change or initialization, the component finds the item which matches the
   * value and displays it.
   * If no value is provided to the component, it selects the first item without
   * value or empty value.
   * Hint: If you do not want to select any item by default, you can either set all
   * the values of inner vaadin-items, or set the vaadin-select value to
   * an inexistent value in the items list.
   */
  value: string;

  /**
   * The name of this element.
   */
  name: string | null | undefined;

  /**
   * A hint to the user of what can be entered in the control.
   * The placeholder will be displayed in the case that there
   * is no item selected, or the selected item has an empty
   * string label, or the selected item has no label and it's
   * DOM content is empty.
   */
  placeholder: string | null | undefined;

  /**
   * When present, it specifies that the element is read-only.
   */
  readonly: boolean;

  /**
   * Defines whether the overlay should overlap the target element
   * in the y-axis, or be positioned right above/below it.
   *
   * @attr {boolean} no-vertical-overlap
   */
  noVerticalOverlap: boolean;

  /**
   * Requests an update for the content of the select.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}
