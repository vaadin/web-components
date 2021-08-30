/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

registerStyles(
  'vaadin-select',
  css`
    :host {
      display: inline-flex;
      -webkit-tap-highlight-color: transparent;
    }

    [part='input-field'] ::slotted(button) {
      color: inherit;
      text-align: inherit;
    }

    :host([has-value]) [part='input-field'] ::slotted(button) {
      color: var(--material-body-text-color);
    }

    [part='toggle-button']::before {
      content: var(--material-icons-dropdown);
    }

    :host([opened]) [part='toggle-button'] {
      transform: rotate(180deg);
    }

    :host([disabled]) {
      pointer-events: none;
    }
  `,
  { moduleId: 'material-select', include: ['material-input-field-shared-styles'] }
);

registerStyles(
  'vaadin-select-overlay',
  css`
    :host([bottom-aligned]) {
      justify-content: flex-end;
    }

    [part='overlay'] {
      min-width: var(--vaadin-select-text-field-width);
    }
  `,
  { moduleId: 'material-select-overlay-styles', include: ['material-menu-overlay'] }
);
