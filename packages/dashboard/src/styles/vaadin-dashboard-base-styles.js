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
import { dashboardLayoutStyles } from './vaadin-dashboard-layout-base-styles.js';

const dashboard = css`
  #grid[item-resizing] {
    -webkit-user-select: none;
    user-select: none;
  }

  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }
`;

export const dashboardStyles = [dashboardLayoutStyles, dashboard];
