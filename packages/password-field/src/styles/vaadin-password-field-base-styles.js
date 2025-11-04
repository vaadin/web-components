/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const passwordFieldStyles = css`
  [part~='reveal-button']::before {
    display: none;
  }

  [part='input-field']:has([part~='reveal-button']:focus-within) {
    outline: none;
    --vaadin-input-field-border-color: inherit;
  }

  :host([readonly]) [part~='reveal-button'] {
    color: var(--vaadin-input-field-button-text-color, var(--vaadin-text-color-secondary));
  }
`;
