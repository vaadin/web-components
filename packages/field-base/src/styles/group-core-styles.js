/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const group = () => css`
  :host {
    display: inline-flex;
  }

  :host::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  .vaadin-group-field-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  [part='group-field'] {
    display: flex;
    flex-wrap: wrap;
  }

  :host(:not([has-label])) [part='label'] {
    display: none;
  }
`;
