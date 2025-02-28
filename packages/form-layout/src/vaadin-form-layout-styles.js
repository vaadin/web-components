/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const formLayoutStyles = css`
  :host {
    /* Default values */
    --vaadin-form-layout-row-spacing: 1em;
    --vaadin-form-layout-column-spacing: 2em;
    --vaadin-form-layout-label-width: 8em;
    --vaadin-form-layout-label-spacing: 1em;

    display: block;
    max-width: 100%;
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
    --_column-width-labels-above: var(--_column-width);
    --_column-width-labels-aside: calc(
      var(--_column-width) + var(--vaadin-form-layout-label-width) + var(--vaadin-form-layout-label-spacing)
    );

    display: flex;
    min-width: var(--_column-width-labels-above);
  }

  :host([auto-responsive]) #layout {
    --_grid-column-gap: var(--vaadin-form-layout-column-spacing);
    --_grid-column-width: var(--_column-width-labels-above);
    --_grid-column-max-total-gap: calc((var(--_max-columns) - 1) * var(--_grid-column-gap));
    --_grid-column-max-total-width: calc(var(--_max-columns) * var(--_column-width-labels-above));

    display: grid;
    grid-template-columns: repeat(auto-fill, var(--_grid-column-width));
    grid-auto-columns: 0;
    justify-items: start;
    gap: var(--vaadin-form-layout-row-spacing) var(--_grid-column-gap);

    /*
      To prevent the layout from exceeding the column limit defined by --_max-columns,
      its width needs to be constrained:

      1. "width" is used instead of "max-width" because, together with the default "flex: 0 1 auto",
      it allows the layout to shrink to its minimum width inside <vaadin-horizontal-layout>, which
      wouldn't work otherwise.

      2. "width" is used instead of "flex-basis" to make the layout expand to the maximum
      number of columns inside <vaadin-overlay>, which creates a new stacking context
      without a predefined width.
    */
    width: calc(var(--_grid-column-max-total-width) + var(--_grid-column-max-total-gap));

    /*
      Firefox requires min-width on both :host and #layout to allow the layout
      to shrink below the value specified in the CSS width property above.
    */
    min-width: inherit;
  }

  :host([auto-responsive]) #layout::before {
    background-position-y: var(--_column-width-labels-aside);
  }

  :host([auto-responsive]) #layout ::slotted(*) {
    grid-column: 1 / span min(var(--_colspan, 1), var(--_rendered-column-count));
    --_form-item-labels-above: initial; /* true */
    --_form-item-labels-aside: ' '; /* false */
  }

  :host([auto-responsive][auto-rows]) #layout ::slotted(*) {
    grid-column-start: var(--_grid-colstart, auto);
  }

  :host([auto-responsive][labels-aside]) #layout {
    --_grid-column-max-total-width: calc(var(--_max-columns) * var(--_column-width-labels-aside));
  }

  :host([auto-responsive][labels-aside]) #layout[fits-labels-aside] {
    --_grid-column-width: var(--_column-width-labels-aside);
  }

  :host([auto-responsive][labels-aside]) #layout[fits-labels-aside] ::slotted(*) {
    --_form-item-labels-above: ' '; /* false */
    --_form-item-labels-aside: initial; /* true */
  }
`;

export const formRowStyles = css`
  :host {
    display: contents;
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted(*) {
    grid-column: auto / span min(var(--_colspan, 1), var(--_rendered-column-count));
  }

  ::slotted(:first-child) {
    grid-column-start: 1;
  }
`;

export const formItemStyles = css`
  :host {
    --_form-item-labels-above: ' '; /* false */
    --_form-item-labels-aside: initial; /* true */

    display: inline-flex;
    align-items: var(--_form-item-labels-aside, baseline);
    flex-flow: var(--_form-item-labels-above, column) nowrap;
    justify-self: stretch;
    margin: calc(0.5 * var(--vaadin-form-item-row-spacing, var(--vaadin-form-layout-row-spacing, 1em))) 0;
  }

  :host([label-position='top']) {
    --_form-item-labels-above: initial; /* true */
    --_form-item-labels-aside: ' '; /* false */
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    width: var(
      --_form-item-labels-aside,
      var(--vaadin-form-item-label-width, var(--vaadin-form-layout-label-width, 8em))
    );
    flex: 0 0 auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, var(--vaadin-form-layout-label-spacing, 1em));
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
