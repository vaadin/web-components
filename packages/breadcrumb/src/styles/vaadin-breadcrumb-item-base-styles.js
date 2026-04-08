/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap);
    white-space: nowrap;
    min-width: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not(:last-child))::after {
    content: var(--vaadin-breadcrumb-separator-symbol, '/');
    color: var(--vaadin-breadcrumb-separator-color);
    font-size: var(--vaadin-breadcrumb-separator-size);
    flex: none;
    user-select: none;
    pointer-events: none;
  }

  [part='link'] {
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  a[part='link'] {
    cursor: var(--vaadin-clickable-cursor, pointer);
  }

  :host(:not([disabled])) a[part='link']:hover {
    text-decoration: underline;
  }

  a[part='link']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 2px;
  }

  :host([disabled]) [part='link'] {
    pointer-events: none;
  }

  slot[name='prefix']::slotted(*) {
    flex: none;
  }

  @media (forced-colors: active) {
    a[part='link'] {
      color: LinkText;
    }

    :host(:last-child) [part='link'] {
      color: CanvasText;
    }

    :host([disabled]) [part='link'] {
      color: GrayText !important;
    }
  }
`;
