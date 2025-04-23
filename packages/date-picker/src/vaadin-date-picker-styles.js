/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const datePickerStyles = css`
  :host([opened]) {
    pointer-events: auto;
  }

  :host([dir='rtl']) [part='input-field'] {
    direction: ltr;
  }

  :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
    direction: rtl;
    text-align: left;
  }

  [part='toggle-button'] {
    color: var(--_vaadin-color-subtle);
  }

  [part='toggle-button']::before {
    content: '';
    display: block;
    background: currentColor;
    content: '';
    display: inherit;
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-calendar);
    width: var(--vaadin-icon-size, 1lh);
  }
`;
