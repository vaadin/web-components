/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const multiSelectComboBoxSelectAllButtonStyles = css`
  :host {
    display: block;
    flex: none;
    box-sizing: border-box;
    /* Do not let the label affect the width of the overlay */
    contain: inline-size;
    margin: var(--vaadin-item-overlay-padding, 4px);
    padding: var(--vaadin-item-padding, var(--vaadin-padding-xs) var(--vaadin-padding-inline-container));
    border-radius: var(--vaadin-item-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-text-color);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: start;
    cursor: var(--vaadin-clickable-cursor);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
  }

  /* Reserve the same space as the item checkmark icon */
  :host::before {
    content: '';
    display: inline-block;
    width: var(--vaadin-icon-size, 1lh);
    margin-inline-end: var(--vaadin-item-gap, var(--vaadin-gap-s));
  }

  :host([focused]) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }
`;
