/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
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

const sectionStyles = css`
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

  /* Mirror the layout's cap so non-widget children inside a section also stay pinned to the fixed row height. The calc must live on each slotted element so it picks up that element's --vaadin-dashboard-widget-rowspan. Sections nested inside a section are excluded so they can still grow. */
  ::slotted(:not(vaadin-dashboard-section)) {
    --_widget-fixed-height: calc(
      var(--vaadin-dashboard-widget-rowspan, 1) * var(--vaadin-dashboard-row-height) +
        (var(--vaadin-dashboard-widget-rowspan, 1) - 1) * var(--_gap)
    );
    min-height: var(--_widget-fixed-height);
    max-height: var(--_widget-fixed-height);
  }

  header {
    grid-column: var(--_section-column);
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
