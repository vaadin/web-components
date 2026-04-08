/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    box-sizing: border-box;
    min-width: 0;
  }

  :host([hidden]),
  :host([overflow-hidden]) {
    display: none !important;
  }

  [part='item'] {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }

  [part='link'] {
    display: inline-flex;
    align-items: center;
    gap: var(--vaadin-breadcrumb-item-gap, var(--vaadin-gap-xs, 4px));
    text-decoration: none;
    color: var(--vaadin-breadcrumb-link-color, var(--vaadin-text-color-link, inherit));
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([last]) [part='link'] {
    color: var(--vaadin-breadcrumb-current-color, var(--vaadin-text-color, inherit));
  }

  :host([disabled]) [part='link'] {
    color: var(--vaadin-text-color-disabled);
    pointer-events: none;
  }

  a[part='link'] {
    cursor: var(--vaadin-clickable-cursor, pointer);
  }

  a[part='link']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
    border-radius: var(--vaadin-radius-s, 4px);
  }

  @media (any-hover: hover) {
    a[part='link']:hover {
      text-decoration: underline;
    }
  }

  [part='separator'] {
    display: inline-block;
    flex-shrink: 0;
    font-family: var(--vaadin-breadcrumb-separator-font-family, inherit);
    font-size: var(--vaadin-breadcrumb-separator-size, var(--vaadin-icon-size, 1lh));
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary));
    padding-inline: var(--vaadin-breadcrumb-separator-gap, var(--vaadin-padding-xs, 6px));
  }

  [part='separator']::before {
    content: var(--vaadin-breadcrumb-separator-symbol, '/');
  }

  :host([last]) [part='separator'] {
    display: none;
  }

  slot[name='prefix']::slotted(*) {
    flex-shrink: 0;
  }

  @media (forced-colors: active) {
    a[part='link'] {
      color: LinkText;
    }

    :host([last]) [part='link'] {
      color: CanvasText;
    }

    :host([disabled]) [part='link'] {
      color: GrayText !important;
    }

    [part='separator'] {
      color: CanvasText;
    }
  }
`;
