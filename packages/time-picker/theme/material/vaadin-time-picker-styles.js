/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/material/vaadin-input-container-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { comboBoxItem } from '@vaadin/combo-box/theme/material/vaadin-combo-box-item-styles.js';
import { comboBoxOverlay } from '@vaadin/combo-box/theme/material/vaadin-combo-box-overlay-styles.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-time-picker-item', [item, comboBoxItem], {
  moduleId: 'material-time-picker-item',
});

registerStyles(
  'vaadin-time-picker-overlay',
  [
    menuOverlay,
    comboBoxOverlay,
    css`
      :host {
        --_vaadin-time-picker-items-container-border-width: 8px 0;
        --_vaadin-time-picker-items-container-border-style: solid;
      }
    `,
  ],
  {
    moduleId: 'material-time-picker-overlay',
  },
);

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--material-icons-clock);
  }
`;

registerStyles('vaadin-time-picker', [inputFieldShared, timePicker], { moduleId: 'material-time-picker' });
