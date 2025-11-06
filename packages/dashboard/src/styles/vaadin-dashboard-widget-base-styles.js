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
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { dashboardWidgetAndSectionStyles } from './vaadin-dashboard-widget-section-base-styles.js';

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
    border-color: var(--_widget-border-color);
  }

  :host::before {
    content: '';
    position: absolute;
    inset: 0;
    border-color: inherit;
    border-width: var(--_widget-border-width);
    border-style: solid;
    border-radius: inherit;
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
    min-height: 1em;
  }

  [part~='resize-button'] {
    position: absolute;
    bottom: 0;
    inset-inline-end: 0;
    z-index: 1;
    overflow: hidden;
    touch-action: none;
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
  }

  :host([selected]) {
    --vaadin-dashboard-widget-shadow: var(--_widget-selected-shadow);
  }

  :host([resizing])::after {
    content: '';
    z-index: 2;
    position: absolute;
    top: 0;
    width: var(--_widget-resizer-width, 0);
    height: var(--_widget-resizer-height, 0);
    background: color-mix(in srgb, currentColor 5%, var(--_widget-background) 70%);
    border-color: color-mix(in srgb, currentColor 10%, transparent);
    border-width: var(--_widget-border-width);
    border-style: solid;
    border-radius: inherit;
  }

  /* Widget parts */
  header {
    padding: var(--vaadin-dashboard-widget-header-padding, var(--vaadin-padding-block) var(--vaadin-padding-inline));
  }

  :host([editable]) header {
    padding: var(--vaadin-dashboard-widget-header-padding, var(--vaadin-padding-s));
  }

  header:has([part~='title'][hidden]) {
    padding: 0;
  }
`;

export const dashboardWidgetStyles = [widgetStyles, dashboardWidgetAndSectionStyles];
