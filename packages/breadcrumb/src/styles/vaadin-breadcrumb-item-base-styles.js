/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap, var(--vaadin-gap-xs, 0.25em));
    box-sizing: border-box;
    font: inherit;
    color: inherit;
    line-height: inherit;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not(:last-child))::after {
    content: var(--vaadin-breadcrumb-separator-symbol, '/');
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary, #6b7280));
    font-size: var(--vaadin-breadcrumb-separator-size, inherit);
    flex: none;
    user-select: none;
    pointer-events: none;
  }

  [part='link'] {
    display: inline-flex;
    align-items: center;
    gap: var(--vaadin-breadcrumb-item-gap, var(--vaadin-gap-xs, 0.25em));
    text-decoration: none;
    color: inherit;
    font: inherit;
    border-radius: var(--vaadin-radius-s, 0.25em);
    outline: none;
  }

  a[part='link'] {
    cursor: var(--vaadin-clickable-cursor, pointer);
  }

  a[part='link']:hover {
    text-decoration: underline;
  }

  a[part='link']:focus-visible {
    outline: var(--vaadin-focus-ring-width, 2px) solid var(--vaadin-focus-ring-color, #1e90ff);
    outline-offset: 2px;
  }

  :host([disabled]) [part='link'] {
    color: var(--vaadin-text-color-disabled, #9ca3af);
    cursor: var(--vaadin-disabled-cursor, default);
    pointer-events: none;
  }

  :host(:last-child) [part='link'] {
    font-weight: var(--vaadin-breadcrumb-current-font-weight, 600);
    color: var(--vaadin-breadcrumb-current-text-color, var(--vaadin-text-color, inherit));
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
