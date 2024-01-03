/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/lumo/vaadin-input-container-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { comboBoxItem } from '@vaadin/combo-box/theme/lumo/vaadin-combo-box-item-styles.js';
import { comboBoxOverlay } from '@vaadin/combo-box/theme/lumo/vaadin-combo-box-overlay-styles.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { menuOverlayCore } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-time-picker-item', [item, comboBoxItem], {
  moduleId: 'lumo-time-picker-item',
});

registerStyles(
  'vaadin-time-picker-overlay',
  [
    overlay,
    menuOverlayCore,
    comboBoxOverlay,
    css`
      :host {
        --_vaadin-time-picker-items-container-border-width: var(--lumo-space-xs);
        --_vaadin-time-picker-items-container-border-style: solid;
      }
    `,
  ],
  {
    moduleId: 'lumo-time-picker-overlay',
  },
);

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
