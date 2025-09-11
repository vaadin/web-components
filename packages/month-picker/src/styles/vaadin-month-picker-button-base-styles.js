/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';

const monthPickerButton = css`
  :host {
    padding: 4px;
  }

  :host(:not([dir='rtl'])[part~='prev-year-button'])::before,
  :host([dir='rtl'][part~='next-year-button'])::before {
    rotate: 90deg;
  }

  :host(:not([dir='rtl'])[part~='next-year-button'])::before,
  :host([dir='rtl'][part~='prev-year-button'])::before {
    rotate: -90deg;
  }

  :host::before {
    background: currentColor;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask: var(--_vaadin-icon-chevron-down) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
    width: var(--vaadin-icon-size, 1lh);
  }
`;

export const monthPickerButtonStyles = [buttonStyles, monthPickerButton];
