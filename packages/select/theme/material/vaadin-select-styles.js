/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/material/vaadin-input-container-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { item } from '@vaadin/item/theme/material/vaadin-item-styles.js';
import { listBox } from '@vaadin/list-box/theme/material/vaadin-list-box-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { menuOverlay } from '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-select-item', item, { moduleId: 'material-select-item' });

registerStyles('vaadin-select-list-box', listBox, { moduleId: 'material-select-list-box' });

const select = css`
  :host {
    -webkit-tap-highlight-color: transparent;
  }

  /* placeholder styles */
  :host [part='input-field'] ::slotted([slot='value'][placeholder]) {
    color: var(--material-disabled-text-color);
    transition: opacity 0.175s 0.1s;
    opacity: 1;
  }

  :host([has-label]:not([focused]):not([invalid]):not([theme='always-float-label']))
    ::slotted([slot='value'][placeholder]) {
    opacity: 0;
    /* Avoid a flash of the placeholder text on init */
    transition: none;
  }

  :host [part='input-field'] ::slotted([slot='value']) {
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
`;

registerStyles('vaadin-select', [inputFieldShared, select], { moduleId: 'material-select' });

registerStyles(
  'vaadin-select-value-button',
  css`
    :host {
      font: inherit;
      letter-spacing: normal;
      text-transform: none;
    }

    ::slotted(*) {
      font: inherit;
      padding: 4px 0;
    }

    ::slotted(*:hover) {
      background-color: transparent;
    }
  `,
  { moduleId: 'material-select-value-button' },
);

registerStyles('vaadin-select-overlay', [menuOverlay], { moduleId: 'material-select-overlay' });
