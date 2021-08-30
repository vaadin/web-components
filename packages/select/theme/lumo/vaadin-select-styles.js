/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import '@vaadin/text-field/theme/lumo/vaadin-input-field-shared-styles.js';

registerStyles(
  'vaadin-select',
  css`
    [part='input-field'] ::slotted(button) {
      min-height: var(--lumo-size-m);
      padding: 0 0.25em;
    }

    :host(:not([theme*='align'])) ::slotted(button) {
      text-align: start;
    }

    :host(:not([has-value])) [part='input-field'] ::slotted(button) {
      color: inherit;
      transition: opacity 0.175s 0.1s;
      opacity: 0.5;
    }

    [part='toggle-button']::before {
      content: var(--lumo-icons-dropdown);
    }

    /* Highlight the toggle button when hovering over the entire component */
    :host(:hover:not([readonly]):not([disabled])) [part='toggle-button'] {
      color: var(--lumo-contrast-80pct);
    }

    /* TODO: refactor to avoid overriding text-field styles */
    :host [part='input-field'] ::slotted(button) {
      font-weight: 500;
      color: var(--lumo-body-text-color);
    }
  `,
  { moduleId: 'lumo-select', include: ['lumo-input-field-shared-styles'] }
);

registerStyles(
  'vaadin-select-overlay',
  css`
    :host {
      --_lumo-item-selected-icon-display: block;
    }

    :host([bottom-aligned]) {
      justify-content: flex-end;
    }

    [part~='overlay'] {
      min-width: var(--vaadin-select-text-field-width);
    }

    /* Small viewport adjustment */
    :host([phone]) {
      top: 0 !important;
      right: 0 !important;
      bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
      left: 0 !important;
      align-items: stretch;
      justify-content: flex-end;
    }

    :host([theme~='align-left']) {
      text-align: left;
    }

    :host([theme~='align-right']) {
      text-align: right;
    }

    :host([theme~='align-center']) {
      text-align: center;
    }
  `,
  { moduleId: 'lumo-select-overlay-styles', include: ['lumo-menu-overlay'] }
);
