/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/lumo/vaadin-input-container-styles.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { item } from '@vaadin/item/theme/lumo/vaadin-item-styles.js';
import { listBox } from '@vaadin/list-box/theme/lumo/vaadin-list-box-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { menuOverlay } from '@vaadin/vaadin-lumo-styles/mixins/menu-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-select-item', item, { moduleId: 'lumo-select-item' });

registerStyles('vaadin-select-list-box', listBox, { moduleId: 'lumo-select-list-box' });

const select = css`
  :host {
    /* Disable pointer focus-ring for select, not supported yet */
    --lumo-input-field-pointer-focus-visible: 0;
  }

  :host(:not([theme*='align'])) ::slotted([slot='value']) {
    text-align: start;
  }

  [part='input-field'] {
    cursor: var(--lumo-clickable-cursor);
  }

  [part='input-field'] ::slotted([slot='value']) {
    font-weight: var(--vaadin-input-field-value-font-weight, 500);
  }

  [part='input-field'] ::slotted([slot='value']:not([placeholder])) {
    color: var(--vaadin-input-field-value-color, var(--lumo-body-text-color));
  }

  :host([readonly]) [part='input-field'] ::slotted([slot='value']:not([placeholder])) {
    color: var(--lumo-secondary-text-color);
  }

  /* placeholder styles */
  [part='input-field'] ::slotted([slot='value'][placeholder]) {
    color: var(--vaadin-input-field-placeholder-color, var(--lumo-secondary-text-color));
  }

  :host(:is([readonly], [disabled])) ::slotted([slot='value'][placeholder]) {
    opacity: 0;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }

  /* Highlight the toggle button when hovering over the entire component */
  :host(:hover:not([readonly]):not([disabled])) [part='toggle-button'] {
    color: var(--lumo-contrast-80pct);
  }

  :host([theme~='small']) [part='input-field'] ::slotted([slot='value']) {
    --_lumo-selected-item-height: var(--lumo-size-s);
    --_lumo-selected-item-padding: 0;
  }
`;

registerStyles('vaadin-select', [inputFieldShared, select], { moduleId: 'lumo-select' });

registerStyles(
  'vaadin-select-value-button',
  css`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--vaadin-input-field-value-font-size, var(--lumo-font-size-m));
      padding: 0 0.25em;
      --_lumo-selected-item-height: var(--lumo-size-m);
      --_lumo-selected-item-padding: 0.5em;
    }

    ::slotted(*) {
      min-height: var(--_lumo-selected-item-height);
      padding-top: var(--_lumo-selected-item-padding);
      padding-bottom: var(--_lumo-selected-item-padding);
      font-size: inherit;
    }

    ::slotted(*:hover) {
      background-color: transparent;
    }
  `,
  { moduleId: 'lumo-select-value-button' },
);

const selectOverlay = css`
  :host {
    --_lumo-item-selected-icon-display: block;
  }

  /* Small viewport adjustment */
  :host([phone]) {
    /* stylelint-disable declaration-block-no-redundant-longhand-properties */
    top: 0 !important;
    right: 0 !important;
    bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
    left: 0 !important;
    /* stylelint-enable declaration-block-no-redundant-longhand-properties */
    align-items: stretch;
    justify-content: flex-end;
  }

  :host([no-vertical-overlap][top-aligned]) [part='overlay'] {
    margin-block-start: var(--lumo-space-xs);
  }

  :host([no-vertical-overlap][bottom-aligned]) [part='overlay'] {
    margin-block-end: var(--lumo-space-xs);
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
`;

registerStyles('vaadin-select-overlay', [menuOverlay, selectOverlay], { moduleId: 'lumo-select-overlay' });
