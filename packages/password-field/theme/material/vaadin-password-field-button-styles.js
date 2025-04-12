/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { button } from '@vaadin/button/theme/material/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const passwordFieldButton = css`
  :host {
    background: transparent;
    border-radius: 50%;
    height: 100%;
    margin: 0;
    min-width: auto;
    outline: none;
    overflow: visible;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
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
