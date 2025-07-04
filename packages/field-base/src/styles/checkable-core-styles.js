/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, unsafeCSS } from 'lit';

export const checkable = (part, propName = part) => css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    -webkit-tap-highlight-color: transparent;
  }

  .vaadin-${unsafeCSS(propName)}-container {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
  }

  [part='${unsafeCSS(part)}'],
  ::slotted(input),
  [part='label'],
  ::slotted(label) {
    grid-row: 1;
  }

  [part='${unsafeCSS(part)}'],
  ::slotted(input) {
    grid-column: 1;
  }

  /* Control container (checkbox, radio button) */
  [part='${unsafeCSS(part)}'] {
    width: var(--vaadin-${unsafeCSS(propName)}-size, 1em);
    height: var(--vaadin-${unsafeCSS(propName)}-size, 1em);
    --_input-border-width: var(--vaadin-input-field-border-width, 0);
    --_input-border-color: var(--vaadin-input-field-border-color, transparent);
    box-shadow: inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
  }

  [part='${unsafeCSS(part)}']::before {
    display: block;
    content: '\\202F';
    line-height: var(--vaadin-${unsafeCSS(propName)}-size, 1em);
    contain: paint;
  }

  /* visually hidden */
  ::slotted(input) {
    cursor: inherit;
    margin: 0;
    align-self: stretch;
    appearance: none;
    width: initial;
    height: initial;
  }
`;
