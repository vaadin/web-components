/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxDataProviderMixin } from '@vaadin/vaadin-combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import { AriaLabelMixin } from '@vaadin/field-base/src/aria-label-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { FieldAriaMixin } from '@vaadin/field-base/src/field-aria-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';
import { ComboBoxDefaultItem } from '@vaadin/vaadin-combo-box/src/interfaces';

declare class ComboBox extends HTMLElement {
  /**
   * Element used by `DelegatesFocusMixin` to handle focus.
   */
  readonly focusElement: HTMLInputElement;
}

interface ComboBox<TItem = ComboBoxDefaultItem>
  extends ElementMixin,
    AriaLabelMixin,
    DelegateFocusMixin,
    FieldAriaMixin,
    InputSlotMixin,
    PatternMixin,
    ComboBoxDataProviderMixin<TItem>,
    ComboBoxMixin<TItem>,
    ThemableMixin {}

export { ComboBox };
