/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const accordionPanel = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='content'] {
    box-sizing: border-box;
  }

  :host(:not([opened])) [part='content'] {
    display: none !important;
  }

  :host([focus-ring]) {
    --_focus-ring: 1;
  }
`;
