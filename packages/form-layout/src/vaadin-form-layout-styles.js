/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const formLayoutStyles = css`
  :host {
    display: block;
    max-width: 100%;
    /* CSS API for host */
    --vaadin-form-item-label-width: 8em;
    --vaadin-form-item-label-spacing: 1em;
    --vaadin-form-layout-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em; /* (default) */
    align-self: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([auto-responsive])) #layout {
    display: flex;

    align-items: baseline; /* default \`stretch\` is not appropriate */

    flex-wrap: wrap; /* the items should wrap */
  }

  :host(:not([auto-responsive])) #layout ::slotted(*) {
    /* Items should neither grow nor shrink. */
    flex-grow: 0;
    flex-shrink: 0;

    /* Margins make spacing between the columns */
    margin-left: calc(0.5 * var(--vaadin-form-layout-column-spacing));
    margin-right: calc(0.5 * var(--vaadin-form-layout-column-spacing));
  }

  #layout ::slotted(br) {
    display: none;
  }

  :host([auto-responsive]) {
    --_column-width: var(--vaadin-form-layout-column-width);
    --_column-max-count: var(--vaadin-form-layout-max-columns);

    display: flex;
    min-width: var(--_column-width);
  }

  :host([auto-responsive]) #layout {
    --_max-total-gap-width: calc((var(--_column-max-count) - 1) * var(--vaadin-form-layout-column-spacing));
    --_max-total-col-width: calc(var(--_column-max-count) * var(--_column-width));

    --_column-min-width: var(--_column-width);
    --_column-max-width: var(--_column-width);

    /*
      The column count is calculated in JS using getComputedStyle(this.$.layout).gridTemplateColumns
      after the layout is rendered.
    */
    --_rendered-column-count: 1;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--_column-min-width), var(--_column-max-width)));
    gap: var(--vaadin-form-layout-row-spacing) var(--vaadin-form-layout-column-spacing);

    /*
      Auto-columns can be created when an item's colspan exceeds the rendered column count.
      By setting auto-columns to 0, we exclude these columns from --_rendered-column-count,
      which is then used to cap the colspan.
    */
    grid-auto-columns: 0;

    /*
      A max width needs to be defined to prevent the layout from expanding to more columns
      than allowed by the --_column-max-count property:

      1. "width" + "flex-grow" are used instead of "max-width" for the layout to be able to
      shrink to its minimum width in <vaadin-horizontal-layout>, which doesn't work otherwise.

      2. "width" is used instead of "flex-basis" to make the layout expand to the maximum
      number of columns in <vaadin-overlay> which creates a new stacking context without
      an explicit default width.
    */
    width: calc(var(--_max-total-col-width) + var(--_max-total-gap-width));
    flex-grow: 0;
    flex-shrink: 1;

    /*
      Firefox requires min-width on both :host and #layout to allow the layout
      to shrink below the value specified in the CSS width property above.
    */
    min-width: inherit;
  }

  :host([auto-responsive]) #layout ::slotted(*) {
    grid-column: var(--_colstart, auto) / span min(var(--_colspan), var(--_rendered-column-count));
  }

  :host([auto-responsive][expand-columns]) #layout {
    /*
      This construction makes the CSS grid columns switch from a fixed width
      to the same width expressed as a percentage of the total width of the
      maximum number of columns and gaps when the layout reaches that width.
      This prevents the CSS grid from creating new columns and instead causes
      it to keep the existing columns expanding evenly to fill available space
      when --_column-max-count is reached.
    */
    --_column-min-width: max(
      var(--_column-width),
      calc((100% - var(--_max-total-gap-width)) / var(--_column-max-count))
    );

    /*
      Set the max column width to 1fr to allow CSS grid columns to expand
      and evenly distribute any unused space that remains when there isn't
      enough room for a new column.
    */
    --_column-max-width: 1fr;

    /*
      Allow the layout to take up full available width of the parent element.
    */
    flex-grow: 1;
  }
`;

export const formItemStyles = css`
  :host {
    display: inline-flex;
    flex-direction: row;
    align-items: baseline;
    margin: calc(0.5 * var(--vaadin-form-item-row-spacing, var(--vaadin-form-layout-row-spacing, 1em))) 0;
  }

  :host([label-position='top']) {
    flex-direction: column;
    align-items: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    width: var(--vaadin-form-item-label-width, 8em);
    flex: 0 0 auto;
  }

  :host([label-position='top']) #label {
    width: auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, 1em);
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
  }

  #content ::slotted(.full-width) {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
`;
