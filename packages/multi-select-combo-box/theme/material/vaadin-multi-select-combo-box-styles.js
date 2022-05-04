/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box-item',
  css`
    @media (any-hover: hover) {
      :host(:hover[readonly]) {
        background-color: transparent;
        cursor: default;
      }
    }
  `,
  {
    moduleId: 'material-multi-select-combo-box-item',
  },
);

const multiSelectComboBox = css`
  :host([has-value]) ::slotted(input:placeholder-shown) {
    caret-color: var(--material-body-text-color) !important;
  }

  [part='input-field'] {
    height: auto;
    min-height: 32px;
  }

  [part='input-field'] ::slotted(input) {
    padding: 6px 0;
  }

  [part='toggle-button']::before {
    content: var(--material-icons-dropdown);
  }

  :host([opened]) [part='toggle-button'] {
    transform: rotate(180deg);
  }

  :host([readonly][has-value]) [part='toggle-button'] {
    color: var(--material-secondary-text-color);
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'material-multi-select-combo-box',
});
