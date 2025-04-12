/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-field-outline',
  css`
    :host {
      -webkit-mask-image: none !important;
      mask-image: none !important;
      transition: opacity 0.3s;
    }

    :host::before {
      position: absolute;
      border-radius: var(--lumo-border-radius-s);
      box-shadow: 0 0 0 2px var(--_active-user-color);
      content: '';
      inset: 0;
      transition: box-shadow 0.3s;
    }

    :host([context$='checkbox'])::before {
      box-shadow:
        0 0 0 2px var(--lumo-base-color),
        0 0 0 4px var(--_active-user-color);
    }

    :host([context$='radio-button'])::before {
      border-radius: 50%;
      box-shadow:
        0 0 0 3px var(--lumo-base-color),
        0 0 0 5px var(--_active-user-color);
    }

    :host([context$='item'])::before {
      box-shadow: inset 0 0 0 2px var(--_active-user-color);
    }
  `,
  { moduleId: 'lumo-field-outline' },
);
