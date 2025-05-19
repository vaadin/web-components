/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const selectOverlayStyles = css`
  @layer base {
    :host {
      align-items: flex-start;
      justify-content: flex-start;
    }

    :host(:not([phone])) [part='overlay'] {
      min-width: var(--vaadin-select-overlay-width, var(--vaadin-select-text-field-width));
    }

    [part='content'] {
      padding: var(--vaadin-item-overlay-padding, 4px);
    }
  }
`;
