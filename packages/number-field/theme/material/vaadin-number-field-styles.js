/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const numberField = css`
  :host {
    width: 8em;
  }

  :host([step-buttons-visible]) ::slotted(input),
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
  moduleId: 'material-number-field',
});
