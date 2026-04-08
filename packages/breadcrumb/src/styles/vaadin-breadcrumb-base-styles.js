/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
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

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap);
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  [part='overflow'] {
    display: inline-flex;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap);
    flex: none;
    list-style: none;
  }

  [part='overflow']::after {
    content: var(--vaadin-breadcrumb-separator-symbol, '/');
    color: var(--vaadin-breadcrumb-separator-color);
    font-size: var(--vaadin-breadcrumb-separator-size);
    flex: none;
    user-select: none;
    pointer-events: none;
  }

  [part='overflow'][hidden] {
    display: none !important;
  }

  [part='overflow'] button {
    all: unset;
    cursor: var(--vaadin-clickable-cursor, pointer);
  }

  [part='overflow'] button:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 2px;
  }
`;
