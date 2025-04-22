/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const numberFieldStyles = css`
  :host([step-buttons-visible]) ::slotted(input) {
    text-align: center;
  }

  :is([part='decrease-button'], [part='increase-button'])::before {
    background: var(--_vaadin-color-subtle);
    content: '';
    display: inherit;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
  }

  [part='decrease-button']::before {
    mask-image: var(--_vaadin-icon-minus);
  }

  [part='increase-button']::before {
    mask-image: var(--_vaadin-icon-plus);
  }

  :host([dir='rtl']) [part='input-field'] {
    direction: ltr;
  }

  :host([readonly]) [part$='button'] {
    pointer-events: none;
  }
`;
