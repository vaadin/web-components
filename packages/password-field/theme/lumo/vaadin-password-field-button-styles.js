/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { button } from '@vaadin/button/theme/lumo/vaadin-button-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const passwordFieldButton = css`
  :host {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    min-width: auto;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    outline: none;
  }
`;

registerStyles('vaadin-password-field-button', [button, passwordFieldButton], {
  moduleId: 'lumo-password-field-button',
});
