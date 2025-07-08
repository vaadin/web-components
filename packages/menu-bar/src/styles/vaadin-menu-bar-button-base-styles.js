/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const menuBarButtonStyles = css`
  :host {
    flex-shrink: 0;
  }

  :host([focus-ring]) {
    z-index: 1;
  }

  :host([slot='overflow']) {
    margin-inline-end: 0;
  }

  .vaadin-button-container {
    gap: inherit;
  }

  :host(:not([slot='overflow']):not([theme~='icon'])[aria-haspopup]) [part='suffix'] {
    display: flex;
    align-items: center;
    gap: inherit;
  }

  :host(:not([slot='overflow']):not([theme~='icon'])[aria-haspopup]) [part='suffix']::after {
    background: currentColor;
    content: '';
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-chevron-down);
    width: var(--vaadin-icon-size, 1lh);
  }

  :host([theme~='end-aligned'][first-visible]) {
    margin-inline-start: auto;
  }
`;
