/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ComboBoxDataProviderMixinClass } from './vaadin-combo-box-data-provider-mixin.js';
import type { ComboBoxMixinClass } from './vaadin-combo-box-mixin.js';

export declare function ComboBoxLightMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxDataProviderMixinClass<TItem>> &
  Constructor<ComboBoxLightMixinClass> &
  Constructor<ComboBoxMixinClass<TItem>> &
  Constructor<ValidateMixinClass> &
  T;

export declare class ComboBoxLightMixinClass {
  /**
   * Name of the two-way data-bindable property representing the
   * value of the custom input field.
   * @attr {string} attr-for-value
   */
  attrForValue: string;
}
