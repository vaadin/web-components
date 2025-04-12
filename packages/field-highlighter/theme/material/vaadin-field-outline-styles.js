/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-field-outline',
  css`
    :host {
      padding: 0 !important;
      transition: opacity 0.3s;
    }

    :host([context$='picker']),
    :host([context$='combo-box']),
    :host([context$='select']),
    :host([context$='area']),
    :host([context$='field']) {
      background-color: var(--_active-user-color);
      height: 2px;
      top: auto;
      z-index: 1;
    }

    :host([context$='checkbox']),
    :host([context$='radio-button']) {
      background-color: var(--_active-user-color);
      border-radius: 50%;
      opacity: 0.15;
      transform: scale(2.5);
    }

    :host([context$='item'])::before {
      box-shadow: inset 0 0 0 2px var(--_active-user-color);
      content: '';
      display: block;
      height: 100%;
    }
  `,
  { moduleId: 'material-field-outline' },
);
