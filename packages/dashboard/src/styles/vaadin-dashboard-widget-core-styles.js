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
import { dashboardWidgetAndSectionStyles } from './vaadin-dashboard-widget-section-core-styles.js';

const widgetStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    grid-column: var(--_item-column);
    grid-row: var(--_item-row);
    position: relative;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([editable])) [part~='resize-button'] {
    display: none;
  }

  [part~='content'] {
    flex: 1;
    overflow: hidden;
  }

  [part~='resize-button'] {
    position: absolute;
    bottom: 0;
    inset-inline-end: 0;
    z-index: 1;
    overflow: hidden;
  }

  :host([resizing])::after {
    content: '';
    z-index: 2;
    position: absolute;
    top: -1px;
    width: var(--_widget-resizer-width, 0);
    height: var(--_widget-resizer-height, 0);
    background: rgba(0, 0, 0, 0.1);
    border-radius: inherit;
  }
`;

export const dashboardWidgetStyles = [widgetStyles, dashboardWidgetAndSectionStyles];
