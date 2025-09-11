/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const monthPickerOverlayStyles = css`
  [part='overlay'] {
    min-width: var(--vaadin-field-default-width, 12em);
  }

  [part='content'] {
    padding: var(--vaadin-month-picker-overlay-padding, var(--vaadin-padding-s));
  }
`;
