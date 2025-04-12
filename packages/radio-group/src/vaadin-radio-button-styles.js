/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const radioButtonStyles = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    -webkit-tap-highlight-color: transparent;
  }

  .vaadin-radio-button-container {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
  }

  [part='radio'],
  ::slotted(input),
  ::slotted(label) {
    grid-row: 1;
  }

  [part='radio'],
  ::slotted(input) {
    grid-column: 1;
  }

  [part='radio'] {
    --_input-border-width: var(--vaadin-input-field-border-width, 0);
    --_input-border-color: var(--vaadin-input-field-border-color, transparent);
    width: var(--vaadin-radio-button-size, 1em);
    height: var(--vaadin-radio-button-size, 1em);
    box-shadow: inset 0 0 0 var(--_input-border-width, 0) var(--_input-border-color);
  }

  [part='radio']::before {
    content: '\\\\\\\\202F';
    display: block;
    line-height: var(--vaadin-radio-button-size, 1em);
    contain: paint;
  }

  /* visually hidden */
  ::slotted(input) {
    align-self: stretch;
    width: initial;
    height: initial;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  @media (forced-colors: active) {
    [part='radio'] {
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([focused]) [part='radio'] {
      outline-width: 2px;
    }

    :host([disabled]) [part='radio'] {
      outline-color: GrayText;
    }
  }
`;
