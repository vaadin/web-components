/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { comboBoxStyles } from '@vaadin/combo-box/src/styles/vaadin-combo-box-base-styles.js';

export const multiSelectComboBoxStyles = [
  comboBoxStyles,
  css`
    :host {
      max-width: 100%;
      --_input-min-width: var(--vaadin-multi-select-combo-box-input-min-width, 4rem);
      --_chip-min-width: var(--vaadin-multi-select-combo-box-chip-min-width, 48px);
      --_wrapper-gap: var(--vaadin-multi-select-combo-box-chips-gap, 2px);
    }

    [hidden] {
      display: none !important;
    }

    #chips {
      display: flex;
      align-items: center;
      gap: var(--vaadin-multi-select-combo-box-chips-gap, 2px);
    }

    ::slotted(input) {
      box-sizing: border-box;
      flex: 1 0 var(--_input-min-width);
    }

    ::slotted([slot='chip']),
    ::slotted([slot='overflow']) {
      flex: 0 1 auto;
    }

    ::slotted([slot='chip']) {
      overflow: hidden;
    }

    :host(:is([readonly], [disabled])) ::slotted(input) {
      flex-grow: 0;
      flex-basis: 0;
      padding: 0;
    }

    :host([readonly]:not([disabled])) [part~='toggle-button'] {
      display: block;
      color: var(--vaadin-input-field-button-text-color, var(--vaadin-text-color-secondary));
    }

    :host([readonly]:not([disabled])) [part$='button'] {
      cursor: var(--vaadin-clickable-cursor);
    }

    :host([auto-expand-vertically]) #chips {
      display: contents;
    }

    :host([auto-expand-horizontally]) {
      --vaadin-field-default-width: auto;
    }

    [part='select-all'] {
      appearance: none;
      display: flex;
      align-items: center;
      flex: none;
      box-sizing: border-box;
      /* Do not let the label affect the width of the overlay */
      contain: inline-size;
      margin: var(--vaadin-item-overlay-padding, 4px);
      padding: var(--vaadin-item-padding, var(--vaadin-padding-xs) var(--vaadin-padding-inline-container));
      column-gap: var(--vaadin-item-gap, var(--vaadin-gap-s));
      border: 0;
      border-radius: var(--vaadin-item-border-radius, var(--vaadin-radius-m));
      background: transparent;
      color: var(--vaadin-text-color);
      font: inherit;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: var(--vaadin-clickable-cursor);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    /* Reserve the same space as the item checkmark icon */
    [part='select-all']::before {
      content: '';
      width: var(--vaadin-icon-size, 1lh);
      flex: none;
    }

    [part='select-all']:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
    }

    [part='select-all']:not([hidden]) + slot::slotted(*) {
      border-top: 1px solid var(--vaadin-border-color-secondary);
    }
  `,
];
