/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const valueButton = css`
  :host {
    min-height: 1lh;
    outline: none;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }

  ::slotted(*) {
    padding: 0;
    cursor: inherit;
  }

  .vaadin-button-container,
  [part='label'] {
    display: contents;
  }

  :host([disabled]) {
    pointer-events: none;
  }
`;
