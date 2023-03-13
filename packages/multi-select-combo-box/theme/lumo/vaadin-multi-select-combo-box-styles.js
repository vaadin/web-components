/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { comboBoxItem } from '@vaadin/combo-box/theme/lumo/vaadin-combo-box-item-styles.js';
import { comboBoxLoader, comboBoxOverlay } from '@vaadin/combo-box/theme/lumo/vaadin-combo-box-overlay-styles.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { loader } from '@vaadin/vaadin-lumo-styles/mixins/loader.js';
import { menuOverlayCore } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBoxItem = css`
  @media (any-hover: hover) {
    :host(:hover[readonly]) {
      background-color: transparent;
      cursor: default;
    }
  }
`;

registerStyles('vaadin-multi-select-combo-box-item', [item, comboBoxItem, multiSelectComboBoxItem], {
  moduleId: 'lumo-multi-select-combo-box-item',
});

registerStyles(
  'vaadin-multi-select-combo-box-overlay',
  [
    overlay,
    menuOverlayCore,
    comboBoxOverlay,
    loader,
    comboBoxLoader,
    css`
      :host {
        --_vaadin-multi-select-combo-box-items-container-border-width: var(--lumo-space-xs);
        --_vaadin-multi-select-combo-box-items-container-border-style: solid;
      }
    `,
  ],
  { moduleId: 'lumo-multi-select-combo-box-overlay' },
);

const multiSelectComboBox = css`
  :host([has-value]) {
    padding-inline-start: 0;
  }

  :host([has-value]) ::slotted(input:placeholder-shown) {
    caret-color: var(--lumo-body-text-color) !important;
  }

  /* Override input-container styles */
  ::slotted([slot='chip']),
  ::slotted([slot='overflow']) {
    min-height: auto;
    padding: 0.3125em calc(0.5em + var(--lumo-border-radius-s) / 4);
    color: var(--lumo-body-text-color);
    -webkit-mask-image: none;
    mask-image: none;
  }

  ::slotted([slot='chip']:not([readonly]):not([disabled])) {
    padding-inline-end: 0;
  }

  ::slotted([slot='chip']:not(:last-of-type)),
  ::slotted([slot='overflow']:not(:last-of-type)) {
    margin-inline-end: var(--lumo-space-xs);
  }

  ::slotted([slot='chip'][focused]) {
    background-color: var(--lumo-primary-color);
    color: var(--lumo-primary-contrast-color);
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }

  :host([readonly][has-value]) [part='toggle-button'] {
    color: var(--lumo-contrast-60pct);
    cursor: var(--lumo-clickable-cursor);
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'lumo-multi-select-combo-box',
});
