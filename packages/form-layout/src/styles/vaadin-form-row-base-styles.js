/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const formRowStyles = css`
  :host {
    display: contents;
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted(*) {
    grid-column: auto / span min(var(--_grid-colspan, 1), var(--_grid-rendered-column-count));
  }

  ::slotted(:first-child) {
    grid-column-start: 1;
  }
`;
