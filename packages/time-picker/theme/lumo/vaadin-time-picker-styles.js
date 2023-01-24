/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { comboBoxItem } from '@vaadin/combo-box/theme/lumo/vaadin-combo-box-item-styles.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-time-picker-item', [item, comboBoxItem], {
  moduleId: 'lumo-time-picker-item',
});

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--lumo-icons-clock);
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input:placeholder-shown) {
    --_lumo-text-field-overflow-mask-image: none;
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input) {
    --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
  }
`;

registerStyles('vaadin-time-picker', [inputFieldShared, timePicker], { moduleId: 'lumo-time-picker' });
