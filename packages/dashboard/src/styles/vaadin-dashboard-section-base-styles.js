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
  /* stylelint-disable length-zero-no-unit */

  :host {
    display: grid;
    position: relative;
    grid-template-columns: subgrid;
    --_section-column: 1 / calc(var(--_effective-col-count) + 1);
    grid-column: var(--_section-column) !important;
    gap: var(--_gap);
    /* Dashboard section header height */
    grid-template-rows: minmax(0, auto) repeat(auto-fill, var(--_row-height));
    grid-auto-rows: var(--_row-height);
    border: var(--_widget-border-width) solid var(--_widget-border-color);
    border-radius: var(--vaadin-dashboard-section-border-radius, var(--vaadin-radius-l));
    padding: calc(var(--_gap) - var(--_widget-border-width));
    margin-inline: calc(var(--_gap) * -1);
    margin-block: var(--_gap);
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

  :host(:not([editable])) {
    --_widget-border-width: 0px;
  }
`;

export const dashboardSectionStyles = [sectionStyles, dashboardWidgetAndSectionStyles];
