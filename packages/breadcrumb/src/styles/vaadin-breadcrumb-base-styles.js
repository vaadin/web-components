/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='container'] {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  ::slotted([data-overflow]) {
    background: none;
    border: none;
    padding-top: 0;
    padding-bottom: 0;
    cursor: pointer;
    font: inherit;
  }
`;
