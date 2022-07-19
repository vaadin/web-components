/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { ComboBoxDataProviderMixinClass } from './vaadin-combo-box-data-provider-mixin.js';
import type { ComboBoxDefaultItem, ComboBoxMixinClass } from './vaadin-combo-box-mixin.js';
export {
  ComboBoxDataProvider,
  ComboBoxDataProviderCallback,
  ComboBoxDataProviderParams,
} from './vaadin-combo-box-data-provider-mixin.js';
export { ComboBoxDefaultItem, ComboBoxItemModel, ComboBoxRenderer } from './vaadin-combo-box-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type ComboBoxLightChangeEvent<TItem> = Event & {
  target: ComboBoxLight<TItem>;
};

/**
 * Fired when the user sets a custom value.
 */
export type ComboBoxLightCustomValueSetEvent = CustomEvent<string>;

/**
 * Fired when the `opened` property changes.
 */
export type ComboBoxLightOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type ComboBoxLightInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type ComboBoxLightValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `filter` property changes.
 */
export type ComboBoxLightFilterChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `selectedItem` property changes.
 */
export type ComboBoxLightSelectedItemChangedEvent<TItem> = CustomEvent<{ value: TItem | null | undefined }>;

/**
 * Fired whenever the field is validated.
 */
export type ComboBoxLightValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface ComboBoxLightEventMap<TItem> extends HTMLElementEventMap {
  change: ComboBoxLightChangeEvent<TItem>;

  'custom-value-set': ComboBoxLightCustomValueSetEvent;

  'opened-changed': ComboBoxLightOpenedChangedEvent;

  'filter-changed': ComboBoxLightFilterChangedEvent;

  'invalid-changed': ComboBoxLightInvalidChangedEvent;

  'value-changed': ComboBoxLightValueChangedEvent;

  'selected-item-changed': ComboBoxLightSelectedItemChangedEvent<TItem>;

  validated: ComboBoxLightValidatedEvent;
}

/**
 * `<vaadin-combo-box-light>` is a customizable version of the `<vaadin-combo-box>` providing
 * only the dropdown functionality and leaving the input field definition to the user.
 *
 * The element has the same API as `<vaadin-combo-box>`.
 *
 * To create a custom input field, you need to add a child element which has a two-way
 * data-bindable property representing the input value. The property name is expected
 * to be `value` by default. For example, you can use `<vaadin-text-field>` element:
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <vaadin-text-field></vaadin-text-field>
 * </vaadin-combo-box-light>
 * ```
 *
 * If you are using custom input field that has other property for value,
 * set `class="input"` to enable corresponding logic, and use `attr-for-value`
 * attribute to specify which property to use:
 *
 * ```html
 * <vaadin-combo-box-light attr-for-value="input-value">
 *   <custom-input class="input"></custom-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * You can also pass custom toggle and clear buttons with corresponding classes:
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <custom-input class="input" attr-for-value="input-value">
 *     <button slot="suffix" class="clear-button">Clear</button>
 *     <button slot="suffix" class="toggle-button">Toggle</button>
 *   </custom-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-item-changed - Fired when the `selectedItem` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class ComboBoxLight<TItem = ComboBoxDefaultItem> extends HTMLElement {
  /**
   * Name of the two-way data-bindable property representing the
   * value of the custom input field.
   * @attr {string} attr-for-value
   */
  attrForValue: string;

  addEventListener<K extends keyof ComboBoxLightEventMap<TItem>>(
    type: K,
    listener: (this: ComboBoxLight<TItem>, ev: ComboBoxLightEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof ComboBoxLightEventMap<TItem>>(
    type: K,
    listener: (this: ComboBoxLight<TItem>, ev: ComboBoxLightEventMap<TItem>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

interface ComboBoxLight<TItem = ComboBoxDefaultItem>
  extends ComboBoxDataProviderMixinClass<TItem>,
    ComboBoxMixinClass<TItem>,
    KeyboardMixinClass,
    InputMixinClass,
    DisabledMixinClass,
    ThemableMixinClass,
    ThemePropertyMixinClass,
    ValidateMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box-light': ComboBoxLight;
  }
}

export { ComboBoxLight };
