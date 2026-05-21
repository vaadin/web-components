/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbsItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) [part='link'] {
    color: var(--vaadin-text-color-disabled);
  }

  :host([current]) [part='nolink'] {
    color: var(--vaadin-text-color);
  }

  [part='link']:focus-visible {
    border-radius: var(--vaadin-radius-s);
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 0;
  }

  :host::after {
    content: '';
    display: inline-block;
    width: 1em;
    height: 1em;
    color: var(--vaadin-text-color-secondary);
    background: currentColor;
    mask: var(--vaadin-breadcrumbs-separator, var(--_vaadin-icon-chevron-right)) center / contain no-repeat;
  }

  :host(:last-of-type)::after,
  :host([current])::after {
    display: none;
  }

  :host([dir='rtl'])::after {
    transform: scaleX(-1);
  }

  /* Overlay context: link/nolink fills the full row so the entire padded
     area is clickable and the focus ring wraps the full target. */
  :host([slot='overlay']) {
    display: flex;
  }

  :host([slot='overlay']) [part='link'],
  :host([slot='overlay']) [part='nolink'] {
    flex: 1;
    padding: var(--vaadin-item-overlay-padding, 4px var(--vaadin-padding-inline-container));
    border-radius: var(--vaadin-radius-m);
    color: var(--vaadin-text-color);
  }

  :host([slot='overlay']) [part='link']:focus-visible {
    border-radius: var(--vaadin-radius-m);
  }

  @media (any-hover: hover) {
    :host([slot='overlay']) [part='link'] {
      text-decoration: none;
    }
  }

  :host([slot='overlay'])::after {
    display: none;
  }

  @media (forced-colors: active) {
    :host::after {
      background: CanvasText;
    }
  }
`;
