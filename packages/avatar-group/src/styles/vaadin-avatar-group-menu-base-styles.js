/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const avatarGroupMenuStyles = css`
  :host {
    display: block;
    padding: var(--vaadin-item-overlay-padding, 4px);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='items'] {
    display: contents;
  }
`;
