/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const textArea = css`
  [part='input-field'] {
    height: auto;
    box-sizing: border-box;
  }

  [part='input-field'] ::slotted(textarea) {
    padding-top: 0;
    margin-top: 4px;
  }

  [part='input-field'] ::slotted(textarea) {
    white-space: pre-wrap; /* override "nowrap" from <vaadin-text-field> */
    align-self: stretch; /* override "baseline" from <vaadin-text-field> */
  }

  /* Do not show inherited underline from vaadin-text-field */
  /* See: https://github.com/vaadin/web-components/issues/1333 */
  [part="input-field"]::before,
  [part="input-field"]::after {
    display: none;
  }

  /* Set the pseudoelement in vaadin-text-area-container instead */
  /* NOTE: If DOM ever changed, this will break */
  .vaadin-text-area-container::before,
  .vaadin-text-area-container::after {
    order: 3;
    content: "";
    display: block;
    height: 1px;
    background-color: var(--_material-text-field-input-line-background-color, #000);
    opacity: var(--_material-text-field-input-line-opacity, 0.42);
  }

  .vaadin-text-area-container::after {
    margin-top: -1px;
    background-color: var(--material-primary-color);
    opacity: 0;
    height: 2px;
    transform: scaleX(0);
    transition: opacity 0.175s;
  }

  :host([focused]) .vaadin-text-area-container::after,
  :host([invalid]) .vaadin-text-area-container::after {
    opacity: 1;
    transform: none;
    transition: transform 0.175s, opacity 0.175s;
  }

  [part="label"] {
    order: 1;
  }

  [part="input-field"] {
    order: 2;
  }

  [part="error-message"] {
    order: 4;
  }  
`;

registerStyles('vaadin-text-area', [inputFieldShared, textArea], { moduleId: 'material-text-area' });
