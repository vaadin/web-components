/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const passwordField = css`
  [part='reveal-button']::before {
    content: var(--lumo-icons-eye);
  }

  :host([password-visible]) [part='reveal-button']::before {
    content: var(--lumo-icons-eye-disabled);
  }

  /* Make it easy to hide the button across the whole app */
  [part='reveal-button'] {
    position: relative;
    display: var(--lumo-password-field-reveal-button-display, block);
  }

  [part='reveal-button'][hidden] {
    display: none !important;
  }

  ::slotted([slot='reveal']) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: transparent;
    border: none;
  }

  ::slotted([slot='reveal']:focus) {
    border-radius: var(--lumo-border-radius-s);
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
    outline: none;
  }
`;

registerStyles('vaadin-password-field', [inputFieldShared, passwordField], { moduleId: 'lumo-password-field' });
