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
      z-index: 1;
      top: auto;
      height: 2px;
      background-color: var(--_active-user-color);
    }

    :host([context$='checkbox']),
    :host([context$='radio-button']) {
      border-radius: 50%;
      background-color: var(--_active-user-color);
      opacity: 0.15;
      transform: scale(2.5);
    }

    :host([context$='item'])::before {
      display: block;
      height: 100%;
      box-shadow: inset 0 0 0 2px var(--_active-user-color);
      content: '';
    }
  `,
  { moduleId: 'material-field-outline' },
);
