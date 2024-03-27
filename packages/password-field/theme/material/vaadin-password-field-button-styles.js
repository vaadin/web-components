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
import { button } from '@vaadin/button/theme/material/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const passwordFieldButton = css`
  :host {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    min-width: auto;
    background: transparent;
    outline: none;
    border-radius: 50%;
    overflow: visible;
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
