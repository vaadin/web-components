/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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

  ::slotted([slot='reveal']) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
  }

  ::slotted([slot='reveal'])::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--material-body-text-color);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.08s, opacity 0.01s;
    will-change: transform, opacity;
  }

  :host([focused]) ::slotted([slot='reveal'])::before {
    background-color: var(--material-primary-text-color);
  }

  ::slotted([slot='reveal']:hover)::before {
    opacity: 0.08;
  }

  ::slotted([slot='reveal']:focus)::before {
    opacity: 0.12;
  }

  ::slotted([slot='reveal']:active)::before {
    opacity: 0.16;
  }

  ::slotted([slot='reveal']:hover)::before,
  ::slotted([slot='reveal']:focus)::before {
    transform: scale(1.5);
  }
`;

registerStyles('vaadin-password-field', [inputFieldShared, passwordField], { moduleId: 'material-password-field' });
