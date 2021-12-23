/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBox = css`
  :host {
    --vaadin-field-default-width: auto;
  }

  /* Make label always float */
  [part='label'] {
    transform: scale(0.75) !important;
  }

  [part='toggle-button']::before {
    content: var(--material-icons-dropdown);
  }

  [part='readonly-container'] {
    display: inline-flex;
    align-items: center;
    color: var(--material-body-text-color);
    border: 1px dashed var(--material-secondary-text-color);
    padding: 0 0.5rem;
    min-height: 32px;
    cursor: default;
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'material-multi-select-combo-box'
});
