/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const uploadStyles = css`
  :host {
    display: block;
    position: relative;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  [hidden] {
    display: none !important;
  }
`;
