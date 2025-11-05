/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const gridTreeToggleStyles = css`
  :host {
    display: inline-flex;
    max-width: 100%;
    pointer-events: none;
  }

  /* Don't expand/collapse when clicking #level-spacer */
  [part] {
    pointer-events: auto;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([leaf])) {
    cursor: var(--vaadin-clickable-cursor);
  }

  #level-spacer,
  [part='toggle'] {
    flex: none;
  }

  #level-spacer {
    width: calc(var(--_level, 0) * var(--vaadin-grid-tree-toggle-level-offset, 16px));
  }

  /* Baseline alignment */
  #level-spacer::before {
    content: '\\2003' / '';
    display: inline-block;
    width: 0;
  }

  [part='toggle'] {
    margin-inline-end: var(--vaadin-gap-s);
  }

  [part='toggle']::before {
    content: '';
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--_vaadin-icon-chevron-down) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
  }

  :host(:not([expanded])) [part='toggle']::before {
    rotate: -90deg;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='toggle']::before {
      transition: var(--_non-focused-row-none, rotate 120ms);
    }
  }

  :host([leaf]) [part='toggle'] {
    visibility: hidden;
  }

  slot {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  @media (forced-colors: active) {
    [part='toggle']::before {
      background: CanvasText;
    }
  }
`;
