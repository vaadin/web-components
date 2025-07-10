/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { detailsSummary } from '@vaadin/details/src/styles/vaadin-details-summary-base-styles.js';

export const accordionHeading = [
  detailsSummary('vaadin-accordion-heading'),
  css`
    button {
      align-items: center;
      appearance: none;
      background: transparent;
      border: 0;
      color: inherit;
      cursor: inherit;
      display: flex;
      font: inherit;
      gap: inherit;
      outline: none;
      padding: 0;
      touch-action: manipulation;
    }
  `,
];
