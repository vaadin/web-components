/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const virtualListStyles = css`
  :host {
    align-self: stretch;
    display: block;
    flex: auto;
    height: 400px;
    overflow: auto;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([grid])) #items > ::slotted(*) {
    width: 100%;
  }

  #items {
    position: relative;
  }
`;
