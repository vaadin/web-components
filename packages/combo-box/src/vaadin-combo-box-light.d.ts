/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxDataProviderMixin } from '@vaadin/vaadin-combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxDefaultItem } from '@vaadin/vaadin-combo-box/src/interfaces';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';

declare class ComboBoxLight extends HTMLElement {
  /**
   * Name of the two-way data-bindable property representing the
   * value of the custom input field.
   * @attr {string} attr-for-value
   */
  attrForValue: string;
}

interface ComboBoxLight<TItem = ComboBoxDefaultItem>
  extends ComboBoxDataProviderMixin<TItem>,
    ComboBoxMixin<TItem>,
    ThemableMixin {}

export { ComboBoxLight };
