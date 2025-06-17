/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const messageInputStyles = css`
  :host {
    align-items: flex-start;
    box-sizing: border-box;
    display: flex;
    max-height: 50vh;
    overflow: hidden;
    flex-shrink: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted([slot='button']) {
    flex-shrink: 0;
  }

  ::slotted([slot='textarea']) {
    align-self: stretch;
    flex-grow: 1;
  }
`;
