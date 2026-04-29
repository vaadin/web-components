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
import { css, unsafeCSS } from 'lit';

/**
 * Declarations that pin the host or slotted element to the fixed
 * `--vaadin-dashboard-row-height` (scaled by `--vaadin-dashboard-widget-rowspan` and the
 * inter-row `--_gap`). Imported by the widget host and the section's slotted rule
 * because the calc must live on each capped element so `var(--vaadin-dashboard-widget-rowspan)`
 * resolves against that element's own context.
 *
 * When `--vaadin-dashboard-row-height` is unset the calc is invalid, so the variable is
 * the guaranteed-invalid value and both `min-height` and `max-height` fall back to their
 * initial values (`auto` / `none`) — no cap, and inline heights work normally outside
 * the feature.
 */
export const widgetFixedHeightDeclarations = unsafeCSS`
    --_widget-fixed-height: calc(
      var(--vaadin-dashboard-widget-rowspan, 1) * var(--vaadin-dashboard-row-height) +
        (var(--vaadin-dashboard-widget-rowspan, 1) - 1) * var(--_gap)
    );
    min-height: var(--_widget-fixed-height);
    max-height: var(--_widget-fixed-height);
`;

export const dashboardLayoutStyles = css`
  :host {
    display: block;
    overflow: auto;
    box-sizing: border-box;
    width: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([dense-layout]) #grid {
    grid-auto-flow: dense;
  }

  #grid {
    box-sizing: border-box;

    /* Padding around dashboard edges */
    --_default-padding: var(--vaadin-padding-l);
    --_padding: max(0px, var(--vaadin-dashboard-padding, var(--_default-padding)));
    padding: var(--_padding);

    /* Gap between widgets */
    --_default-gap: var(--vaadin-gap-s);
    --_gap: max(0px, var(--vaadin-dashboard-gap, var(--_default-gap)));
    gap: var(--_gap);

    /* Default min and max column widths */
    --_default-col-min-width: 20em;
    --_default-col-max-width: 1fr;

    /* Effective min and max column widths */
    --_col-min-width: var(--vaadin-dashboard-col-min-width, var(--_default-col-min-width));
    --_col-max-width: var(--vaadin-dashboard-col-max-width, var(--_default-col-max-width));

    /* Effective max column count */
    --_col-max-count: var(--vaadin-dashboard-col-max-count, var(--_col-count));

    /* Effective column count */
    --_effective-col-count: min(var(--_col-count), var(--_col-max-count));

    /* Default row min height */
    --_default-row-min-height: 12em;
    /* Effective row min height. A fixed row height takes precedence so the parent track also collapses to it. */
    /* prettier-ignore */
    --_row-min-height: var(--vaadin-dashboard-row-height, var(--vaadin-dashboard-row-min-height, var(--_default-row-min-height)));
    /* Effective row height */
    --_row-height: minmax(var(--_row-min-height, auto), auto);

    display: grid;
    overflow: hidden;
    min-width: calc(var(--_col-min-width) + var(--_padding) * 2);

    grid-template-columns: repeat(
      var(--_effective-col-count, auto-fill),
      minmax(var(--_col-min-width), var(--_col-max-width))
    );

    grid-auto-rows: var(--_row-height);
  }

  ::slotted(*) {
    /* The grid-column value applied to children */
    --_item-column: span min(var(--vaadin-dashboard-widget-colspan, 1), var(--_effective-col-count, var(--_col-count)));

    grid-column: var(--_item-column);

    /* The grid-row value applied to children */
    --_item-row: span var(--vaadin-dashboard-widget-rowspan, 1);
    grid-row: var(--_item-row);
  }

  /* Pin slotted children to the fixed row height when one is set. Sections are excluded so they can grow to wrap multiple sub-rows. */
  ::slotted(:not(vaadin-dashboard-section)) {
    ${widgetFixedHeightDeclarations};
  }
`;
