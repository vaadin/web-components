/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const numberField = css`
  :host {
    width: 8em;
  }

  :host([has-controls]) ::slotted(input) {
    text-align: center;
  }

  [part$='button'][disabled] {
    opacity: 0.2;
  }

  [part$='decrease-button'] {
    cursor: pointer;
    font-size: var(--material-body-font-size);
    padding-bottom: 0.21em;
  }
`;

registerStyles('vaadin-number-field', [inputFieldShared, fieldButton, numberField], {
  moduleId: 'material-number-field'
});
