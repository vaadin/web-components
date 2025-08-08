/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css } from 'lit';
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';

const dashboardButton = css`
  :host([theme~='tertiary']) {
    color: var(--vaadin-dashboard-button-text-color, var(--vaadin-color-subtle));
  }
`;

export const dashboardButtonStyles = [buttonStyles, dashboardButton];
