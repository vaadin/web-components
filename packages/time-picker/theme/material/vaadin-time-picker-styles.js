/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/font-icons.js';
import { comboBoxItem } from '@vaadin/combo-box/theme/material/vaadin-combo-box-item-styles.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-time-picker-item', [item, comboBoxItem], {
  moduleId: 'material-time-picker-item',
});

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--material-icons-clock);
  }
`;

registerStyles('vaadin-time-picker', [inputFieldShared, timePicker], { moduleId: 'material-time-picker' });
