/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const gridTreeToggleStyles = css`
  :host {
    display: flex;
    align-items: center;
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
    width: calc(var(--_level, 0) * var(--vaadin-grid-tree-toggle-level-offset, 1em));
  }

  [part='toggle']::before {
    content: '';
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask-image: var(--_vaadin-icon-chevron-down);
  }

  :host(:not([expanded])) [part='toggle']::before {
    rotate: -90deg;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='toggle']::before {
      transition: rotate 120ms;
    }
  }

  :host([leaf]) [part='toggle'] {
    visibility: hidden;
  }

  slot {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
