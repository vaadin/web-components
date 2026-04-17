/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    color: var(--vaadin-breadcrumb-item-text-color, var(--vaadin-text-color-secondary));
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([current]) {
    color: var(--vaadin-breadcrumb-item-current-text-color, var(--vaadin-text-color));
    font-weight: 500;
  }

  [part='link'] {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    text-decoration: none;
    color: inherit;
    outline: none;
  }

  :host([has-path]:not([current])) [part='link'] {
    cursor: var(--vaadin-clickable-cursor);
  }

  :host([has-path]:not([current])) [part='link']:hover {
    color: var(--vaadin-breadcrumb-item-hover-text-color, var(--vaadin-text-color));
    text-decoration: underline;
  }

  :host([has-path]:not([current])) [part='link']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 2px;
    border-radius: var(--vaadin-radius-s, 2px);
  }

  :host(:not([has-path])) [part='link'] {
    cursor: default;
  }

  slot:not([name]) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([overflow-truncated]) {
    min-width: 0;
    max-width: 100%;
  }

  :host([overflow-truncated]) [part='link'] {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }

  :host([overflow-truncated]) slot:not([name]) {
    min-width: 0;
  }

  @media (forced-colors: active) {
    :host {
      color: CanvasText !important;
    }

    :host([has-path]) [part='link'] {
      color: LinkText !important;
    }

    :host([has-path]) [part='link']:hover {
      color: ActiveText !important;
    }

    :host([current]) {
      color: CanvasText !important;
      font-weight: bold;
    }
  }
`;
