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
    flex-shrink: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Link part: interactive breadcrumb link */
  [part='link'] {
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration: underline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: var(--vaadin-breadcrumb-item-max-width, 12em);
    cursor: var(--vaadin-clickable-cursor);
  }

  [part='link']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  /* Current page: visually distinct from links (no underline, plain text) */
  :host([current]) [part='link'] {
    text-decoration: none;
    color: var(--vaadin-breadcrumb-current-text-color, var(--vaadin-text-color));
    pointer-events: none;
    cursor: default;
    font-weight: 500;
  }

  /* Disabled item */
  :host([disabled]) [part='link'] {
    pointer-events: none;
    cursor: var(--vaadin-disabled-cursor);
    opacity: 0.5;
    text-decoration: none;
  }

  /* Separator part */
  [part='separator'] {
    display: inline-flex;
    align-items: center;
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary));
    user-select: none;
  }

  :host([first]) [part='separator'] {
    display: none;
  }

  :host([dir='rtl']) [part='separator'] {
    scale: -1;
  }

  @media (forced-colors: active) {
    [part='link'] {
      color: LinkText;
    }

    :host([current]) [part='link'] {
      color: CanvasText;
      forced-color-adjust: none;
    }

    :host([disabled]) [part='link'] {
      color: GrayText;
      opacity: 1;
    }

    [part='separator'] {
      color: CanvasText;
    }
  }
`;
