/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const menuBarStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='container'] {
    position: relative;
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    overflow: hidden;
  }
`;
