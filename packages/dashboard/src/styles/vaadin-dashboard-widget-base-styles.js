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
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { dashboardWidgetAndSectionStyles } from './vaadin-dashboard-widget-section-core-styles.js';

const widgetStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    grid-column: var(--_item-column);
    grid-row: var(--_item-row);
    position: relative;
    background: var(--_widget-background);
    border-radius: var(--_widget-border-radius);
    box-shadow: var(--_widget-shadow);
  }

  :host::before {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--_widget-border-width));
    border: var(--_widget-border-width) solid var(--_widget-border-color);
    border-radius: calc(var(--_widget-border-radius) + var(--_widget-border-width));
    pointer-events: none;
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
    min-height: 1rem;
  }

  [part~='resize-button'] {
    position: absolute;
    bottom: 0;
    inset-inline-end: 0;
    z-index: 1;
    overflow: hidden;
    cursor: nwse-resize;
    --icon: var(--_vaadin-icon-resize);
  }

  :host([dir='rtl']) [part~='resize-button'] {
    cursor: sw-resize;
  }

  :host([dir='rtl']) [part~='resize-button'] .icon::before {
    transform: scaleX(-1);
  }

  /* Widget states */

  :host([editable]) {
    --vaadin-dashboard-widget-shadow: var(--_widget-editable-shadow);
    --_widget-border-width: 1px;
  }

  :host([focused])::before {
    border-width: var(--_focus-ring-width);
    border-color: var(--_focus-ring-color);
  }

  :host([selected]) {
    --vaadin-dashboard-widget-shadow: var(--_widget-selected-shadow);
  }

  :host([dragging]) {
    box-shadow: none;
    background: var(--_drop-target-background-color);
    border: var(--_drop-target-border);
  }

  :host([resizing])::after {
    content: '';
    z-index: 2;
    position: absolute;
    top: -1px;
    width: var(--_widget-resizer-width, 0);
    height: var(--_widget-resizer-height, 0);
    border-radius: inherit;
    background: var(--_drop-target-background-color);
    border: var(--_drop-target-border);
  }

  /* Widget parts */
  header {
    padding: var(--vaadin-padding-container);
  }
`;

export const dashboardWidgetStyles = [widgetStyles, dashboardWidgetAndSectionStyles];
