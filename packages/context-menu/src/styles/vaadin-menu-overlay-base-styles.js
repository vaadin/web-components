/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const menuOverlayStyles = css`
  :host {
    align-items: flex-start;
    justify-content: flex-start;
  }

  :host([right-aligned]),
  :host([end-aligned]) {
    align-items: flex-end;
  }

  :host([bottom-aligned]) {
    justify-content: flex-end;
  }

  [part='backdrop'] {
    background: transparent;
  }

  [part='content'] {
    padding: var(--vaadin-item-overlay-padding, 4px);
  }

  /* TODO keyboard focus becomes visible even when navigating the menu with the mouse */
  [part='overlay']:focus-visible {
    outline: none;
  }
`;
