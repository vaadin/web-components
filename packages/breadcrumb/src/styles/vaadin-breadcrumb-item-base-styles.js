/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='link'] {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }
`;
