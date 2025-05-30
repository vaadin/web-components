/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/lumo/vaadin-input-container-styles.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const numberField = css`
  :host([step-buttons-visible]:not([theme~='align-right'])) ::slotted(input) {
    text-align: center;
  }

  :host(:not([disabled])) [part$='button'][disabled] {
    opacity: 0.2;
  }

  :host([step-buttons-visible]) [part='input-field'] {
    padding: 0;
  }

  [part='decrease-button'],
  [part='increase-button'] {
    cursor: pointer;
    width: 1.5em;
    height: 1.5em;
  }

  [part='decrease-button']::before,
  [part='increase-button']::before {
    margin-top: 0.25em;
  }

  [part='decrease-button']::before {
    content: var(--lumo-icons-minus);
  }

  [part='increase-button']::before {
    content: var(--lumo-icons-plus);
  }

  /* RTL specific styles */
  :host([dir='rtl']:not([theme~='align-right'])) ::slotted(input) {
    --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
  }
`;

registerStyles('vaadin-number-field', [inputFieldShared, numberField], {
  moduleId: 'lumo-number-field',
});
