/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const uploadIconStyles = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
