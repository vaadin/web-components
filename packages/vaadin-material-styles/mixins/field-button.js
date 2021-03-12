/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../font-icons.js';

const fieldButton = css`
  [part$='button'] {
    flex: none;
    width: 24px;
    height: 24px;
    padding: 4px;
    color: var(--material-secondary-text-color);
    font-size: var(--material-icon-font-size);
    line-height: 24px;
    text-align: center;
  }

  :host(:not([readonly])) [part$='button'] {
    cursor: pointer;
  }

  :host(:not([readonly])) [part$='button']:hover {
    color: var(--material-text-color);
  }

  :host([disabled]) [part$='button'],
  :host([readonly]) [part$='button'] {
    color: var(--material-disabled-text-color);
  }

  :host([disabled]) [part='clear-button'] {
    display: none;
  }

  [part$='button']::before {
    font-family: 'material-icons';
  }
`;

registerStyles('', fieldButton, { moduleId: 'material-field-button' });

export { fieldButton };
