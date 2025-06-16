/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const uploadFileListStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
`;
