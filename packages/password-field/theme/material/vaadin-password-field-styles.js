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
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const passwordField = css`
  [part='reveal-button']::before {
    content: var(--material-icons-eye);
  }

  :host([password-visible]) [part='reveal-button']::before {
    content: var(--material-icons-eye-disabled);
  }

  /* The reveal button works also in readonly mode */
  :host([readonly]) [part$='button'] {
    color: var(--material-secondary-text-color);
  }

  [part='reveal-button'] {
    position: relative;
    cursor: pointer;
  }

  [part='reveal-button']:hover {
    color: var(--material-text-color);
  }

  [part='reveal-button'][hidden] {
    display: none !important;
  }

  :host([focused]) ::slotted([slot='reveal'])::before {
    background-color: var(--material-primary-text-color);
  }
`;

registerStyles('vaadin-password-field', [inputFieldShared, passwordField], { moduleId: 'material-password-field' });
