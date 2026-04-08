/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap, var(--vaadin-gap-xs, 0.25em));
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  [part='overflow'] {
    display: inline-flex;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap, var(--vaadin-gap-xs, 0.25em));
    flex: none;
    list-style: none;
  }

  [part='overflow']::after {
    content: var(--vaadin-breadcrumb-separator-symbol, '/');
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary, #6b7280));
    font-size: var(--vaadin-breadcrumb-separator-size, inherit);
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
    font: inherit;
    color: inherit;
    padding: 0 0.125em;
    border-radius: var(--vaadin-radius-s, 0.25em);
    letter-spacing: 0.1em;
  }

  [part='overflow'] button:focus-visible {
    outline: var(--vaadin-focus-ring-width, 2px) solid var(--vaadin-focus-ring-color, #1e90ff);
    outline-offset: 2px;
  }
`;
