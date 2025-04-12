/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { button } from '@vaadin/button/theme/material/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const passwordFieldButton = css`
  :host {
    position: absolute;
    top: 0;
    right: 0;
    overflow: visible;
    width: 100%;
    min-width: auto;
    height: 100%;
    padding: 0;
    border-radius: 50%;
    margin: 0;
    background: transparent;
    outline: none;
  }

  :host::before {
    transform: scale(1.5);
  }

  /* Disable ripple */
  :host::after {
    display: none;
  }
`;

registerStyles('vaadin-password-field-button', [button, passwordFieldButton], {
  moduleId: 'material-password-field-button',
});
