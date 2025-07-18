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

const sectionStyles = css`
  :host {
    display: grid;
    position: relative;
    grid-template-columns: subgrid;
    --_section-column: 1 / calc(var(--_effective-col-count) + 1);
    grid-column: var(--_section-column) !important;
    gap: var(--_gap, 1rem);
    /* Dashboard section header height */
    --_section-header-height: minmax(0, auto);
    grid-template-rows: var(--_section-header-height) repeat(auto-fill, var(--_row-height));
    grid-auto-rows: var(--_row-height);
    border-radius: var(--vaadin-radius-m);
    --_section-outline-offset: calc(min(var(--_gap), var(--_padding)) / 3);
    --_focus-ring-offset: calc((var(--_section-outline-offset) - var(--_focus-ring-width)));
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted(*) {
    --_item-column: span min(var(--vaadin-dashboard-widget-colspan, 1), var(--_effective-col-count, var(--_col-count)));

    grid-column: var(--_item-column);
    --_item-row: span var(--vaadin-dashboard-widget-rowspan, 1);
    grid-row: var(--_item-row);
  }

  header {
    grid-column: var(--_section-column);
  }

  :host::before {
    z-index: 2 !important;
  }

  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }

  /* Section states */

  :host([editable]) {
    outline: 1px solid var(--vaadin-border-color);
    outline-offset: calc(var(--_section-outline-offset) - 1px);
  }

  :host([focused])::after {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    border-radius: var(--vaadin-radius-m);
    z-index: 9;
    outline: var(--_focus-ring-width) solid var(--_focus-ring-color);
    outline-offset: var(--_focus-ring-offset);
  }
`;

export const dashboardSectionStyles = [sectionStyles, dashboardWidgetAndSectionStyles];
