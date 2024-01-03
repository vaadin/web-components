/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-field-outline',
  css`
    :host {
      transition: opacity 0.3s;
      padding: 0 !important;
    }

    :host([context$='picker']),
    :host([context$='combo-box']),
    :host([context$='select']),
    :host([context$='area']),
    :host([context$='field']) {
      top: auto;
      height: 2px;
      z-index: 1;
      background-color: var(--_active-user-color);
    }

    :host([context$='checkbox']),
    :host([context$='radio-button']) {
      border-radius: 50%;
      background-color: var(--_active-user-color);
      transform: scale(2.5);
      opacity: 0.15;
    }

    :host([context$='item'])::before {
      display: block;
      height: 100%;
      content: '';
      box-shadow: inset 0 0 0 2px var(--_active-user-color);
    }
  `,
  { moduleId: 'material-field-outline' },
);
