/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const monthPickerOverlayContentStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='header'] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--vaadin-month-picker-header-padding, 0 0 var(--vaadin-padding-s));
  }

  [part='month-grid'] {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    min-width: calc(var(--vaadin-month-picker-month-width, 2rem) * 4);
  }

  [part~='month'] {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: var(--vaadin-clickable-cursor);
    border-radius: var(--vaadin-month-picker-month-border-radius, var(--vaadin-radius-m));
    width: var(--vaadin-month-picker-month-width, 2rem);
    height: var(--vaadin-month-picker-month-height, 2rem);
  }

  [part~='month'][disabled] {
    pointer-events: none;
  }

  [part~='month']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }
`;
