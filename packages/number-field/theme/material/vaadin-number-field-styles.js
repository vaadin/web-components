/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/material/vaadin-input-container-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const numberField = css`
  :host([step-buttons-visible]) ::slotted(input) {
    text-align: center;
  }

  :host(:not([disabled])) [part$='button'][disabled] {
    opacity: 0.2;
  }

  [part$='decrease-button'] {
    cursor: pointer;
    font-size: var(--material-body-font-size);
    padding-bottom: 0.21em;
  }
`;

registerStyles('vaadin-number-field', [inputFieldShared, numberField], {
  moduleId: 'material-number-field',
});
