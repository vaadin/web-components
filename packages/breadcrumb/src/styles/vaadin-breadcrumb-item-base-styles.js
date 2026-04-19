/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
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

  [part='separator']::before {
    content: var(--vaadin-breadcrumb-separator-content, '\\203A');
    color: var(--vaadin-text-color-secondary, inherit);
  }

  :host([current]) [part='separator'] {
    display: none;
  }

  :host([truncate]) {
    min-width: 0;
  }

  :host([truncate]) [part='link'] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;
