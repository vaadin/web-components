/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ComboBoxDefaultItem } from '@vaadin/combo-box/src/vaadin-combo-box.js';
import type { ComboBoxBaseMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-base-mixin.js';
import type { ComboBoxDataProviderMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import type { ComboBoxItemsMixinClass } from '@vaadin/combo-box/src/vaadin-combo-box-items-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { MultiSelectComboBoxMixinClass } from './vaadin-multi-select-combo-box-mixin.js';

export { MultiSelectComboBoxI18n, MultiSelectComboBoxRenderer } from './vaadin-multi-select-combo-box-mixin.js';

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
 * Fired when the `opened` property changes.
 */
export type MultiSelectComboBoxOpenedChangedEvent = CustomEvent<{ value: boolean }>;

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

  'opened-changed': MultiSelectComboBoxOpenedChangedEvent;

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
 * `chips`                | The element that wraps slotted chips for selected items
 * `label`                | The label element
 * `input-field`          | The element that wraps prefix, value and suffix
 * `field-button`         | Set on both clear and toggle buttons
 * `clear-button`         | The clear button
 * `error-message`        | The error message element
 * `helper-text`          | The helper text element wrapper
 * `required-indicator`   | The `required` state indicator element
 * `toggle-button`        | The toggle button
 * `overlay`              | The overlay container
 * `content`              | The overlay content
 * `loader`               | The loading indicator shown while loading items
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
 * `has-tooltip`          | Set when the element has a slotted tooltip
 * `invalid`              | Set when the element is invalid
 * `focused`              | Set when the element is focused
 * `focus-ring`           | Set when the element is keyboard focused
 * `loading`              | Set when loading items from the data provider
 * `opened`               | Set when the dropdown is open
 * `readonly`             | Set to a readonly element
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                     |
 * :-------------------------------------------------------|
 * | `--vaadin-chip-background`                            |
 * | `--vaadin-chip-border-color`                          |
 * | `--vaadin-chip-border-radius`                         |
 * | `--vaadin-chip-border-width`                          |
 * | `--vaadin-chip-font-size`                             |
 * | `--vaadin-chip-font-weight`                           |
 * | `--vaadin-chip-gap`                                   |
 * | `--vaadin-chip-height`                                |
 * | `--vaadin-chip-padding`                               |
 * | `--vaadin-chip-remove-button-text-color`              |
 * | `--vaadin-chip-text-color`                            |
 * | `--vaadin-field-default-width`                        |
 * | `--vaadin-input-field-background`                     |
 * | `--vaadin-input-field-border-color`                   |
 * | `--vaadin-input-field-border-radius`                  |
 * | `--vaadin-input-field-border-width`                   |
 * | `--vaadin-input-field-bottom-end-radius`              |
 * | `--vaadin-input-field-bottom-start-radius`            |
 * | `--vaadin-input-field-button-text-color`              |
 * | `--vaadin-input-field-container-gap`                  |
 * | `--vaadin-input-field-disabled-background`            |
 * | `--vaadin-input-field-disabled-text-color`            |
 * | `--vaadin-input-field-error-color`                    |
 * | `--vaadin-input-field-error-font-size`                |
 * | `--vaadin-input-field-error-font-weight`              |
 * | `--vaadin-input-field-error-line-height`              |
 * | `--vaadin-input-field-gap`                            |
 * | `--vaadin-input-field-helper-color`                   |
 * | `--vaadin-input-field-helper-font-size`               |
 * | `--vaadin-input-field-helper-font-weight`             |
 * | `--vaadin-input-field-helper-line-height`             |
 * | `--vaadin-input-field-label-color`                    |
 * | `--vaadin-input-field-label-font-size`                |
 * | `--vaadin-input-field-label-font-weight`              |
 * | `--vaadin-input-field-label-line-height`              |
 * | `--vaadin-input-field-padding`                        |
 * | `--vaadin-input-field-placeholder-color`              |
 * | `--vaadin-input-field-required-indicator`             |
 * | `--vaadin-input-field-required-indicator-color`       |
 * | `--vaadin-input-field-top-end-radius`                 |
 * | `--vaadin-input-field-top-start-radius`               |
 * | `--vaadin-input-field-value-color`                    |
 * | `--vaadin-input-field-value-font-size`                |
 * | `--vaadin-input-field-value-font-weight`              |
 * | `--vaadin-input-field-value-line-height`              |
 * | `--vaadin-item-overlay-padding`                       |
 * | `--vaadin-multi-select-combo-box-chip-min-width`      |
 * | `--vaadin-multi-select-combo-box-chips-gap`           |
 * | `--vaadin-multi-select-combo-box-input-min-width`     |
 * | `--vaadin-multi-select-combo-box-overlay-max-height`  |
 * | `--vaadin-multi-select-combo-box-overlay-width`       |
 *
 * ### Internal components
 *
 * In addition to `<vaadin-multi-select-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-multi-select-combo-box-chip>`
 * - `<vaadin-multi-select-combo-box-item>` - has the same API as `<vaadin-item>`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class MultiSelectComboBox<TItem = ComboBoxDefaultItem> extends HTMLElement {
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

interface MultiSelectComboBox<TItem = ComboBoxDefaultItem>
  extends
    ComboBoxBaseMixinClass,
    ComboBoxDataProviderMixinClass<TItem>,
    ComboBoxItemsMixinClass<TItem>,
    ValidateMixinClass,
    SlotStylesMixinClass,
    LabelMixinClass,
    KeyboardMixinClass,
    ClearButtonMixinClass,
    Omit<InputMixinClass, 'value'>,
    InputControlMixinClass,
    InputConstraintsMixinClass,
    FocusMixinClass,
    FieldMixinClass,
    DisabledMixinClass,
    DelegateStateMixinClass,
    DelegateFocusMixinClass,
    MultiSelectComboBoxMixinClass<TItem>,
    ResizeMixinClass,
    ThemableMixinClass,
    ThemePropertyMixinClass,
    ElementMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box': MultiSelectComboBox;
  }
}

export { MultiSelectComboBox };
