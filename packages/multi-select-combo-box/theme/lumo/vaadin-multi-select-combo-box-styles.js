/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBox = css`
  :host([has-value]:not([compact-mode]):not([readonly])) {
    --vaadin-field-default-width: auto;
    padding-inline-start: 0;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }

  [part='readonly-container'] {
    display: inline-flex;
    align-items: center;
    color: var(--lumo-secondary-text-color);
    border: 1px dashed var(--lumo-contrast-30pct);
    border-radius: var(--lumo-border-radius);
    padding: 0 calc(0.625em + var(--lumo-border-radius) / 4 - 1px);
    font-weight: 500;
    min-height: var(--lumo-text-field-size);
    cursor: var(--lumo-clickable-cursor);
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'lumo-multi-select-combo-box'
});
