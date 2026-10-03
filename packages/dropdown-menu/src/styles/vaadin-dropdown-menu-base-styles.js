/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const dropdownMenuStyles = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* The modal overlay sets pointer-events: none on body */
  :host([opened]) {
    pointer-events: auto;
  }

  ::slotted([slot='button']) {
    width: 100%;
  }
`;
